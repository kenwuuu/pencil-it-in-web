import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

Deno.serve(async (req: Request) => {
  // handle preflight checks and provide CORS headers
  const origin = req.headers.get("origin") || "*";
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  if (req.method === 'GET') {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user ID from the authorization token
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), { status: 401 });
    }

    // Step 1: Fetch friends
    const { data: friends, error: friendsError } = await supabaseClient
      .from('friends')
      .select('friend_id')
      .eq('user_id', user.id);

    if (friendsError) {
      return new Response(JSON.stringify({ error: friendsError.message }), { status: 400 });
    }

    // Step 2: Extract friend IDs
    const friendIds = friends.map(friend => friend.friend_id);

    // Step 3: Fetch user details for friends
    const { data: friendDetails, error: getFriendUserError } = await supabaseClient
      .from('users')
      .select('id, first_name, last_name, username, profile_photo_url, wants_to_hang_end_time, city')
      .in('id', friendIds);

    if (getFriendUserError) {
      return new Response(JSON.stringify({ error: getFriendUserError.message }), { status: 400 });
    }

    // Step 4: Combine friend IDs with their details
    const friendsWithDetails = friends.map(friend => {
      const userDetail = friendDetails.find(user => user.id === friend.friend_id);
      return {
        friend_id: friend.friend_id,
        first_name: userDetail?.first_name,
        last_name: userDetail?.last_name,
        username: userDetail?.username,
        profile_photo_url: userDetail?.profile_photo_url,
        wants_to_hang_end_time: userDetail?.wants_to_hang_end_time,
        city: userDetail?.city,
      };
    });

    return new Response(JSON.stringify(friendsWithDetails), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true"
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
});