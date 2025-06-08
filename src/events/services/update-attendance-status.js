import { supabase } from '@/supabase-client/supabase-client';

const edgeFunctionName = 'update-attendance-status';

export async function updateAttendanceStatus(eventId, attendanceStatus) {
  const { data: functionData, error: functionError } =
    await supabase.functions.invoke(edgeFunctionName, {
      body: {
        eventId: eventId,
        newAttendanceStatus: attendanceStatus,
      },
    });

  if (functionError) {
    console.error('Edge Function error:', functionError);
  } else if (functionData) {
    console.log('update-attendance-status Edge Function result:', functionData);
    return functionData;
  } else {
    console.log('no results');
  }

  return null;
}
