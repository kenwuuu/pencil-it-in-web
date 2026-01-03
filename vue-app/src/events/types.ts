export interface Participant {
  user_id: string
  profile_photo_url: string
  first_name: string
  last_name: string
  username: string
  attendance_answer: 'yes' | 'maybe' | 'no' | 'invited'
  is_host: boolean
  is_cohost: boolean
}

export interface Host {
  first_name: string
  user_id: string
}

export interface Event {
  id: string
  title: string
  description: string
  location: string
  start_time: string
  end_time: string
  host: Host
  participants: Participant[]
  attendance_yes_count: number
  attendance_maybe_count: number
  attendance_no_count: number
  attendance_invited_count: number
}

export interface CreateEventContext {
  formData: FormData
}

export interface FormData {
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
}
