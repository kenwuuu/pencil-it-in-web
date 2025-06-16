-- Add cover_photo_url column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;

-- Update the get_upcoming_events function to include the cover_photo_url field in the result
CREATE OR REPLACE FUNCTION get_upcoming_events(querying_user_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    user_id UUID,
    created_at TIMESTAMPTZ,
    first_name TEXT,
    attendance_yes_count BIGINT,
    attendance_maybe_count BIGINT,
    attendance_no_count BIGINT,
    attendance_invited_count BIGINT,
    location TEXT,
    cover_photo_url TEXT, -- Added cover_photo_url to the return type
    participants JSON,
    host JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH event_participants AS (
        SELECT
            ep.event_id,
            json_agg(
                json_build_object(
                    'user_id', p.id,
                    'first_name', p.first_name,
                    'attendance_answer', ep.attendance_answer,
                    'profile_photo_url', p.profile_photo_url
                )
            ) AS participants
        FROM
            event_participants ep
            JOIN profiles p ON ep.user_id = p.id
        GROUP BY
            ep.event_id
    ),
    event_hosts AS (
        SELECT
            e.id AS event_id,
            json_agg(
                json_build_object(
                    'user_id', p.id,
                    'first_name', p.first_name,
                    'profile_photo_url', p.profile_photo_url
                )
            ) AS host
        FROM
            events e
            JOIN profiles p ON e.user_id = p.id
        GROUP BY
            e.id
    ),
    attendance_counts AS (
        SELECT
            event_id,
            COUNT(*) FILTER (WHERE attendance_answer = 'yes') AS yes_count,
            COUNT(*) FILTER (WHERE attendance_answer = 'maybe') AS maybe_count,
            COUNT(*) FILTER (WHERE attendance_answer = 'no') AS no_count,
            COUNT(*) FILTER (WHERE attendance_answer = 'invited' OR attendance_answer IS NULL) AS invited_count
        FROM
            event_participants
        GROUP BY
            event_id
    )
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.user_id,
        e.created_at,
        p.first_name,
        COALESCE(ac.yes_count, 0) AS attendance_yes_count,
        COALESCE(ac.maybe_count, 0) AS attendance_maybe_count,
        COALESCE(ac.no_count, 0) AS attendance_no_count,
        COALESCE(ac.invited_count, 0) AS attendance_invited_count,
        e.location,
        e.cover_photo_url, -- Include cover_photo_url in the SELECT
        COALESCE(ep.participants, '[]'::json) AS participants,
        COALESCE(eh.host, '[]'::json) AS host
    FROM
        events e
        LEFT JOIN event_participants ep_user ON e.id = ep_user.event_id AND ep_user.user_id = querying_user_id
        LEFT JOIN profiles p ON e.user_id = p.id
        LEFT JOIN event_participants AS ep_query ON ep_query.event_id = e.id AND ep_query.user_id = querying_user_id
        LEFT JOIN event_participants AS ep_all ON ep_all.event_id = e.id
        LEFT JOIN event_hosts AS eh ON e.id = eh.event_id
        LEFT JOIN event_participants AS ep ON e.id = ep.event_id
        LEFT JOIN attendance_counts ac ON e.id = ac.event_id
    WHERE
        e.start_time > NOW()
        AND (
            e.user_id = querying_user_id
            OR ep_query.user_id = querying_user_id
        )
    GROUP BY
        e.id, p.first_name, ep.participants, eh.host, ac.yes_count, ac.maybe_count, ac.no_count, ac.invited_count
    ORDER BY
        e.start_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_past_events function to include the cover_photo_url field in the result
CREATE OR REPLACE FUNCTION get_past_events(querying_user_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    user_id UUID,
    created_at TIMESTAMPTZ,
    first_name TEXT,
    attendance_yes_count BIGINT,
    attendance_maybe_count BIGINT,
    attendance_no_count BIGINT,
    attendance_invited_count BIGINT,
    location TEXT,
    cover_photo_url TEXT, -- Added cover_photo_url to the return type
    participants JSON,
    host JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH event_participants AS (
        SELECT
            ep.event_id,
            json_agg(
                json_build_object(
                    'user_id', p.id,
                    'first_name', p.first_name,
                    'attendance_answer', ep.attendance_answer,
                    'profile_photo_url', p.profile_photo_url
                )
            ) AS participants
        FROM
            event_participants ep
            JOIN profiles p ON ep.user_id = p.id
        GROUP BY
            ep.event_id
    ),
    event_hosts AS (
        SELECT
            e.id AS event_id,
            json_agg(
                json_build_object(
                    'user_id', p.id,
                    'first_name', p.first_name,
                    'profile_photo_url', p.profile_photo_url
                )
            ) AS host
        FROM
            events e
            JOIN profiles p ON e.user_id = p.id
        GROUP BY
            e.id
    ),
    attendance_counts AS (
        SELECT
            event_id,
            COUNT(*) FILTER (WHERE attendance_answer = 'yes') AS yes_count,
            COUNT(*) FILTER (WHERE attendance_answer = 'maybe') AS maybe_count,
            COUNT(*) FILTER (WHERE attendance_answer = 'no') AS no_count,
            COUNT(*) FILTER (WHERE attendance_answer = 'invited' OR attendance_answer IS NULL) AS invited_count
        FROM
            event_participants
        GROUP BY
            event_id
    )
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.user_id,
        e.created_at,
        p.first_name,
        COALESCE(ac.yes_count, 0) AS attendance_yes_count,
        COALESCE(ac.maybe_count, 0) AS attendance_maybe_count,
        COALESCE(ac.no_count, 0) AS attendance_no_count,
        COALESCE(ac.invited_count, 0) AS attendance_invited_count,
        e.location,
        e.cover_photo_url, -- Include cover_photo_url in the SELECT
        COALESCE(ep.participants, '[]'::json) AS participants,
        COALESCE(eh.host, '[]'::json) AS host
    FROM
        events e
        LEFT JOIN event_participants ep_user ON e.id = ep_user.event_id AND ep_user.user_id = querying_user_id
        LEFT JOIN profiles p ON e.user_id = p.id
        LEFT JOIN event_participants AS ep_query ON ep_query.event_id = e.id AND ep_query.user_id = querying_user_id
        LEFT JOIN event_participants AS ep_all ON ep_all.event_id = e.id
        LEFT JOIN event_hosts AS eh ON e.id = eh.event_id
        LEFT JOIN event_participants AS ep ON e.id = ep.event_id
        LEFT JOIN attendance_counts ac ON e.id = ac.event_id
    WHERE
        e.start_time <= NOW()
        AND (
            e.user_id = querying_user_id
            OR ep_query.user_id = querying_user_id
        )
    GROUP BY
        e.id, p.first_name, ep.participants, eh.host, ac.yes_count, ac.maybe_count, ac.no_count, ac.invited_count
    ORDER BY
        e.start_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a storage bucket for event photos if it doesn't exist
-- Note: This part would typically be done through the Supabase dashboard or API
-- but is included here for reference
-- 
-- Example:
-- SELECT create_bucket('event-photos', 'public');
