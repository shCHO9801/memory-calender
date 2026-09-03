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

export type EventResponse = {
    eventId: number;
    noteId: number | null;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    createdAt: string;
    updatedAt?: string;
};

export type EventListResponse = {
    content: EventResponse[];
    page: number;
    size: number;
    hasNext: boolean;
};

export type UpdateEventRequest = {
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
};
