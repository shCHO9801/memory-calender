import { apiFetch } from "@/lib/api";
import type {
    CreateNoteRequest,
    NoteListResponse,
    NoteResponse,
} from "@/types/note";

export function createNote(request: CreateNoteRequest) {
    return apiFetch<NoteResponse>("/api/notes", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function getNotes(page = 0, size = 20) {
    return apiFetch<NoteListResponse>(
        `/api/notes?page=${page}&size=${size}`,
    );
}

export function updateNote(noteId: number, request: CreateNoteRequest) {
    return apiFetch<NoteResponse>(`/api/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify(request),
    });
}

export function deleteNote(noteId: number) {
    return apiFetch<void>(`/api/notes/${noteId}`, {
        method: "DELETE",
    });
}