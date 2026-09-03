import { apiFetch } from "@/lib/api";
import type {
    CreateEventRequest,
    CreateEventResponse,
} from "@/types/event";

export function createEvent(request: CreateEventRequest) {
    return apiFetch<CreateEventResponse>("/api/events", {
        method: "POST",
        body: JSON.stringify(request),
    });
}