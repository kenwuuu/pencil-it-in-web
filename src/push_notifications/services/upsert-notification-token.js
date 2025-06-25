import { supabase } from '@/supabase-client/supabase-client.js';

const edgeFunctionName = 'upsert-notification-token';

// currently only used by mobile devices
export async function upsertNotificationToken(deviceTokenId, enable) {
  const {
    data: {},
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.error('Error fetching user:', userError);
    return;
  }

  // @ts-ignore
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
      body: JSON.stringify({
        deviceTokenId: deviceTokenId,
        lastActiveAt: new Date().toISOString(),
        enable: enable,
      }),
    },
  );

  const result = await response.json();
  if (response.ok) {
    console.log('Success:', result.messsage);
  } else {
    console.error('Error:', result.error);
  }

  return null;
}
