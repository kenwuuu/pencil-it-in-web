import {supabase} from '@/supabase-client/supabase-client';

const edgeFunctionName = 'retrieve-user-friends';

// Function to call the edge function
export async function getUserFriends() {
  const {data, error} = await supabase.auth.getSession();
  let token = data?.session?.access_token; // Get the user's access token
  if (error) {
    console.error('Error fetching session:', error);
  }

  console.log('before response')
  const response = await fetch(`https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/${edgeFunctionName}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  const result = await response.json();

  if (response.ok) {
    return result;
  } else {
    console.error('Error:', result.error);
  }
}
