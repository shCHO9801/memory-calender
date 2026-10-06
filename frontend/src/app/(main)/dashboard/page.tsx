"use client";

import {useEffect, useState} from "react";

import type {DatesSetArg} from "@fullcalendar/core";
import QuickMemo from "@/components/dashboard/QuickMemo";
import TodoPanel from "@/components/dashboard/TodoPanel";
import TodayEventsPanel from "@/components/dashboard/TodayEventsPanel";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";

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
                <MonthlyCalendar
                    events={calendarEvents}
                    onDatesSet={handleDatesSet}
                />

                <div className="space-y-4">
                    <TodoPanel todos={dashboard?.activeTodos ?? []}/>

                    <TodayEventsPanel events={dashboard?.todayEvents ?? []}/>

                    <QuickMemo/>
                </div>
            </div>
        </div>
    );
}
