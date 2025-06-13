import { supabase } from '@/supabase-client/supabase-client.js';

export async function deleteEvent(eventId) {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('RPC error:', error);
  } else if (data[0]) {
    console.log('RPC result:', data);
    return data;
  } else {
    console.log('no results');
  }
  return null;
}
