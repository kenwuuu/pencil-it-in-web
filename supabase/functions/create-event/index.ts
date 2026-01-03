import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import admin from 'npm:firebase-admin';
import { format } from 'npm:date-fns';
// todo uncomment to run locally and then comment the other usage of serviceAccount
// import serviceAccount from '/Users/kenwu/WebstormProjects/pencil-it-in-web/supabase/firebase-secret.json' with { type: "json" };

// init .env file when running locally
await config({export: true});
const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SECRET") || '');

// init Firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

async function sendNotifications(deviceTokens: string[], title: string, body: string, dataPayload = {}): Promise<admin.messaging.BatchResponse | void> {
  // Validate that you have tokens to send to
  if (!deviceTokens || deviceTokens.length === 0) {
    console.warn("No device tokens provided to send message.");
    return;
  }

  // Define the message payload
  const message: admin.messaging.MulticastMessage = {
    notification: {
      title: title,
      body: body
    },
    // You can add custom data here that your app can process
    data: dataPayload,
    // The list of tokens to send the message to
    tokens: deviceTokens, // This must be an array of FCM registration tokens
  };

  try {
    // Send the message using sendEachForMulticast
    // This method handles up to 500 tokens per call.
    // If you have more than 500 tokens, you'll need to batch them yourself
    // and call this method multiple times.
    // Deno currently has issues with the Node libraries that Firebase libraries use and
    // will crash after a few seconds of calling this function. A problem for when I'm
    // suffering from success and have a user sending notifications to more than 500 friends
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log('Count of sent notifications:', response.successCount);
    console.log('Count of failed notifications:', response.failureCount);

    if (response.failureCount > 0) {
      console.log('Errors encountered:');
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Token at index ${idx} failed: ${resp.error?.code} - ${resp.error?.message}`);
          // You should typically remove invalid or "NotRegistered" tokens from your database here.
          // For example: if (resp.error.code === 'messaging/invalid-registration-token' || resp.error.code === 'messaging/registration-token-not-registered') {
          //   deleteTokenFromYourDatabase(deviceTokens[idx]);
          // }
        }
      });
    }

    return response;

  } catch (error) {
    console.error('Error sending multicast message:', error);
    throw error; // Re-throw or handle as appropriate for your backend
  }
}

// Helper function to create standardized responses
const createResponse = (data, status = 200)=>{
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};

// Helper function to handle CORS preflight
const handleCors = (req)=>{
  const origin = req.headers.get("origin") || "*";
  return new Response("ok", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
};

// Helper function to validate request body
const validateEventData = (body)=>{
  const { title, location, description, start_time, end_time } = body;
  if (!title || !location || !start_time || !end_time) {
    return {
      isValid: false,
      error: "Missing required fields: title, start_time, end_time"
    };
  }
  if (new Date(start_time) >= new Date(end_time)) {
    return {
      isValid: false,
      error: "Start time must be before end time"
    };
  }
  return {
    isValid: true,
    data: {
      title,
      location,
      description,
      start_time,
      end_time
    }
  };
};

// Helper function to create Supabase client with auth
const createAuthenticatedClient = (req)=>{
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: req.headers.get("Authorization") || ""
      }
    }
  });
};

async function getUserFirstName(supabase, user) {
  const {data: userFirstName, error: profileError} = await supabase
    .from("users")
    .select("first_name")
    .eq("id", user.id);

  const firstName = userFirstName?.[0]?.first_name;
  return firstName;
}

// Main handler for creating events
const handleCreateEvent = async (req)=>{
  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = validateEventData(body);
    if (!validation.isValid) {
      return createResponse({
        error: validation.error
      }, 400);
    }
    const { title, location, description, start_time, end_time } = validation.data;

    // Create authenticated Supabase client
    const supabase = createAuthenticatedClient(req);

    // Get authenticated user
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return createResponse({
        error: "Authorization token required"
      }, 401);
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return createResponse({
        error: "Invalid or expired token"
      }, 401);
    }

    const firstName = await getUserFirstName(supabase, user);
    const startTimeAsString = format(new Date(start_time), "MMMM do");  // converts 2025-06-02T14:32:04 to "June 2nd"

    // Create the event
    const { data: event, error: eventError } = await supabase.from("events").insert({
      title,
      location,
      description,
      start_time,
      end_time,
      user_id: user.id
    }).select().single();
    if (eventError) {
      console.error("Event creation error:", eventError);
      return createResponse({
        error: "Failed to create event"
      }, 400);
    } else {
      console.log(`Successfully created event - id: ${event.id}`)
    }

    // add self as participant
    const { error: participantsError } = await supabase.from("event_participants")
      .insert({
        event_id: event.id,
        user_id: user.id,
        attendance_status: 'yes',
    });
    console.log(`Successfully added self as participant to ${event.id}`)

    // Get all friends: get all rows where from public.friends where user_id=requestingUserId
    const { data: friends, error: friendsError } = await supabase.from("friends").select("friend_id").eq("user_id", user.id);
    if (friendsError) {
      console.error("Friends fetch error:", friendsError);
      return createResponse({
        error: "Failed to fetch friends"
      }, 400);
    }

    // Add friends as participants if there are any
    if (friends && friends.length > 0) {
      const participants = friends.map((friend)=>({
        event_id: event.id,
        user_id: friend.friend_id
      }));
      const { error: participantsError } = await supabase.from("event_participants").insert(participants);
      if (participantsError) {
        console.error("Participants creation error:", participantsError);
        // Don't fail the entire request if participants can't be added
        // The event was created successfully
        return createResponse({
          message: "Event created successfully, but failed to add some participants",
          event,
          warning: "Some friends may not have been added as participants"
        }, 201);
      } else {
        console.log(`Successfully added all invitees as participants`)
      }

      const friendUserIds = friends.map(friend => friend.friend_id);

      let { data: deviceTokens, error } = await supabase
        .from("fcm_tokens")
        .select("id")
        .in("user_id", friendUserIds);

      if (deviceTokens) {
        let notificationTokens: string[] = deviceTokens.map(token => token.id)
        console.log(`Notification tokens for invitees to event ${event.id}: `, notificationTokens)

        // If you have more than 500 tokens, you'd batch them:
        // const chunkSize = 500;
        // for (let i = 0; i < allYourDeviceTokens.length; i += chunkSize) {
        //   const chunk = allYourDeviceTokens.slice(i, i + chunkSize);
        //   sendNotifications(chunk, "New Update!", "Check out the latest features!");
        // }
        sendNotifications(
          notificationTokens,
          "pencil it in",
          `${firstName || "Someone"} invited you to "${title}" on ${startTimeAsString}.`
        )
          .then(() => console.log('Multicast notification send attempt completed.'))
          .catch(error => console.error('Overall multicast notification send process failed:', error));
      }
    }

    return createResponse({
      message: "Event created successfully",
      event,
      participants_added: friends?.length || 0
    }, 201);
  } catch (error) {
    console.error("Unexpected error:", error);
    return createResponse({
      error: "Internal server error"
    }, 500);
  }
};

// Main request handler
Deno.serve(async (req)=>{
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleCors(req);
  }

  // Handle POST requests for event creation
  if (req.method === "POST") {
    return await handleCreateEvent(req);
  }

  // Method not allowed
  return createResponse({
    error: `Method ${req.method} not allowed`
  }, 405);
});
