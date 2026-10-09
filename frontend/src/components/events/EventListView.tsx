"use client";

import {useMemo, useState} from "react";

import type {EventSummary} from "@/lib/events-api";

type EventListViewProps = {
    events: EventSummary[];
    onEventClick: (eventId: number) => void;
};

type EventGroup = {
    monthKey: string;
    monthLabel: string;
    events: EventSummary[];
};

export default function EventListView({
                                          events,
                                          onEventClick,
                                      }: EventListViewProps) {
    const [showPastEvents, setShowPastEvents] = useState(false);

    const {
        upcomingGroups,
        pastGroups,
        upcomingEventCount,
        pastEventCount,
    } = useMemo(() => {
        const today = startOfToday(new Date());

        const sortedEvents = [...events].sort(
            (a, b) =>
                new Date(a.startAt).getTime() -
                new Date(b.startAt).getTime()
        );

        const upcoming = sortedEvents.filter(
            (event) => new Date(event.startAt) >= today
        );

        const past = sortedEvents.filter(
            (event) => new Date(event.startAt) < today
        );

        return {
            upcomingGroups: groupEventsByMonth(upcoming),
            pastGroups: groupEventsByMonth(past),
            upcomingEventCount: upcoming.length,
            pastEventCount: past.length,
        };
    }, [events]);

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                {upcomingGroups.length === 0 && (
                    <p className="py-6 text-sm text-zinc-500">
                        예정된 일정이 없습니다.
                    </p>
                )}

                <div className="space-y-8">
                    {upcomingGroups.map((group) => (
                        <EventMonthGroup
                            key={group.monthKey}
                            group={group}
                            onEventClick={onEventClick}
                        />
                    ))}
                </div>

                {pastEventCount > 0 && (
                    <div className="mt-8 border-t border-zinc-100 pt-5">
                        <button
                            type="button"
                            onClick={() =>
                                setShowPastEvents((prev) => !prev)
                            }
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                        >
                            {showPastEvents
                                ? "지난 일정 숨기기"
                                : `지난 일정 ${pastEventCount}개 보기`}
                        </button>

                        {showPastEvents && (
                            <div className="mt-6 space-y-8">
                                {pastGroups.map((group) => (
                                    <EventMonthGroup
                                        key={`past-${group.monthKey}`}
                                        group={group}
                                        onEventClick={onEventClick}
                                        muted
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5">
                <div>
                    <p className="text-sm font-semibold text-zinc-900">
                        이번 달 요약
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                        현재 조회 중인 일정 기준
                    </p>
                </div>

                <div className="mt-5 space-y-4">
                    <SummaryItem
                        label="예정 일정"
                        value={upcomingEventCount}
                    />

                    <SummaryItem
                        label="지난 일정"
                        value={pastEventCount}
                    />

                    <SummaryItem
                        label="전체 일정"
                        value={events.length}
                    />
                </div>

                {pastEventCount > 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPastEvents((prev) => !prev)
                        }
                        className="mt-6 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                    >
                        {showPastEvents
                            ? "지난 일정 숨기기"
                            : "지난 일정 보기"}
                    </button>
                )}
            </aside>
        </div>
    );
}

type SummaryItemProps = {
    label: string;
    value: number;
};

function SummaryItem({
                         label,
                         value,
                     }: SummaryItemProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
                {label}
            </span>

            <span className="text-sm font-semibold text-zinc-900">
                {value}개
            </span>
        </div>
    );
}

type EventMonthGroupProps = {
    group: EventGroup;
    onEventClick: (eventId: number) => void;
    muted?: boolean;
};

function EventMonthGroup({
                             group,
                             onEventClick,
                             muted = false,
                         }: EventMonthGroupProps) {
    return (
        <div>
            <h2
                className={`mb-3 text-sm font-semibold ${
                    muted
                        ? "text-zinc-400"
                        : "text-zinc-800"
                }`}
            >
                {group.monthLabel}
            </h2>

            <div className="divide-y divide-zinc-100">
                {group.events.map((event) => (
                    <button
                        key={event.eventId}
                        type="button"
                        onClick={() =>
                            onEventClick(event.eventId)
                        }
                        className="flex w-full items-start gap-4 rounded-lg px-2 py-4 text-left transition hover:bg-zinc-50"
                    >
                        <div className="w-16 shrink-0">
                            <p
                                className={`text-sm font-medium ${
                                    muted
                                        ? "text-zinc-400"
                                        : "text-zinc-700"
                                }`}
                            >
                                {formatDay(event.startAt)}
                            </p>
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className={`truncate font-medium ${
                                    muted
                                        ? "text-zinc-400"
                                        : "text-zinc-900"
                                }`}
                            >
                                {event.title}
                            </p>

                            <p
                                className={`mt-1 text-sm ${
                                    muted
                                        ? "text-zinc-300"
                                        : "text-zinc-500"
                                }`}
                            >
                                {formatEventTime(event)}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function groupEventsByMonth(
    events: EventSummary[]
): EventGroup[] {
    const groups = new Map<string, EventSummary[]>();

    for (const event of events) {
        const date = new Date(event.startAt);

        const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

        const existing = groups.get(monthKey);

        if (existing) {
            existing.push(event);
        } else {
            groups.set(monthKey, [event]);
        }
    }

    return Array.from(groups.entries()).map(
        ([monthKey, groupedEvents]) => {
            const firstEvent = groupedEvents[0];
            const firstDate = new Date(firstEvent.startAt);

            return {
                monthKey,
                monthLabel: new Intl.DateTimeFormat(
                    "ko-KR",
                    {
                        year: "numeric",
                        month: "long",
                    }
                ).format(firstDate),
                events: groupedEvents,
            };
        }
    );
}

function formatDay(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
    }).format(new Date(value));
}

function formatEventTime(event: EventSummary) {
    if (event.allDay) {
        return "하루 종일";
    }

    const start = formatTime(event.startAt);

    if (!event.endAt) {
        return start;
    }

    const end = formatTime(event.endAt);

    return `${start} ~ ${end}`;
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value));
}

function startOfToday(date: Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0
    );
}