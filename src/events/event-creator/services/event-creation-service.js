import { supabase } from '@/supabase-client/supabase-client.ts';

export async function createEventApiCall() {
  if (this.isCreating) return;

  this.isCreating = true;

  try {
    // Convert local datetime strings to UTC ISO strings
    const startTimeUTC = new Date(this.formData.startTime).toISOString();
    const endTimeUTC = new Date(this.formData.endTime).toISOString();

    const session = await supabase.auth.getSession();
    const response = await fetch(
      'https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/create-event',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify({
          title: this.formData.title,
          description: this.formData.description,
          location: this.formData.location,
          start_time: startTimeUTC,
          end_time: endTimeUTC,
        }),
      },
    );

    const responseData = await response.json();

    if (responseData.message === 'Event created successfully') {
      console.log('Event created successfully:', responseData);

      // Show success toast
      this.showToastNotification(`Event created successfully!`, 'success');

      // Reset form
      this.resetForm();

      // Dispatch success event to parent EventsContainer after a short delay
      setTimeout(() => {
        this.$el.dispatchEvent(
          new CustomEvent('event-created-successfully', {
            bubbles: true,
            detail: { event: responseData },
          }),
        );
      }, 1500);
    } else {
      console.error('Error creating event:', responseData);

      // Show error toast with specific message or generic fallback
      const errorMessage =
        responseData.error ||
        responseData.message ||
        'Failed to create event. Please try again.';
      this.showToastNotification(errorMessage, 'error');
    }
  } catch (error) {
    console.error('There was an error sending the request:', error);

    // Show error toast for network/request errors
    this.showToastNotification(
      'Network error occurred. Please check your connection and try again.',
      'error',
    );
  } finally {
    this.isCreating = false;
  }
}
