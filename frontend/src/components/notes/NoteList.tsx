"use client";

import EmptyState from "@/components/common/EmptyState";
import NoteItem from "@/components/notes/NoteItem";

import type {NoteResponse} from "@/types/note";
import type {ClassificationItem} from "@/types/schedule";

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
            <EmptyState
                title="아직 작성한 노트가 없습니다."
                description="위 입력창에서 첫 번째 노트를 작성해보세요."
            />
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