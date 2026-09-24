export type ScheduleCandidate = {
    title: string;
    startAt: string;
    endAt: string | null;
    description: string | null;
    location: string | null;
    allDay: boolean;
    needsConfirmation: boolean;
};

export type ScheduleExtractionResponse = {
    noteId: number;
    candidates: ScheduleCandidate[];
};