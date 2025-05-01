import {getSupabaseClientWithAuth, supabase} from "../supabase-client/supabase-client.js";

const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
    email: 'kenqiwu@gmail.com',
    password: 'adsihn9',
});

if (signInError) {
    console.error('Sign-in error:', signInError);
}

const supabaseClientWithAuth = getSupabaseClientWithAuth(signInData.session.access_token);

const {data: rpcData, error: rpcError} = await supabaseClientWithAuth.rpc('get_upcoming_events', {
    querying_user_id: 'f18d6f00-b861-45bd-bad9-2d3c1b772323'
});

if (rpcError) {
    console.error('RPC error:', rpcError);
} else if (rpcData[0]) {
    console.log('RPC result:', rpcData);
} else {
    console.log('no results');
}