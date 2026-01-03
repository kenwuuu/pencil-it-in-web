import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";


Deno.serve(async (req: Request) => {
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

    let { first_name, last_name, email, username, password, profile_photo } = await req.json();

    console.log(profile_photo)

    // const {
    //   data: {user, session},
    //   error,
    // } = await supabaseClient.auth.signUp({
    //   data['email'],
    //   data['password'],
    // });
    // return {user, session, error};

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
}});