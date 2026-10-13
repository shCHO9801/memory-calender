"use client";

import type {NoteResponse} from "@/types/note";
import type {ClassificationItem} from "@/types/schedule";

import ScheduleCandidateList from "@/components/notes/ScheduleCandidateList";

type NoteItemProps = {
    note: NoteResponse;

    isEditing: boolean;
    editingContent: string;
    extracting: boolean;

    candidates: ClassificationItem[] | undefined;
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

export default function NoteItem({
                                     note,
                                     isEditing,
                                     editingContent,
                                     extracting,
                                     candidates,
                                     registeredCandidates,
                                     onEditStart,
                                     onEditCancel,
                                     onEditingContentChange,
                                     onUpdate,
                                     onDelete,
                                     onExtractSchedule,
                                     onCandidateChange,
                                     onRegisterCandidate,
                                 }: NoteItemProps) {
    return (
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            {isEditing ? (
                <>
                    <textarea
                        value={editingContent}
                        onChange={(event) =>
                            onEditingContentChange(
                                event.target.value
                            )
                        }
                        rows={4}
                        className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onEditCancel}
                            className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            onClick={() => onUpdate(note.noteId)}
                            disabled={!editingContent.trim()}
                            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
                        >
                            저장
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-800">
                        {note.content}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-zinc-400">
                            {formatDateTime(note.createdAt)}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => onEditStart(note)}
                                className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                수정
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(note.noteId)}
                                className="rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                            >
                                삭제
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onExtractSchedule(note.noteId)
                                }
                                disabled={extracting}
                                className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                            >
                                {extracting
                                    ? "추출 중..."
                                    : "AI 일정 추출"}
                            </button>
                        </div>
                    </div>

                    {candidates && (
                        <ScheduleCandidateList
                            noteId={note.noteId}
                            candidates={candidates}
                            registeredCandidates={
                                registeredCandidates
                            }
                            onChange={onCandidateChange}
                            onRegister={onRegisterCandidate}
                        />
                    )}
                </>
            )}
        </article>
    );
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}