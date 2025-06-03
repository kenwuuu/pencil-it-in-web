import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

await config({export: true});

Deno.serve(async (req)=>{
  // request body: {"username": "xXxDemonSlayerxXx"}

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

  try {
    // get requestingUserId
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    const requestingUserId = user.id;

    // Fetch friend's userID
    const { username } = await req.json();
    const { data: friendData, error: friendError } = await supabaseClient.from('users').select('id').eq('username', username).single();
    if (friendError) throw friendError;
    const friendUserId = friendData.id;

    // Update friendship status in public.friends
    const { error: updateError } = await supabaseClient.from('friends').insert([
      {
        user_id: requestingUserId,
        friend_id: friendUserId
      },
      {
        user_id: friendUserId,
        friend_id: requestingUserId
      }
    ]);
    if (updateError) throw updateError;

    // Add friend to user's upcoming events
    const { data: message, error: messageError } = await supabaseClient.functions.invoke(
      'add-user-to-all-upcoming-events', {
        body: {'friendUserId': friendUserId},
      },
    )
    if (messageError) throw messageError;

    console.log(message);
    // send Response to client
    return new Response(JSON.stringify({
      message: 'Friendship updated successfully'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
