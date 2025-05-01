import {createClient} from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://mpounklnfrcfpkefidfn.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3Vua2xuZnJjZnBrZWZpZGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODE0OTcsImV4cCI6MjA1Nzc1NzQ5N30.wZlH6_dd0WtEVC-BtMXEzcTUgSAIlegqSPnr3dyvjyA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getSupabaseClientWithAuth(accessToken) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
}