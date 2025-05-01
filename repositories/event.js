export class Event {
    constructor(apiEvent) {
        this.id = apiEvent.id;
        this.title = apiEvent.title;
        this.description = apiEvent.description;
        this.startTime = new Date(apiEvent.start_time);
        this.endTime = new Date(apiEvent.end_time);
        this.userId = apiEvent.user_id;
        this.createdAt = new Date(apiEvent.created_at);
        this.cohosts = apiEvent.cohosts;  // you can map these if needed
        this.participants = (apiEvent.participants || []).map(p => ({
            userId: p.user_id,
            firstName: p.first_name,
            attendanceAnswer: p.attendance_answer
        }));
        this.firstName = apiEvent.first_name;
        this.attendanceYesCount = apiEvent.attendance_yes_count;
        this.attendanceMaybeCount = apiEvent.attendance_maybe_count;
        this.attendanceNoCount = apiEvent.attendance_no_count;
    }

    getParticipantCount() {
        return this.participants.length;
    }
}
