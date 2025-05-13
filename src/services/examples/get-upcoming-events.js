import {supabase} from "../supabase-client/supabase-client.js";
import {email, password, queryingUserId} from "../../../constants.js";

const stored_procedure_name = 'get_upcoming_events';


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