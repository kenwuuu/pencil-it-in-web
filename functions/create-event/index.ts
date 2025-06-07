import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

await config({export: true});

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
    }
    const { error: participantsError } = await supabase.from("event_participants")
      .insert({
        event_id: event.id,
        user_id: user.id
    });
    // Get user's friends
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
