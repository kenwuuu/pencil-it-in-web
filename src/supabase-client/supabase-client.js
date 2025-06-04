/**
 * @file supabase-client.js
 * @description Initialize a global Supabase client for our project to use.
 */

import {createClient} from '@supabase/supabase-js';
import {SUPABASE_ANON_KEY, SUPABASE_URL} from '../../constants.js';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
