import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

Deno.serve(async (req) => {
  // handle preflight checks and provide CORS headers
  const origin = req.headers.get("origin") || "*";
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  if (req.method === 'POST') {
    // Create a Supabase client
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get the user ID from the authorization token
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), { status: 401 });
    }
    const requestingUserId = user.id;

    // Step 1: Get eventId and newAttendanceStatus
    const { eventId, newAttendanceStatus } = await req.json();

    // Step 2: update attendance status
    const { error: eventParticipantsError } = await supabaseClient
      .from('event_participants')
      .update({ 'attendance_status': newAttendanceStatus })
      .eq('event_id', eventId)
      .eq('user_id', requestingUserId);

    if (eventParticipantsError) {
      return new Response(JSON.stringify({ error: eventParticipantsError.message }), { status: 400 });
    }

    let { data, error } = await supabaseClient
      .rpc('get_event', {
        queryeventid: eventId
      })
    if (error) console.error(error)

    return new Response(JSON.stringify({
      event: data,
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true"
      }
    }));
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
});