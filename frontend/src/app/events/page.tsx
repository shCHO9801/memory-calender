"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { logout } from "@/lib/auth";
import {
  deleteEvent,
  getEvents,
  updateEvent,
} from "@/lib/event";

import type {
  EventResponse,
  UpdateEventRequest,
} from "@/types/event";

export default function EventsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthGuard();

  const [startAt, setStartAt] = useState("2026-09-01T00:00");
  const [endAt, setEndAt] = useState("2026-09-30T23:59");

  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editingEventId, setEditingEventId] =
    useState<number | null>(null);

  const [editingEvent, setEditingEvent] =
    useState<UpdateEventRequest | null>(null);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getEvents(startAt, endAt);

      setEvents(response.content);
    } catch {
      setErrorMessage("일정 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await loadEvents();
  };

  const handleEditStart = (event: EventResponse) => {
    setEditingEventId(event.eventId);

    setEditingEvent({
      title: event.title,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      allDay: event.allDay,
    });
  };

  const handleEditCancel = () => {
    setEditingEventId(null);
    setEditingEvent(null);
  };

  const handleUpdate = async (eventId: number) => {
    if (!editingEvent) {
      return;
    }

    try {
      setErrorMessage("");

      await updateEvent(eventId, editingEvent);

      setEditingEventId(null);
      setEditingEvent(null);

      await loadEvents();
    } catch {
      setErrorMessage("일정 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (eventId: number) => {
    try {
      setErrorMessage("");

      await deleteEvent(eventId);

      await loadEvents();
    } catch {
      setErrorMessage("일정 삭제에 실패했습니다.");
    }
  };

  if (!isAuthenticated) {
    return <p>인증 확인 중...</p>;
  }

  return (
    <main>
      <h1>Events</h1>

      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>

      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="startAt">시작</label>

          <input
            id="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(event) =>
              setStartAt(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="endAt">종료</label>

          <input
            id="endAt"
            type="datetime-local"
            value={endAt}
            onChange={(event) =>
              setEndAt(event.target.value)
            }
          />
        </div>

        <button type="submit">
          조회
        </button>
      </form>

      {errorMessage && (
        <p>{errorMessage}</p>
      )}

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li
              key={event.eventId}
              style={{
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "1px solid #ddd",
              }}
            >
              {editingEventId === event.eventId &&
                editingEvent ? (
                <>
                  <div>
                    <label>제목</label>

                    <input
                      value={editingEvent.title}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>설명</label>

                    <textarea
                      value={
                        editingEvent.description ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          description:
                            e.target.value || null,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>시작 시간</label>

                    <input
                      type="datetime-local"
                      value={editingEvent.startAt}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          startAt: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>종료 시간</label>

                    <input
                      type="datetime-local"
                      value={
                        editingEvent.endAt ?? ""
                      }
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          endAt:
                            e.target.value || null,
                        })
                      }
                    />
                  </div>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        editingEvent.allDay
                      }
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          allDay: e.target.checked,
                        })
                      }
                    />
                    종일 일정
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdate(event.eventId)
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
                  <p>{event.title}</p>

                  <p>
                    시작: {event.startAt}
                  </p>

                  <p>
                    종료:{" "}
                    {event.endAt ?? "없음"}
                  </p>

                  <p>
                    설명:{" "}
                    {event.description ?? "없음"}
                  </p>

                  <p>
                    종일 일정:{" "}
                    {event.allDay
                      ? "예"
                      : "아니오"}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleEditStart(event)
                    }
                    style={{ marginRight: "8px" }}
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(event.eventId)
                    }
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
