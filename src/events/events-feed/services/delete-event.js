import { supabase } from '@/supabase-client/supabase-client.js';

export async function deleteEvent(eventId) {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error while deleting event: ', error);
    throw error;
  }

  console.log('Successfully deleted event: ', eventId);
  return data;
}
