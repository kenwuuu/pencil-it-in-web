This is where we keep all code that make outgoing API calls so we
don't have any logic cluttering our Views and View Models.

Create Event:

1. Create a new event in public.events table.
2. Add cohosts to public.cohosts table.
3. Add participants to public.event_participants table.

Update Event:

1. Update event in public.events table.

Delete Event:

1. Create a new event in public.events table.
2. Add cohosts to public.cohosts table.
3. Add participants to public.event_participants table.

Add Friend Request:

1. Create row in public.friend_requests table.

Delete Friend Request:

1. Delete row in public.friend_requests table.

Accept Friend:

1. Remove row in public.friend_requests table.
2. Create two rows for bidirectional relationship in public.friends.

Remove Friend:

1. Remove both rows in public.friends.

