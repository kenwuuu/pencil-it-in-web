import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  const { friendUserId, addOrRemove } = await req.json();
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

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
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select('id')
      .eq('user_id', requestingUserId)
      .gte('start_time', new Date().toISOString().split('T')[0] + '');

    if (eventsError) throw eventsError;

    const eventIds = events.map(event => event.id);

    // Add or participants for the friendUserId in the user's events
    for (const eventId of eventIds) {
      const { error: addError } = await supabaseClient
        .from('event_participants')
        .insert({ user_id: friendUserId, event_id: eventId });

      if (addError) {
        // handle or log the error
        console.error(`Failed to add event ${eventId}:`, addError);
        if (!addError.message.includes("duplicate key")) throw addError;  // don't throw if error is for duplicate key
      }
    }

    return new Response(JSON.stringify({message: 'New friend added to upcoming events successfully'}), {
      headers: {'Content-Type': 'application/json'},
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});