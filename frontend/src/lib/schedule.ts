import {apiFetch} from "@/lib/api";

import type {
    ClassificationResponse,
    ConfirmClassificationRequest,
} from "@/types/schedule";

export function extractSchedule(noteId: number) {
    return apiFetch<ClassificationResponse>(
        `/api/notes/${noteId}/classification`,
        {
            method: "POST",
        },
    );
}

export function confirmClassification(
    noteId: number,
    request: ConfirmClassificationRequest,
) {
    return apiFetch<void>(
        `/api/notes/${noteId}/classification/confirm`,
        {
            method: "POST",
            body: JSON.stringify(request),
        },
    );
}