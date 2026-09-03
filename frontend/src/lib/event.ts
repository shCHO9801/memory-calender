import { apiFetch } from "@/lib/api";
import type {
    CreateEventRequest,
    CreateEventResponse,
    EventListResponse,
    EventResponse,
    UpdateEventRequest,
} from "@/types/event";

export function createEvent(request: CreateEventRequest) {
    return apiFetch<CreateEventResponse>("/api/events", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function getEvents(
    startAt: string,
    endAt: string,
    page = 0,
    size = 20,
) {
    return apiFetch<EventListResponse>(
        `/api/events?startAt=${encodeURIComponent(startAt)}&endAt=${encodeURIComponent(endAt)}&page=${page}&size=${size}`,
    );
}

export function updateEvent(
    eventId: number,
    request: UpdateEventRequest,
) {
    return apiFetch<EventResponse>(`/api/events/${eventId}`, {
        method: "PATCH",
        body: JSON.stringify(request),
    });
}

export function deleteEvent(eventId: number) {
    return apiFetch<void>(`/api/events/${eventId}`, {
        method: "DELETE",
    });
}
