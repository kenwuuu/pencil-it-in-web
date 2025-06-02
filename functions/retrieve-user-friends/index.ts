import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  // handle preflight checks and provide CORS headers
  const origin = req.headers.get("origin") || "*";
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
      .select('id, first_name, last_name')
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
      };
    });

    return new Response(JSON.stringify(friendsWithDetails), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
});