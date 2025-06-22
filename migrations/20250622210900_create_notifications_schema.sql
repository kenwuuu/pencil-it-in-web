CREATE TABLE public.fcm_tokens (
    "id" "text" PRIMARY KEY ,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "enable" boolean DEFAULT true NOT NULL
);

ALTER TABLE ONLY public.fcm_tokens
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

COMMENT ON TABLE public.fcm_tokens IS 'FCM stands for Firebase Cloud Messaging. It''s how we send notifications';
COMMENT ON COLUMN public.fcm_tokens.id IS 'This is an FCM Device Token ID';
COMMENT ON COLUMN public.fcm_tokens.enable IS 'Whether user has notifications turned on or off for this device';
