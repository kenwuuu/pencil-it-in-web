import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
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
    const {error: deleteError} = await supabaseClient
      .from('event_participants')
      .delete()
      .match({user_id: friendUserId})
      .in('event_id', eventIds);

    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({message: 'Deleted friend removed from upcoming events successfully'}), {
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