import { supabase } from '@/supabase-client/supabase-client';

const edgeFunctionName = 'get-user';

// Function to call the edge function
export async function getUser(user_id: string) {
  const { data, error } = await supabase.auth.getSession();
  let token = data?.session?.access_token; // Get the user's access token
  if (error) {
    console.error('Error fetching session:', error);
  }

  const response = await fetch(
    `https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/${edgeFunctionName}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user_id }),
    },
  );

  const result = await response.json();

  if (response.ok) {
    return result;
  } else {
    console.error('Error:', result.error);
  }
}
