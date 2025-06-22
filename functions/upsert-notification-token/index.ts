import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

// import env vars from .env file for local development
await config({ export: true });

Deno.serve(async (req: Request) => {
  // mandatory handling of CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  // parse data from request body
  const { deviceTokenId, enable } = await req.json();

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

    // Get the requesting user's events
    const { data, error } = await supabaseClient
      .from('fcm_tokens')
      .upsert({ id: deviceTokenId, enable: enable, user_id: requestingUserId }, { onConflict: 'id'});
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