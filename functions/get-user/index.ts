import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

await config({ export: true });

// request body: { "userId": "f18d6f00-b861-45bd-bad9-2d3c1b772323" }
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

    // get userId from request body
    const { user_id } = await req.json();

    // Get user row
    const { data: userData, error: selectError } = await supabaseClient.from('users')
      .select('id, first_name, last_name, username, profile_photo_url')
      .eq('id', user_id)
      .single();
    if (selectError) throw selectError;

    // respond to client
    return new Response(JSON.stringify(userData), {
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
