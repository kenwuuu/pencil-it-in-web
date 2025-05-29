/**
 * @file get-upcoming-events.js
 * @description Initialize the Supabase client.
 */

import { createClient } from '@supabase/supabase-js';

// Annoying code to make sure that we get the right variable whether we run this file through
// Node or Vite. They don't play nice with each other.
const isNode = typeof process !== 'undefined' && typeof process.env !== 'undefined';

const supabaseUrl = 'https://mpounklnfrcfpkefidfn.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3Vua2xuZnJjZnBrZWZpZGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODE0OTcsImV4cCI6MjA1Nzc1NzQ5N30.wZlH6_dd0WtEVC-BtMXEzcTUgSAIlegqSPnr3dyvjyA';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey);
export const supabaseWithAuth = null;

function getAccessToken() {
  const accessToken = 'todo';
  return accessToken;
}

export function getSupabaseClientWithAuth() {
  const accessToken = getAccessToken();

  return createClient(
    supabaseUrl,
    supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });
}