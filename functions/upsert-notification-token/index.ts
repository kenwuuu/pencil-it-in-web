import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

// import env vars from .env file for local development
await config({ export: true });

Deno.serve(async (req)=>{
  // handle preflight checks and provide CORS headers
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

  // parse data from request body
  const { deviceTokenId, lastActiveAt, enable } = await req.json();
  console.log('deviceTokenId: ', deviceTokenId);
  console.log('lastActiveAt: ', lastActiveAt);
  console.log('enable: ', enable);

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

    // Upsert notification token
    const { data, error } = await supabaseClient.from('fcm_tokens').upsert({
      id: deviceTokenId,
      user_id: requestingUserId,
      last_active_at: lastActiveAt,
      enable: enable,
    }, {
      onConflict: 'id'
    });
    if (error) throw error;

    // send success response to client
    return new Response(JSON.stringify({message: 'Updated device notification token ID successfully'}), {
      headers: {'Content-Type': 'application/json'},
      status: 200,
    });
  } catch (error) {
    // send error response to client
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});