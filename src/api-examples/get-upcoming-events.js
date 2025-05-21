/**
 * @file get-upcoming-events.js
 * @description Script to call the `get_upcoming_events` stored procedure
 *              in Supabase using the given email and password. Should list
 *              out that user's upcoming events, with related info.
 */

import 'dotenv/config';
import {supabase} from "../supabase-client/supabase-client.js";
import {email, password} from "./credentials.js";

const stored_procedure_name = 'get_upcoming_events';

const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
});

if (signInError) {
    console.error('Sign-in error:', signInError);
}

const session = await supabase.auth.getSession()

const {data: rpcData, error: rpcError} = await supabase.rpc(stored_procedure_name, {
    querying_user_id: session.data.session.user.id
});

if (rpcError) {
    console.error('RPC error:', rpcError);
} else if (rpcData[0]) {
    console.log('RPC result:', JSON.stringify(rpcData, null, 2));
} else {
    console.log('no results');
}