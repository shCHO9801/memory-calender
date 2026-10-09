"use client";

import {useEffect, useState} from "react";
import type {DatesSetArg} from "@fullcalendar/core";
import type {DateClickArg} from "@fullcalendar/interaction";

import EventCreateModal from "@/components/events/EventCreateModal";
import EventDetailModal from "@/components/events/EventDetailModal";
import EventListView from "@/components/events/EventListView";
import EventMonthView from "@/components/events/EventMonthView";

import {
    createEvent,
    deleteEvent,
    type EventDetail,
    type EventSummary,
    getEvent,
    getEvents,
    updateEvent,
} from "@/lib/events-api";

type ViewMode = "list" | "month";

type EventRange = {
    startAt: string;
    endAt: string;
};

export default function EventsPage() {
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] =
        useState<EventDetail | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentRange, setCurrentRange] = useState<EventRange>(() =>
        getCurrentMonthRange()
    );

    useEffect(() => {
        let cancelled = false;

        getEvents(
            currentRange.startAt,
            currentRange.endAt
        )
            .then((data) => {
                if (cancelled) {
                    return;
                }

                setEvents(data);
                setErrorMessage("");
            })
            .catch((error) => {
                if (cancelled) {
                    return;
                }

                setErrorMessage(getErrorMessage(error));
            });

        return () => {
            cancelled = true;
        };
    }, [currentRange]);

    const refreshEvents = async () => {
        try {
            const data = await getEvents(
                currentRange.startAt,
                currentRange.endAt
            );

            setEvents(data);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleDatesSet = (info: DatesSetArg) => {
        setCurrentRange({
            startAt: info.startStr.slice(0, 19),
            endAt: info.endStr.slice(0, 19),
        });
    };

    const handleDateClick = (info: DateClickArg) => {
        setSelectedDate(info.dateStr);
        setIsCreateModalOpen(true);
    };

    const handleCreateButtonClick = () => {
        setSelectedDate(null);
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setSelectedDate(null);
    };

    const handleCreateEvent = async (
        title: string,
        description: string | null,
        startAt: string,
        endAt: string | null,
        allDay: boolean,
        location: string | null
    ) => {
        try {
            setErrorMessage("");

            await createEvent({
                noteId: null,
                title,
                description,
                startAt,
                endAt,
                allDay,
                location,
            });

            await refreshEvents();
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    const handleEventClick = async (eventId: number) => {
        try {
            setErrorMessage("");

            const event = await getEvent(eventId);

            setSelectedEvent(event);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleUpdateEvent = async (
        eventId: number,
        title: string,
        description: string | null,
        startAt: string,
        endAt: string | null,
        allDay: boolean,
        location: string | null
    ) => {
        try {
            setErrorMessage("");

            await updateEvent(eventId, {
                title,
                description,
                startAt,
                endAt,
                allDay,
                location,
            });

            setSelectedEvent(null);

            await refreshEvents();
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        try {
            setErrorMessage("");

            await deleteEvent(eventId);

            setSelectedEvent(null);

            await refreshEvents();
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Events
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        일정을 확인하고 관리하세요.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreateButtonClick}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                    + 일정 추가
                </button>
            </header>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg px-3 py-2 text-sm ${
                        viewMode === "list"
                            ? "bg-zinc-900 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100"
                    }`}
                >
                    List
                </button>

                <button
                    type="button"
                    onClick={() => setViewMode("month")}
                    className={`rounded-lg px-3 py-2 text-sm ${
                        viewMode === "month"
                            ? "bg-zinc-900 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100"
                    }`}
                >
                    Month
                </button>
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500">
                    {errorMessage}
                </p>
            )}

            {viewMode === "list" && (
                <EventListView
                    events={events}
                    onEventClick={(eventId) =>
                        void handleEventClick(eventId)
                    }
                />
            )}

            {viewMode === "month" && (
                <EventMonthView
                    events={events}
                    onDatesSet={handleDatesSet}
                    onDateClick={handleDateClick}
                    onEventClick={(eventId) =>
                        void handleEventClick(eventId)
                    }
                />
            )}

            {isCreateModalOpen && (
                <EventCreateModal
                    initialDate={selectedDate}
                    onClose={handleCloseCreateModal}
                    onCreate={handleCreateEvent}
                />
            )}

            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onUpdate={handleUpdateEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
}

function getCurrentMonthRange(): EventRange {
    const now = new Date();

    const startAt = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0
    );

    const endAt = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
        0,
        0,
        0
    );

    return {
        startAt: toLocalDateTimeString(startAt),
        endAt: toLocalDateTimeString(endAt),
    };
}

function toLocalDateTimeString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했습니다.";
}