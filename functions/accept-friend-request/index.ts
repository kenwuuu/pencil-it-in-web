import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

Deno.serve(async (req)=>{
  // request body: {"friendId": "fcad4372-b85a-468b-bd97-09014b90876e"}

  // handle preflight checks and provide CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
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

    // Get friend's userID
    const { friendId } = await req.json();

    // Update where user_id = requestingUserId and friend_id = friendId
    const { error: error1 } = await supabaseClient.from('friends').update({
      accepted: true
    }).eq('user_id', requestingUserId).eq('friend_id', friendId);
    if (error1) throw error1;

    // Update where user_id = friendId and friend_id = requestingUserId
    const { error: error2 } = await supabaseClient.from('friends').update({
      accepted: true
    }).eq('user_id', friendId).eq('friend_id', requestingUserId);
    if (error2) throw error2;

    // send Response to client
    return new Response(JSON.stringify({
      message: 'Friend request accepted successfully'
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
