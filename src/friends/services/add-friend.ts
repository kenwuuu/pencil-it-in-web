import {supabase} from '@/supabase-client/supabase-client';

const edgeFunctionName = 'insert-friendship';

// Function to call the edge function
export async function insertFriendship(friendUsername: string) {

  const {data: {}, error: userError} = await supabase.auth.getUser();
  if (userError) {
    console.error('Error fetching user:', userError);
    return;
  }

  // @ts-ignore
  const {data, error} = await supabase.auth.getSession();
  let token = data?.session?.access_token; // Get the user's access token
  if (error) {
    console.error('Error fetching session:', error);
  }

  const response = await fetch(`https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/${edgeFunctionName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: friendUsername})
  });

  const result = await response.json();
  if (response.ok) {
    console.log('Success:', result.messsage);
  } else {
    console.error('Error:', result.error);
  }
}
