/**
 * @file get-upcoming-events.js
 * @description Initialize the Supabase client.
 */

import {createClient} from '@supabase/supabase-js';

// Annoying code to make sure that we get the right variable whether we run this file through
// Node or Vite. They don't play nice with each other.
const isNode = typeof process !== 'undefined' && typeof process.env !== 'undefined';

const supabaseUrl = isNode
  ? process.env.VITE_SUPABASE_URL
  : import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = isNode
  ? process.env.VITE_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey);
export const supabaseWithAuth = null;

function getAccessToken() {
    const accessToken = "todo";
    return accessToken;
}

export function getSupabaseClientWithAuth() {
    const accessToken = getAccessToken();

    return createClient(
        supabaseUrl,
        supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
}