"use client";

import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "@/lib/note";
import type { NoteResponse } from "@/types/note";
import { FormEvent, useEffect, useState } from "react";

export default function NotesPage() {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    loadNotes();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await createNote({ content });

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

      await loadNotes();
    } catch {
      setErrorMessage("노트 삭제에 실패했습니다.");
    }
  };

  return (
    <main>
      <h1>Notes</h1>

      <form onSubmit={handleCreate}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="기록을 작성해주세요."
          rows={5}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

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
                      setEditingContent(event.target.value)
                    }
                    rows={3}
                  />

                  <button
                    type="button"
                    onClick={() => handleUpdate(note.noteId)}
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
                  <small>{note.createdAt}</small>

                  <button
                    type="button"
                    onClick={() => handleEditStart(note)}
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(note.noteId)}
                  >
                    삭제
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}