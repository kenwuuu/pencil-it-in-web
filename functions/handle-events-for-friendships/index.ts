import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { config } from 'https://deno.land/x/dotenv/mod.ts';

await config({ export: true });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  const { requestingUserId, friendUserId, addOrDelete } = await req.json();

  if (!addOrDelete) {
    console.log("Did not receive addOrDelete in request. Please check your request.")

    return new Response(JSON.stringify({ error: "Malformed request. Did not receive addOrDelete in request. Please " +
        "check that your request has addOrDelete in it, we accept 'add' or 'delete'." }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  try {
    // get requestingUserId
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

    // Get the requesting user's events
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select('id')
      .eq('user_id', requestingUserId)
      .gte('start_time', new Date().toISOString().split('T')[0] + '');
    if (eventsError) throw eventsError;

    const eventIds = events.map(event => event.id);

    if (addOrDelete === "add") {
      // Add friend to requesting user's events
      for (const eventId of eventIds) {
        const {error: addError} = await supabaseClient
          .from('event_participants')
          .insert({user_id: friendUserId, event_id: eventId});

        if (addError) {
          // handle or log the error
          console.error(`Failed to add event ${eventId}:`, addError);
          if (!addError.message.includes("duplicate key")) throw addError;  // don't throw if error is for duplicate key
        }
      }
    } else if (addOrDelete === "delete") {
      // Delete friend from requesting user's events
      for (const eventId of eventIds) {
        const {error: deleteError} = await supabaseClient
          .from('event_participants')
          .delete()
          .eq('user_id', friendUserId)
          .eq('event_id', eventId);

        if (deleteError) {
          // handle or log the error
          console.error(`Failed to add event ${eventId}:`, deleteError);
          if (!deleteError.message.includes("duplicate key")) throw deleteError;  // don't throw if error is for duplicate key
        }
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