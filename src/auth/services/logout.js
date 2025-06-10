// Handles logout logic for the profile page
import { supabase } from '@/supabase-client/supabase-client.js';

export async function logoutAndRedirect() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Error logging out: ' + error.message);
    return;
  }
  window.location.href = '/src/auth/login.html';
}
