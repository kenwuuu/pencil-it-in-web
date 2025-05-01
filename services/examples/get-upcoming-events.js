import {supabase} from "../supabase-client/supabase-client.js";

const email = 'kenqiwu@gmail.com';
const password = 'adsihn9';
const stored_procedure_name = 'get_upcoming_events';
const queryingUserId = 'f18d6f00-b861-45bd-bad9-2d3c1b772323';


const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
});

if (signInError) {
    console.error('Sign-in error:', signInError);
}

const {data: rpcData, error: rpcError} = await supabase.rpc(stored_procedure_name, {
    querying_user_id: queryingUserId
});

if (rpcError) {
    console.error('RPC error:', rpcError);
} else if (rpcData[0]) {
    console.log('RPC result:', JSON.stringify(rpcData, null, 2));
} else {
    console.log('no results');
}