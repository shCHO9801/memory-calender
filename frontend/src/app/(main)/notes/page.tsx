"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingState from "@/components/common/LoadingState";
import {
    useToast,
} from "@/components/common/ToastProvider";
import NoteCreateForm from "@/components/notes/NoteCreateForm";
import NoteList from "@/components/notes/NoteList";

import {
    createNote,
    deleteNote,
    getNotes,
    updateNote,
} from "@/lib/note";

import {
    confirmClassification,
    extractSchedule,
} from "@/lib/schedule";

import type {NoteResponse} from "@/types/note";
import type {
    ClassificationItem,
} from "@/types/schedule";

export default function NotesPage() {
    const {showToast} = useToast();

    const [content, setContent] = useState("");
    const [notes, setNotes] =
        useState<NoteResponse[]>([]);

    const [editingNoteId, setEditingNoteId] =
        useState<number | null>(null);

    const [editingContent, setEditingContent] =
        useState("");

    const [
        scheduleCandidates,
        setScheduleCandidates,
    ] = useState<
        Record<number, ClassificationItem[]>
    >({});

    const [
        registeredCandidates,
        setRegisteredCandidates,
    ] = useState<Record<string, boolean>>({});

    const [
        extractingNoteId,
        setExtractingNoteId,
    ] = useState<number | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const loadNotes = async () => {
        try {
            const response = await getNotes();

            setNotes(response.content);
            setErrorMessage("");
        } catch {
            setErrorMessage(
                "노트 목록을 불러오지 못했습니다.",
            );
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await getNotes();

                setNotes(response.content);
            } catch {
                setErrorMessage(
                    "노트 목록을 불러오지 못했습니다.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        void fetchNotes();
    }, []);

    const handleCreate = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage("");

            await createNote({
                content: content.trim(),
            });

            setContent("");

            await loadNotes();

            showToast("노트를 저장했습니다.");
        } catch {
            setErrorMessage(
                "노트 작성에 실패했습니다.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditStart = (
        note: NoteResponse,
    ) => {
        setEditingNoteId(note.noteId);
        setEditingContent(note.content);
    };

    const handleEditCancel = () => {
        setEditingNoteId(null);
        setEditingContent("");
    };

    const handleUpdate = async (
        noteId: number,
    ) => {
        if (!editingContent.trim()) {
            return;
        }

        try {
            setErrorMessage("");

            await updateNote(noteId, {
                content: editingContent.trim(),
            });

            setEditingNoteId(null);
            setEditingContent("");

            await loadNotes();

            showToast("노트를 수정했습니다.");
        } catch {
            setErrorMessage(
                "노트 수정에 실패했습니다.",
            );
        }
    };

    const handleDelete = async (
        noteId: number,
    ) => {
        const confirmed =
            window.confirm(
                "이 노트를 삭제하시겠습니까?",
            );

        if (!confirmed) {
            return;
        }

        try {
            setErrorMessage("");

            await deleteNote(noteId);

            setScheduleCandidates((prev) => {
                const next = {...prev};

                delete next[noteId];

                return next;
            });

            await loadNotes();

            showToast("노트를 삭제했습니다.");
        } catch {
            setErrorMessage(
                "노트 삭제에 실패했습니다.",
            );
        }
    };

    const handleExtractSchedule = async (
        noteId: number,
    ) => {
        try {
            setExtractingNoteId(noteId);
            setErrorMessage("");

            const response =
                await extractSchedule(noteId);

            setScheduleCandidates((prev) => ({
                ...prev,
                [noteId]: response.items,
            }));
        } catch {
            setErrorMessage(
                "일정 추출에 실패했습니다.",
            );
        } finally {
            setExtractingNoteId(null);
        }
    };

    const handleCandidateChange = (
        noteId: number,
        index: number,
        field: keyof ClassificationItem,
        value: string | null,
    ) => {
        setScheduleCandidates((prev) => {
            const candidates = [
                ...(prev[noteId] ?? []),
            ];

            candidates[index] = {
                ...candidates[index],
                [field]: value,
            };

            return {
                ...prev,
                [noteId]: candidates,
            };
        });
    };

    const handleConfirmCandidate = async (
        noteId: number,
        index: number,
        candidate: ClassificationItem,
    ) => {
        const key = `${noteId}-${index}`;

        if (registeredCandidates[key]) {
            return;
        }

        try {
            setErrorMessage("");

            await confirmClassification(
                noteId,
                {
                    items: [
                        {
                            type: candidate.type,
                            content:
                                candidate.content.trim(),
                            startAt:
                                candidate.type ===
                                "EVENT"
                                    ? candidate.startAt
                                    : null,
                            endAt:
                                candidate.type ===
                                "EVENT"
                                    ? candidate.endAt
                                    : null,
                            dueAt:
                                candidate.type ===
                                "TODO"
                                    ? candidate.dueAt
                                    : null,
                            location:
                                candidate.type ===
                                "EVENT"
                                    ? candidate.location
                                    : null,
                        },
                    ],
                },
            );

            setRegisteredCandidates(
                (prev) => ({
                    ...prev,
                    [key]: true,
                }),
            );

            showToast(
                candidate.type === "EVENT"
                    ? "일정을 등록했습니다."
                    : "할 일을 등록했습니다.",
            );
        } catch {
            setErrorMessage(
                candidate.type === "EVENT"
                    ? "일정 등록에 실패했습니다."
                    : "할 일 등록에 실패했습니다.",
            );
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <header>
                <h1 className="text-2xl font-semibold text-zinc-900">
                    Notes
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    자유롭게 기록하고 AI로 일정을
                    추출하세요.
                </p>
            </header>

            <NoteCreateForm
                content={content}
                isSubmitting={isSubmitting}
                onContentChange={setContent}
                onSubmit={handleCreate}
            />

            <ErrorMessage message={errorMessage} />

            {isLoading ? (
                <LoadingState />
            ) : (
                <NoteList
                    notes={notes}
                    editingNoteId={editingNoteId}
                    editingContent={editingContent}
                    extractingNoteId={
                        extractingNoteId
                    }
                    scheduleCandidates={
                        scheduleCandidates
                    }
                    registeredCandidates={
                        registeredCandidates
                    }
                    onEditStart={
                        handleEditStart
                    }
                    onEditCancel={
                        handleEditCancel
                    }
                    onEditingContentChange={
                        setEditingContent
                    }
                    onUpdate={(noteId) => {
                        void handleUpdate(noteId);
                    }}
                    onDelete={(noteId) => {
                        void handleDelete(noteId);
                    }}
                    onExtractSchedule={(noteId) => {
                        void handleExtractSchedule(
                            noteId,
                        );
                    }}
                    onCandidateChange={
                        handleCandidateChange
                    }
                    onRegisterCandidate={(
                        noteId,
                        index,
                        candidate,
                    ) => {
                        void handleConfirmCandidate(
                            noteId,
                            index,
                            candidate,
                        );
                    }}
                />
            )}
        </div>
    );
}