import type { CreateEventContext } from '@/events/types.ts'
import { supabase } from '../../../../src/supabase-client/supabase-client.ts'

export async function getUpcomingEvents() {
  return getEvents(true)
}

export async function getPastEvents() {
  return getEvents(false)
}

async function getEvents(upcomingEvents: boolean) {
  const dbFunctionName = upcomingEvents ? 'get_upcoming_events' : 'get_past_events'

  const session = await supabase.auth.getSession()
  if (!session.data.session) return null

  const { data: rpcData, error: rpcError } = await supabase.rpc(dbFunctionName, {
    querying_user_id: session.data.session.user.id,
  })

  if (rpcError) {
    console.error('RPC error:', rpcError)
  } else if (rpcData[0]) {
    console.log('RPC result:', rpcData)
    return rpcData
  } else {
    console.log('no results')
  }

  return null
}

export async function deleteEvent(eventId: string) {
  const { data, error } = await supabase.from('events').delete().eq('id', eventId)

  if (error) {
    console.error('Error while deleting event: ', error)
    throw error
  }

  console.log('Successfully deleted event: ', eventId)
  return data
}

export async function updateEvent(eventId: string) {}

export async function createEventApiCall(context: CreateEventContext): Promise<any> {
  // Convert local datetime strings to UTC ISO strings
  const startTimeUTC = new Date(context.formData.startTime).toISOString()
  const endTimeUTC = new Date(context.formData.endTime).toISOString()

  const session = await supabase.auth.getSession()
  const response = await fetch(
    'https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/create-event',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: JSON.stringify({
        title: context.formData.title,
        description: context.formData.description,
        location: context.formData.location,
        start_time: startTimeUTC,
        end_time: endTimeUTC,
      }),
    },
  )

  const responseData = await response.json()

  return responseData
}
