import { supabase } from '@/supabase-client/supabase-client';

// Function to call the edge function
export async function getProfilePhotoUrl() {
  const user = await supabase.auth.getUser();

  const userId = user.data.user.id;

  const { data } = await supabase
    .from('users')
    .select('profile_photo_url')
    .eq('id', userId);

  if (data) {
    return data[0]['profile_photo_url'];
  }

  // return response.url.href;
}
