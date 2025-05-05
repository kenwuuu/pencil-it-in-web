import {supabase} from "../../supabase-client/supabase-client.js";
import {email, password} from "../../../constants.js";

const edge_function_name = 'hello-world';


const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
});

if (signInError) {
    console.error('Sign-in error:', signInError);
}

const {data: rpcData, error: rpcError} = await supabase.functions.invoke(edge_function_name, {
    body: {name: "ken"}
});

if (rpcError) {
    console.error('RPC error:', rpcError);
} else if (rpcData) {
    console.log('RPC result:', JSON.stringify(rpcData, null, 2));
} else {
    console.log('no results');
}