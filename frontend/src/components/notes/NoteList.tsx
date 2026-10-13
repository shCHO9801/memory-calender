"use client";

import type {NoteResponse} from "@/types/note";
import type {ClassificationItem} from "@/types/schedule";

import NoteItem from "@/components/notes/NoteItem";

type NoteListProps = {
    notes: NoteResponse[];

    editingNoteId: number | null;
    editingContent: string;
    extractingNoteId: number | null;

    scheduleCandidates: Record<
        number,
        ClassificationItem[]
    >;

    registeredCandidates: Record<string, boolean>;

    onEditStart: (note: NoteResponse) => void;
    onEditCancel: () => void;
    onEditingContentChange: (value: string) => void;
    onUpdate: (noteId: number) => void;
    onDelete: (noteId: number) => void;
    onExtractSchedule: (noteId: number) => void;

    onCandidateChange: (
        noteId: number,
        index: number,
        field: keyof ClassificationItem,
        value: string | null
    ) => void;

    onRegisterCandidate: (
        noteId: number,
        index: number,
        candidate: ClassificationItem
    ) => void;
};

export default function NoteList({
                                     notes,
                                     editingNoteId,
                                     editingContent,
                                     extractingNoteId,
                                     scheduleCandidates,
                                     registeredCandidates,
                                     onEditStart,
                                     onEditCancel,
                                     onEditingContentChange,
                                     onUpdate,
                                     onDelete,
                                     onExtractSchedule,
                                     onCandidateChange,
                                     onRegisterCandidate,
                                 }: NoteListProps) {
    if (notes.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-12 text-center">
                <p className="text-sm text-zinc-500">
                    아직 작성한 노트가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notes.map((note) => (
                <NoteItem
                    key={note.noteId}
                    note={note}
                    isEditing={
                        editingNoteId === note.noteId
                    }
                    editingContent={editingContent}
                    extracting={
                        extractingNoteId === note.noteId
                    }
                    candidates={
                        scheduleCandidates[note.noteId]
                    }
                    registeredCandidates={
                        registeredCandidates
                    }
                    onEditStart={onEditStart}
                    onEditCancel={onEditCancel}
                    onEditingContentChange={
                        onEditingContentChange
                    }
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onExtractSchedule={onExtractSchedule}
                    onCandidateChange={onCandidateChange}
                    onRegisterCandidate={
                        onRegisterCandidate
                    }
                />
            ))}
        </div>
    );
}