import { supabase } from '../../../../../src/supabase-client/supabase-client.ts'
import type { CreateEventContext } from '@/events/types.ts'

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
