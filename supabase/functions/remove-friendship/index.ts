import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

await config({ export: true });

// request body: { "friendUserId": "f18d6f00-b861-45bd-bad9-2d3c1b772323" }
Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "*";

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, apikey, x-client-info, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });

    // get requestingUserId
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    const requestingUserId = user.id;

    // get friendUserId from request body
    const { friendUserId } = await req.json();

    // Delete bidirectional friendship
    const { error: deleteError } = await supabaseClient.from('friends')
      .delete()
      .or(`and(user_id.eq.${requestingUserId},friend_id.eq.${friendUserId}),and(user_id.eq.${friendUserId},friend_id.eq.${requestingUserId})`);

    if (deleteError) throw deleteError;

    // Delete friend from user's upcoming events
    const {data: message, error: messageError} = await supabaseClient.functions.invoke(
      'handle-events-for-friendships', {
        body: {
          'requestingUserId': requestingUserId,
          'friendUserId': friendUserId,
          'addOrDelete': 'delete'
        },
      },
    )
    if (messageError) throw messageError;

    // Delete user from friend's upcoming events
    const {data: message1, error: messageError1} = await supabaseClient.functions.invoke(
      'handle-events-for-friendships', {
        body: {
          'requestingUserId': friendUserId,
          'friendUserId': requestingUserId,
          'addOrDelete': 'delete'
        },
      },
    )
    if (messageError1) throw messageError1;

    // respond to client
    return new Response(JSON.stringify({
      message: 'Friendship removed successfully'
    }), {
      headers: {
        "Access-Control-Allow-Origin": origin,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        "Access-Control-Allow-Origin": origin,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
