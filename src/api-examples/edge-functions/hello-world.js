/**
 * @file hello-world.js
 * @description Script to call the `hello-world` stored procedure
 *              in Supabase. Just a test procedure.
 */

import 'dotenv/config';
import {supabase} from "../../supabase-client/supabase-client.js";

const edge_function_name = 'hello-world';

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