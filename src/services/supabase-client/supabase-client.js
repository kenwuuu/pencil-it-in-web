import {createClient} from '@supabase/supabase-js';
import {SUPABASE_ANON_KEY, SUPABASE_URL} from "../../../constants.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseWithAuth = null;

function getAccessToken() {
    const accessToken = "todo";
    return accessToken;
}

export function getSupabaseClientWithAuth() {
    const accessToken = getAccessToken();

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
}