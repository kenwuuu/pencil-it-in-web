# Event Cover Photo Feature Implementation

This document outlines the implementation of the event cover photo feature (GitHub Issue #70).

## Frontend Implementation Status

The frontend implementation is complete and includes:

1. Updated `EventModel` class with `coverPhotoUrl` property
2. New utility module `src/utils/file-upload.js` for handling file uploads to Supabase Storage
3. Enhanced event creation component with cover photo upload UI and functionality
4. Updated events feed to display cover photos when available

## Required Backend Changes

The following backend changes are required to complete the implementation:

### 1. Create Storage Bucket for Event Photos

A Supabase administrator needs to:

1. Log in to the Supabase dashboard
2. Navigate to "Storage" in the left sidebar
3. Click "New Bucket"
4. Enter bucket name: `event-photos`
5. Configure bucket permissions:
   - Set "Public bucket" to ON (if event photos should be publicly viewable)
   - Or keep it OFF and configure Row Level Security (RLS) policies if more granular access control is needed

### 2. Configure Storage Bucket Policies

Create appropriate RLS policies for the bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-photos' AND auth.uid() = owner);

-- Allow public read access to event photos
CREATE POLICY "Allow public to view event photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-photos');
```

### 3. Update Database Schema

Execute the SQL migration in `migrations/add_cover_photo_url_to_events.sql` to:
- Add the `cover_photo_url` column to the events table
- Update the RPC functions to include this field in their results

### 4. Update the Create Event Edge Function

The Edge Function that handles event creation needs to be updated to accept and store the `cover_photo_url` field. The specific changes depend on the current implementation of the function, but generally:

1. Update the function to accept `cover_photo_url` in the request payload
2. Include `cover_photo_url` when inserting a new event into the database

## Testing the Feature

After implementing the backend changes:

1. Create a new event and upload a cover photo
2. Verify that the cover photo is stored in the `event-photos` bucket
3. Verify that the event is created with the correct cover photo URL
4. View the events feed to confirm that the cover photo is displayed correctly

## Troubleshooting

If you encounter issues:

- Check browser console for errors related to file uploads or bucket access
- Verify that the storage bucket exists and has the correct permissions
- Ensure the database schema has been updated with the `cover_photo_url` column
- Confirm that the RPC functions return the `cover_photo_url` field
