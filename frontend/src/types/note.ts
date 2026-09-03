export type CreateNoteRequest = {
    content: string;
};

export type NoteResponse = {
    noteId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type NoteListResponse = {
    content: NoteResponse[];
    page: number;
    size: number;
    hasNext: boolean;
};