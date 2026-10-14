"use client";

import {useEffect, useState} from "react";
import type {DatesSetArg} from "@fullcalendar/core";

import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingState from "@/components/common/LoadingState";
import DashboardEventDetailModal from "@/components/dashboard/DashboardEventDetailModal";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";
import QuickMemo from "@/components/dashboard/QuickMemo";
import TodoPanel from "@/components/dashboard/TodoPanel";
import TodayEventsPanel from "@/components/dashboard/TodayEventsPanel";

import {apiFetch} from "@/lib/api";
import {
    getEvent,
    getEvents,
    type EventDetail,
    type EventSummary,
} from "@/lib/events-api";

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

export default function DashboardPage() {
    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [calendarEvents, setCalendarEvents] =
        useState<EventSummary[]>([]);

    const [selectedEvent, setSelectedEvent] =
        useState<EventDetail | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data =
                    await apiFetch<DashboardResponse>(
                        "/api/dashboard",
                    );

                setDashboard(data);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(
                    getErrorMessage(error),
                );
            } finally {
                setIsLoading(false);
            }
        };

        void fetchDashboard();
    }, []);

    const fetchCalendarEvents = async (
        startAt: string,
        endAt: string,
    ) => {
        try {
            const data = await getEvents(
                startAt,
                endAt,
            );

            setCalendarEvents(data);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error),
            );
        }
    };

    const handleDatesSet = (
        info: DatesSetArg,
    ) => {
        void fetchCalendarEvents(
            info.startStr.slice(0, 19),
            info.endStr.slice(0, 19),
        );
    };

    const handleEventClick = async (
        eventId: number,
    ) => {
        try {
            const event =
                await getEvent(eventId);

            setSelectedEvent(event);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error),
            );
        }
    };

    return (
        <>
            <div className="mx-auto max-w-7xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Memory Calendar
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        오늘 일정과 할 일을 확인하세요.
                    </p>
                </header>

                <ErrorMessage
                    message={errorMessage}
                />

                {isLoading ? (
                    <LoadingState />
                ) : (
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
                        <MonthlyCalendar
                            events={calendarEvents}
                            onDatesSet={
                                handleDatesSet
                            }
                            onEventClick={(
                                eventId,
                            ) => {
                                void handleEventClick(
                                    eventId,
                                );
                            }}
                        />

                        <div className="space-y-4">
                            <TodoPanel
                                todos={
                                    dashboard?.activeTodos ??
                                    []
                                }
                            />

                            <TodayEventsPanel
                                events={
                                    dashboard?.todayEvents ??
                                    []
                                }
                            />

                            <QuickMemo />
                        </div>
                    </div>
                )}
            </div>

            {selectedEvent && (
                <DashboardEventDetailModal
                    event={selectedEvent}
                    onClose={() =>
                        setSelectedEvent(null)
                    }
                />
            )}
        </>
    );
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "요청 처리에 실패했습니다.";
}