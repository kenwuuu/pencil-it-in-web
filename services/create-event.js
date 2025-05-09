import { supabase } from '../supabase-client/supabase-client.js';

/**
 * Creates a new event and manages cohosts and participants.
 *
 * @param {Object} eventDetails - Details of the event to create.
 * @param {Array} cohosts - List of cohost IDs.
 * @param {string} hostId - ID of the host creating the event.
 * @param {Array} [groupIds] - Optional list of group IDs to retrieve friends from.
 */
export async function createEvent(eventDetails, cohosts, hostId, groupIds = null) {
  try {
    // Step 1: Create a new event in public.events
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert(eventDetails)
      .select()
      .single();

    if (eventError) throw eventError;

    const eventId = event.id;

    // Step 2: Add cohosts to public.cohosts
    const cohostEntries = cohosts.map((cohostId) => ({ event_id: eventId, cohost_id: cohostId }));
    const { error: cohostError } = await supabase
      .from('cohosts')
      .insert(cohostEntries);

    if (cohostError) throw cohostError;

    // Step 3: Retrieve all friends of the host or from selected groups
    let friends = [];

    if (groupIds) {
      // Retrieve friends from selected groups
      const { data: groupFriends, error: groupError } = await supabase
        .from('friends')
        .select('friend_id')
        .in('group_id', groupIds);

      if (groupError) throw groupError;

      friends = groupFriends.map((friend) => friend.friend_id);
    } else {
      // Retrieve all friends of the host
      const { data: hostFriends, error: hostError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('host_id', hostId);

      if (hostError) throw hostError;

      friends = hostFriends.map((friend) => friend.friend_id);
    }

    // Step 4: Add all friends to public.event_participants
    const participantEntries = friends.map((friendId) => ({ event_id: eventId, participant_id: friendId }));
    const { error: participantError } = await supabase
      .from('event_participants')
      .insert(participantEntries);

    if (participantError) throw participantError;

    return { success: true, eventId };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error };
  }
}
