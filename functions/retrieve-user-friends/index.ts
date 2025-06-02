import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200
    });
  }
  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) {
      return new Response(JSON.stringify({
        error: 'User not found'
      }), {
        status: 404
      });
    }
    const { data: friends, error } = await supabaseClient.from('friends').select('friend_id, users(first_name, last_name)').eq('user_id', user.id).join('users', 'friend_id', 'id');
    if (error) throw error;
    const friendsList = friends.map((friend)=>({
        id: friend.friend_id,
        name: `${friend.users.first_name} ${friend.users.last_name}`
      }));
    return new Response(JSON.stringify(friendsList), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
