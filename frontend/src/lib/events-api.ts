import {getAccessToken} from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

function getAuthHeaders() {
    const token = getAccessToken();

    if (!token) {
        throw new Error("로그인이 필요합니다.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function getEvents(
    startAt: string,
    endAt: string
): Promise<EventSummary[]> {
    const params = new URLSearchParams({
        startAt,
        endAt,
    });

    const response = await fetch(
        `${API_BASE_URL}/api/events/calendar?${params}`,
        {
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("일정을 불러오지 못했습니다.");
    }

    return response.json();
}

export async function getEvent(
    eventId: number
): Promise<EventDetail> {
    const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("일정 상세 정보를 불러오지 못했습니다.");
    }

    return response.json();
}

export async function createEvent(
    request: CreateEventRequest
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/events`,
        {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("일정을 추가하지 못했습니다.");
    }
}

export async function updateEvent(
    eventId: number,
    request: UpdateEventRequest
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}`,
        {
            method: "PATCH",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("일정을 수정하지 못했습니다.");
    }
}

export async function deleteEvent(
    eventId: number
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("일정을 삭제하지 못했습니다.");
    }
}