import {supabase} from "./supabase-client/supabase-client.js";


const queryingUserId = 'f18d6f00-b861-45bd-bad9-2d3c1b772323';

export async function createEvent(eventData) {

}

export async function getUpcomingEvents() {
    const {data: rpcData, error: rpcError} = await supabase.rpc('get_upcoming_events', {
        querying_user_id: queryingUserId
    });

    if (rpcError) {
        console.error('RPC error:', rpcError);
    } else if (rpcData[0]) {
        console.log('RPC result:', rpcData);
        return rpcData;
    } else {
        console.log('no results');
    }

    return null;
}

export async function getPastEvents() {
    const {data: rpcData, error: rpcError} = await supabase.rpc('get_past_events', {
        querying_user_id: queryingUserId
    });

    if (rpcError) {
        console.error('RPC error:', rpcError);
    } else if (rpcData[0]) {
        console.log('RPC result:', rpcData);
        return rpcData;
    } else {
        console.log('no results');
    }

    return null;
}

export async function deleteEvent(id) {

}

export async function updateEvent(id) {

}
