

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."attendance_status" AS ENUM (
    'yes',
    'no',
    'maybe',
    'invited'
);


ALTER TYPE "public"."attendance_status" OWNER TO "postgres";


COMMENT ON TYPE "public"."attendance_status" IS 'yes, no, maybe are obvious. invited means invited and haven''t clicked a response yet';



CREATE OR REPLACE FUNCTION "public"."get_event"("queryeventid" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "host" "json", "cohosts" "uuid"[], "participants" "json"[], "attendance_yes_count" bigint, "attendance_maybe_count" bigint, "attendance_no_count" bigint, "attendance_invited_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        json_build_object('user_id', e.user_id, 'first_name', u_host.first_name) AS host,
        array_agg(DISTINCT c.user_id) AS cohosts,
        array_agg(json_build_object('user_id', p.user_id, 'first_name', u_participant.first_name, 'attendance_answer', p.attendance_status)) AS participants,
        SUM(CASE WHEN p.attendance_status = 'yes' THEN 1 ELSE 0 END) AS attendance_yes_count,
        SUM(CASE WHEN p.attendance_status = 'maybe' THEN 1 ELSE 0 END) AS attendance_maybe_count,
        SUM(CASE WHEN p.attendance_status = 'no' THEN 1 ELSE 0 END) AS attendance_no_count,
        SUM(CASE WHEN p.attendance_status = 'invited' THEN 1 ELSE 0 END) AS attendance_invited_count
    FROM
        public.events e
    LEFT JOIN
        public.cohosts c ON c.event_id = e.id
    LEFT JOIN
        public.event_participants p ON p.event_id = e.id
    LEFT JOIN
        public.users u_participant ON u_participant.id = p.user_id
    LEFT JOIN
        public.users u_host ON u_host.id = e.user_id
    WHERE
        e.id = queryEventId
    GROUP BY
        e.id, u_host.first_name
    ORDER BY
        e.start_time ASC;
END;
$$;


ALTER FUNCTION "public"."get_event"("queryeventid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_past_events"("querying_user_id" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "host" "json", "cohosts" "uuid"[], "participants" "json"[], "attendance_yes_count" bigint, "attendance_maybe_count" bigint, "attendance_no_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        json_build_object('user_id', e.user_id, 'first_name', u_host.first_name) AS host,
        array_agg(DISTINCT c.user_id) AS cohosts,
        array_agg(json_build_object('user_id', p.user_id, 'first_name', u_participant.first_name, 'attendance_answer', p.attendance_status)) AS participants,
        SUM(CASE WHEN p.attendance_status = 'yes' THEN 1 ELSE 0 END) AS attendance_yes_count,
        SUM(CASE WHEN p.attendance_status = 'maybe' THEN 1 ELSE 0 END) AS attendance_maybe_count,
        SUM(CASE WHEN p.attendance_status = 'no' THEN 1 ELSE 0 END) AS attendance_no_count
    FROM
        public.events e
    LEFT JOIN
        public.cohosts c ON c.event_id = e.id
    LEFT JOIN
        public.event_participants p ON p.event_id = e.id
    LEFT JOIN
        public.users u_participant ON u_participant.id = p.user_id
    LEFT JOIN
        public.users u_host ON u_host.id = e.user_id
    WHERE
        e.end_time < now()
        AND EXISTS (
            SELECT 1 FROM event_participants ep 
            WHERE ep.event_id = e.id AND ep.user_id = querying_user_id
        )
    GROUP BY
        e.id, u_host.first_name
    ORDER BY
        e.start_time DESC;
END;
$$;


ALTER FUNCTION "public"."get_past_events"("querying_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_past_events0"("querying_user_id" bigint) RETURNS TABLE("id" bigint, "title" "text", "description" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "host" bigint, "created_at" timestamp with time zone, "cohosts" bigint[])
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.host,
        e.created_at,
        array_agg(c.user_id) AS cohosts
    FROM
        public.events e
    LEFT JOIN
        public.cohosts c ON c.event_id = e.id
    WHERE
        DATE(e.end_time) < DATE(now())
        AND (e.host = querying_user_id OR c.user_id = querying_user_id)
    GROUP BY
        e.id
    ORDER BY
        e.start_time ASC;
END;$$;


ALTER FUNCTION "public"."get_past_events0"("querying_user_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_upcoming_events"("querying_user_id" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "host" "json", "cohosts" "uuid"[], "participants" "json"[], "attendance_yes_count" bigint, "attendance_maybe_count" bigint, "attendance_no_count" bigint)
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        json_build_object('user_id', e.user_id, 'first_name', u_host.first_name) AS host,
        array_agg(DISTINCT c.user_id) AS cohosts,
        array_agg(json_build_object('user_id', p.user_id, 'username', u_participant.username, 'first_name', u_participant.first_name, 'last_name', u_participant.last_name, 'profile_photo_url', u_participant.profile_photo_url, 'attendance_answer', p.attendance_status)) AS participants,
        SUM(CASE WHEN p.attendance_status = 'yes' THEN 1 ELSE 0 END) AS attendance_yes_count,
        SUM(CASE WHEN p.attendance_status = 'maybe' THEN 1 ELSE 0 END) AS attendance_maybe_count,
        SUM(CASE WHEN p.attendance_status = 'no' THEN 1 ELSE 0 END) AS attendance_no_count
    FROM
        public.events e
    LEFT JOIN
        public.cohosts c ON c.event_id = e.id
    LEFT JOIN
        public.event_participants p ON p.event_id = e.id
    LEFT JOIN
        public.users u_participant ON u_participant.id = p.user_id
    LEFT JOIN
        public.users u_host ON u_host.id = e.user_id
    WHERE
        e.end_time >= NOW()
        AND EXISTS (
            SELECT 1 FROM event_participants ep 
             WHERE ep.event_id = e.id AND ep.user_id = querying_user_id
        )
    GROUP BY
        e.id, u_host.first_name
    ORDER BY
        e.start_time ASC;
END;$$;


ALTER FUNCTION "public"."get_upcoming_events"("querying_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_upcoming_events2"("querying_user_id" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "user_id" "uuid", "created_at" timestamp with time zone, "cohosts" "uuid"[], "participants" "uuid"[])
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.user_id,
        e.created_at,
        array_agg(c.user_id) AS cohosts,
        array_agg(p.user_id) AS participants
    FROM
        public.events e
    LEFT JOIN
        public.cohosts c ON c.event_id = e.id
    LEFT JOIN
        public.event_participants p ON p.event_id = e.id
    WHERE
        DATE(e.end_time) >= DATE(now())
        AND (e.user_id = querying_user_id 
        OR c.user_id = querying_user_id 
        OR p.user_id = querying_user_id)
    GROUP BY
        e.id
    ORDER BY
        e.start_time ASC;
END;$$;


ALTER FUNCTION "public"."get_upcoming_events2"("querying_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$begin
  insert into public.users (id, first_name)
  values (new.id, new.raw_user_meta_data ->> 'first_name');
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cohosts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "event_id" "uuid",
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."cohosts" OWNER TO "postgres";


ALTER TABLE "public"."cohosts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cohosts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."event_participants" (
    "id" bigint NOT NULL,
    "group_id" bigint,
    "added_at" timestamp with time zone DEFAULT "now"(),
    "attendance_status" "public"."attendance_status" DEFAULT 'invited'::"public"."attendance_status",
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "derp" boolean
);


ALTER TABLE "public"."event_participants" OWNER TO "postgres";


ALTER TABLE "public"."event_participants" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."event_participants_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."events" (
    "title" "text" NOT NULL,
    "description" "text",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "location" "text" NOT NULL
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON COLUMN "public"."events"."location" IS 'Either an address (508 Main St) or just a location name (Union Square)';



CREATE TABLE IF NOT EXISTS "public"."friends" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL,
    "friend_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "accepted" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."friends" OWNER TO "postgres";


COMMENT ON COLUMN "public"."friends"."accepted" IS 'If false: row is a new friend request, users are not friends yet. If true: they are friends. Upon removing a friend, row should be deleted, this column should not be used to indicate removal of friend';



CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" bigint NOT NULL,
    "group_id" bigint NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


ALTER TABLE "public"."group_members" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."group_members_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


ALTER TABLE "public"."groups" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "wants_to_hang_start_time" timestamp with time zone,
    "wants_to_hang_end_time" timestamp with time zone,
    "username" "text",
    "profile_photo_url" "text",
    "city_and_state" "text" DEFAULT 'City, State'::"text",
    "birthday" "date"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."city_and_state" IS 'User''s current location, updated every 6 hours they open the app';



ALTER TABLE ONLY "public"."cohosts"
    ADD CONSTRAINT "cohosts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_user_id_event_id_key" UNIQUE ("user_id", "event_id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "unique_user_id_to_friend_id" UNIQUE ("user_id", "friend_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE INDEX "cohosts_user_id_idx" ON "public"."cohosts" USING "btree" ("user_id");



CREATE INDEX "event_participants_user_id_idx" ON "public"."event_participants" USING "btree" ("user_id");



CREATE INDEX "events_user_id_idx" ON "public"."events" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."cohosts"
    ADD CONSTRAINT "cohosts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cohosts"
    ADD CONSTRAINT "cohosts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Allow event owners to delete participants" ON "public"."event_participants" FOR DELETE TO "authenticated" USING (("event_id" IN ( SELECT "events"."id"
   FROM "public"."events"
  WHERE ("events"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow users to delete their friendships" ON "public"."friends" FOR DELETE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR (( SELECT "auth"."uid"() AS "uid") = "friend_id")));



CREATE POLICY "Allow users to insert event participants for their own events" ON "public"."event_participants" FOR INSERT TO "authenticated" WITH CHECK (("event_id" IN ( SELECT "events"."id"
   FROM "public"."events"
  WHERE ("events"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow users to insert friendships" ON "public"."friends" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR (( SELECT "auth"."uid"() AS "uid") = "friend_id")));



CREATE POLICY "Allow users to select their friendships" ON "public"."friends" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR (( SELECT "auth"."uid"() AS "uid") = "friend_id")));



CREATE POLICY "Allow users to update their friendships" ON "public"."friends" FOR UPDATE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR (( SELECT "auth"."uid"() AS "uid") = "friend_id"))) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR (( SELECT "auth"."uid"() AS "uid") = "friend_id")));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."event_participants" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."friends" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable participants to view events they were invited to" ON "public"."events" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."event_participants"
  WHERE (("event_participants"."event_id" = "events"."id") AND ("event_participants"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Enable read access for all users" ON "public"."event_participants" FOR SELECT USING (true);



CREATE POLICY "Enable read for authenticated users" ON "public"."users" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."friends" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."cohosts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."get_event"("queryeventid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_event"("queryeventid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_event"("queryeventid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_past_events"("querying_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_events"("querying_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_events"("querying_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_past_events0"("querying_user_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_events0"("querying_user_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_events0"("querying_user_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_upcoming_events"("querying_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_upcoming_events"("querying_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_upcoming_events"("querying_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_upcoming_events2"("querying_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_upcoming_events2"("querying_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_upcoming_events2"("querying_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



























GRANT ALL ON TABLE "public"."cohosts" TO "anon";
GRANT ALL ON TABLE "public"."cohosts" TO "authenticated";
GRANT ALL ON TABLE "public"."cohosts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cohosts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cohosts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cohosts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."event_participants" TO "anon";
GRANT ALL ON TABLE "public"."event_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."event_participants" TO "service_role";



GRANT ALL ON SEQUENCE "public"."event_participants_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."event_participants_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."event_participants_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON SEQUENCE "public"."group_members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."group_members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."group_members_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
