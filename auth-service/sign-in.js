import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://<your-project-ref>.supabase.co';
const supabaseAnonKey = '<your-anon-key>';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Call this from your signup form handler:
const { user, session, error } = await supabase.auth.signUp({
  email: 'email@example.com',
  password: 'super-secret-password',
});
