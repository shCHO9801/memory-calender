"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {DatesSetArg} from "@fullcalendar/core";

type CalendarEventSummary = {
    eventId: number;
    title: string;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
};

type MonthlyCalendarProps = {
    events: CalendarEventSummary[];
    onDatesSet: (info: DatesSetArg) => void;
};

export default function MonthlyCalendar({
                                            events,
                                            onDatesSet,
                                        }: MonthlyCalendarProps) {
    return (
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
                    events={events.map((event) => ({
                        id: String(event.eventId),
                        title: event.title,
                        start: event.startAt,
                        end: event.endAt ?? undefined,
                        allDay: event.allDay,
                    }))}
                    datesSet={onDatesSet}
                />
            </div>
        </section>
    );
}