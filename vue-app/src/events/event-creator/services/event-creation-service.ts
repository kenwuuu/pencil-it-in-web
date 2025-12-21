import { supabase } from '../../../../../src/supabase-client/supabase-client.ts'
import type { Ref } from 'vue'

interface FormData {
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
}

interface CreateEventContext {
  formData: FormData
  isCreating: Ref<boolean>
  showToastNotification: (message: string, type: 'success' | 'error') => void
  resetForm: () => void
  onSuccess?: () => void
}

export async function createEventApiCall(context: CreateEventContext): Promise<void> {
  if (context.isCreating.value) return

  context.isCreating.value = true

  try {
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

    if (responseData.message === 'Event created successfully') {
      console.log('Event created successfully:', responseData)

      // Show success toast
      context.showToastNotification('Event created successfully!', 'success')

      // Reset form
      context.resetForm()

      // Call success callback after a short delay
      setTimeout(() => {
        context.onSuccess?.()
      }, 1500)
    } else {
      console.error('Error creating event:', responseData)

      // Show error toast with specific message or generic fallback
      const errorMessage =
        responseData.error || responseData.message || 'Failed to create event. Please try again.'
      context.showToastNotification(errorMessage, 'error')
    }
  } catch (error) {
    console.error('There was an error sending the request:', error)

    // Show error toast for network/request errors
    context.showToastNotification(
      'Network error occurred. Please check your connection and try again.',
      'error',
    )
  } finally {
    context.isCreating.value = false
  }
}
