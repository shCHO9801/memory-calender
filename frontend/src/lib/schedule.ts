import { apiFetch } from "@/lib/api";
import type { ScheduleExtractionResponse } from "@/types/schedule";

export function extractSchedule(noteId: number) {
    return apiFetch<ScheduleExtractionResponse>(
        `/api/notes/${noteId}/schedule-extraction`,
        {
            method: "POST",
        },
    );
}