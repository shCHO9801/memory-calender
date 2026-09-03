export type CreateEventRequest = {
    noteId: number | null;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
};

export type CreateEventResponse = {
    eventId: number;
    noteId: number | null;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    createdAt: string;
};