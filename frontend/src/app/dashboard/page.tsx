"use client";

import {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {DatesSetArg} from "@fullcalendar/core";

import {getAccessToken} from "@/lib/auth-storage";

type EventResponse = {
    eventId: number;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    location: string | null;
};

type TodoResponse = {
    todoId: number;
    content: string;
    dueAt: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    completedAt: string | null;
};

type DashboardResponse = {
    todayEvents: EventResponse[];
    activeTodos: TodoResponse[];
};

type CalendarEventSummary = {
    eventId: number;
    title: string;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
};

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEventSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = getAccessToken();

            if (!token) {
                setErrorMessage("로그인이 필요합니다.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error();
                }

                const data: DashboardResponse = await response.json();

                setDashboard(data);
            } catch {
                setErrorMessage("대시보드 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const fetchCalendarEvents = async (
        startAt: string,
        endAt: string
    ) => {
        const token = getAccessToken();

        if (!token) {
            return;
        }

        const params = new URLSearchParams({
            startAt,
            endAt,
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/calendar?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("캘린더 일정 조회에 실패했습니다.");
        }

        const data: CalendarEventSummary[] = await response.json();

        setCalendarEvents(data);
    };

    const handleDatesSet = (info: DatesSetArg) => {
        void fetchCalendarEvents(
            info.startStr.slice(0, 19),
            info.endStr.slice(0, 19)
        );
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-zinc-500">불러오는 중...</p>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-red-500">{errorMessage}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 px-4 py-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Memory Calendar
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        오늘 일정과 할 일을 확인하세요.
                    </p>
                </header>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
                    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            월간 캘린더
                        </h2>

                        <div className="mt-3">
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                locale="ko"
                                height="auto"
                                displayEventTime={false}
                                events={calendarEvents.map((event) => ({
                                    id: String(event.eventId),
                                    title: event.title,
                                    start: event.startAt,
                                    end: event.endAt ?? undefined,
                                    allDay: event.allDay,
                                }))}
                                datesSet={handleDatesSet}
                            />
                        </div>
                    </section>

                    <div className="space-y-4">
                        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    할 일
                                </h2>

                                <span className="text-sm text-zinc-500">
                    {dashboard?.activeTodos.length ?? 0}개
                </span>
                            </div>

                            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                                {dashboard?.activeTodos.length === 0 && (
                                    <p className="text-sm text-zinc-500">
                                        남아있는 할 일이 없습니다.
                                    </p>
                                )}

                                {dashboard?.activeTodos.map((todo) => (
                                    <div
                                        key={todo.todoId}
                                        className="rounded-xl border border-zinc-200 p-3"
                                    >
                                        <p className="font-medium text-zinc-900">
                                            {todo.content}
                                        </p>

                                        {todo.dueAt && (
                                            <p className="mt-1 text-sm text-zinc-500">
                                                마감 {formatDateTime(todo.dueAt)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    오늘 일정
                                </h2>

                                <span className="text-sm text-zinc-500">
                    {dashboard?.todayEvents.length ?? 0}개
                </span>
                            </div>

                            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                                {dashboard?.todayEvents.length === 0 && (
                                    <p className="text-sm text-zinc-500">
                                        오늘 예정된 일정이 없습니다.
                                    </p>
                                )}

                                {dashboard?.todayEvents.map((event) => (
                                    <div
                                        key={event.eventId}
                                        className="rounded-xl border border-zinc-200 p-3"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-zinc-900">
                                                    {event.title}
                                                </p>

                                                {event.location && (
                                                    <p className="mt-1 text-sm text-zinc-500">
                                                        {event.location}
                                                    </p>
                                                )}
                                            </div>

                                            <p className="text-sm text-zinc-600">
                                                {formatTime(event.startAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-zinc-900">
                                빠른 메모
                            </h2>

                            <textarea
                                placeholder="일정이나 할 일을 자유롭게 입력하세요."
                                className="mt-3 min-h-24 w-full resize-none rounded-xl border border-zinc-300 p-3 text-sm outline-none focus:border-zinc-500"
                            />

                            <button
                                type="button"
                                className="mt-3 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                메모 작성
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}
