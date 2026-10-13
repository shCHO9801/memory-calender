import {apiFetch} from "@/lib/api";

export type EventSummary = {
    eventId: number;
    title: string;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
};

export type EventDetail = {
    eventId: number;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    location: string | null;
};

export type CreateEventRequest = {
    noteId: number | null;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    location: string | null;
};

export type UpdateEventRequest = {
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    location: string | null;
};

export async function getEvents(
    startAt: string,
    endAt: string
): Promise<EventSummary[]> {
    const params = new URLSearchParams({
        startAt,
        endAt,
    });

    return apiFetch<EventSummary[]>(
        `/api/events/calendar?${params}`
    );
}

export async function getEvent(
    eventId: number
): Promise<EventDetail> {
    return apiFetch<EventDetail>(
        `/api/events/${eventId}`
    );
}

export async function createEvent(
    request: CreateEventRequest
): Promise<void> {
    await apiFetch<void>(
        "/api/events",
        {
            method: "POST",
            body: JSON.stringify(request),
        }
    );
}

export async function updateEvent(
    eventId: number,
    request: UpdateEventRequest
): Promise<void> {
    await apiFetch<void>(
        `/api/events/${eventId}`,
        {
            method: "PATCH",
            body: JSON.stringify(request),
        }
    );
}

export async function deleteEvent(
    eventId: number
): Promise<void> {
    await apiFetch<void>(
        `/api/events/${eventId}`,
        {
            method: "DELETE",
        }
    );
}