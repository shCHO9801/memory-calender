"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { logout } from "@/lib/auth";
import { createEvent } from "@/lib/event";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "@/lib/note";
import { extractSchedule } from "@/lib/schedule";

import type { NoteResponse } from "@/types/note";
import type { ScheduleCandidate } from "@/types/schedule";

export default function NotesPage() {
  const router = useRouter();
  const isAuthenticated = useAuthGuard();

  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  const [editingNoteId, setEditingNoteId] =
    useState<number | null>(null);

  const [editingContent, setEditingContent] =
    useState("");

  const [scheduleCandidates, setScheduleCandidates] =
    useState<Record<number, ScheduleCandidate[]>>({});

  const [registeredCandidates, setRegisteredCandidates] =
    useState<Record<string, boolean>>({});

  const [extractingNoteId, setExtractingNoteId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getNotes();

      setNotes(response.content);
    } catch {
      setErrorMessage("노트 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();

        setNotes(response.content);
      } catch {
        setErrorMessage("노트 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
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
        content,
      });

      setContent("");

      await loadNotes();
    } catch {
      setErrorMessage("노트 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (note: NoteResponse) => {
    setEditingNoteId(note.noteId);
    setEditingContent(note.content);
  };

  const handleEditCancel = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleUpdate = async (noteId: number) => {
    if (!editingContent.trim()) {
      return;
    }

    try {
      setErrorMessage("");

      await updateNote(noteId, {
        content: editingContent,
      });

      setEditingNoteId(null);
      setEditingContent("");

      await loadNotes();
    } catch {
      setErrorMessage("노트 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (noteId: number) => {
    try {
      setErrorMessage("");

      await deleteNote(noteId);

      setScheduleCandidates((prev) => {
        const next = { ...prev };

        delete next[noteId];

        return next;
      });

      await loadNotes();
    } catch {
      setErrorMessage("노트 삭제에 실패했습니다.");
    }
  };

  const handleExtractSchedule = async (noteId: number) => {
    try {
      setExtractingNoteId(noteId);
      setErrorMessage("");

      const response = await extractSchedule(noteId);

      setScheduleCandidates((prev) => ({
        ...prev,
        [noteId]: response.candidates,
      }));
    } catch {
      setErrorMessage("일정 추출에 실패했습니다.");
    } finally {
      setExtractingNoteId(null);
    }
  };

  const handleCandidateChange = (
    noteId: number,
    index: number,
    field: keyof ScheduleCandidate,
    value: string | boolean | null,
  ) => {
    setScheduleCandidates((prev) => {
      const candidates = [...(prev[noteId] ?? [])];

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

  const getCandidateKey = (noteId: number, index: number) =>
    `${noteId}-${index}`;

  const handleCreateEvent = async (
    noteId: number,
    index: number,
    candidate: ScheduleCandidate,
  ) => {
    const key = getCandidateKey(noteId, index);

    if (registeredCandidates[key]) {
      return;
    }

    try {
      setErrorMessage("");

      await createEvent({
        noteId,
        title: candidate.title,
        description: candidate.description,
        startAt: candidate.startAt,
        endAt: candidate.endAt,
        allDay: candidate.allDay,
      });

      setRegisteredCandidates((prev) => ({
        ...prev,
        [key]: true,
      }));

      alert("일정이 등록되었습니다.");
    } catch {
      setErrorMessage("일정 등록에 실패했습니다.");
    }
  };

  if (!isAuthenticated) {
    return <p>인증 확인 중...</p>;
  }

  return (
    <main>
      <h1>Notes</h1>

      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>

      <form onSubmit={handleCreate}>
        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="기록을 작성해주세요."
          rows={5}
        />

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </form>

      {errorMessage && (
        <p>{errorMessage}</p>
      )}

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.noteId}>
              {editingNoteId === note.noteId ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(event) =>
                      setEditingContent(
                        event.target.value,
                      )
                    }
                    rows={3}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdate(note.noteId)
                    }
                  >
                    저장
                  </button>

                  <button
                    type="button"
                    onClick={handleEditCancel}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <p>{note.content}</p>

                  <small>
                    {note.createdAt}
                  </small>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        handleEditStart(note)
                      }
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(note.noteId)
                      }
                    >
                      삭제
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleExtractSchedule(
                          note.noteId,
                        )
                      }
                      disabled={
                        extractingNoteId ===
                        note.noteId
                      }
                    >
                      {extractingNoteId ===
                        note.noteId
                        ? "추출 중..."
                        : "일정 추출"}
                    </button>
                  </div>

                  {scheduleCandidates[
                    note.noteId
                  ] && (
                      <div>
                        {scheduleCandidates[
                          note.noteId
                        ].length === 0 ? (
                          <p>
                            추출된 일정이 없습니다.
                          </p>
                        ) : (
                          scheduleCandidates[
                            note.noteId
                          ].map(
                            (
                              candidate,
                              index,
                            ) => {
                              const candidateKey =
                                getCandidateKey(
                                  note.noteId,
                                  index,
                                );
                              const isRegistered =
                                registeredCandidates[
                                  candidateKey
                                ];

                              return (
                                <div key={index}>
                                <div>
                                  <label>
                                    제목
                                  </label>

                                  <input
                                    value={
                                      candidate.title
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleCandidateChange(
                                        note.noteId,
                                        index,
                                        "title",
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <label>
                                    시작 시간
                                  </label>

                                  <input
                                    type="datetime-local"
                                    value={
                                      candidate.startAt
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleCandidateChange(
                                        note.noteId,
                                        index,
                                        "startAt",
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <label>
                                    종료 시간
                                  </label>

                                  <input
                                    type="datetime-local"
                                    value={
                                      candidate.endAt ??
                                      ""
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleCandidateChange(
                                        note.noteId,
                                        index,
                                        "endAt",
                                        event
                                          .target
                                          .value ||
                                        null,
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <label>
                                    설명
                                  </label>

                                  <textarea
                                    value={
                                      candidate.description ??
                                      ""
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleCandidateChange(
                                        note.noteId,
                                        index,
                                        "description",
                                        event
                                          .target
                                          .value ||
                                        null,
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={
                                        candidate.allDay
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        handleCandidateChange(
                                          note.noteId,
                                          index,
                                          "allDay",
                                          event
                                            .target
                                            .checked,
                                        )
                                      }
                                    />

                                    종일 일정
                                  </label>
                                </div>

                                <p>
                                  장소:{" "}
                                  {candidate.location ??
                                    "없음"}
                                </p>

                                {candidate.needsConfirmation && (
                                  <p>
                                    확인이 필요한
                                    일정입니다.
                                  </p>
                                )}

                                <button
                                  type="button"
                                  disabled={isRegistered}
                                  onClick={() =>
                                    handleCreateEvent(
                                      note.noteId,
                                      index,
                                      candidate,
                                    )
                                  }
                                >
                                  {isRegistered
                                    ? "등록 완료"
                                    : "일정 등록"}
                                </button>
                              </div>
                              );
                            },
                          )
                        )}
                      </div>
                    )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
