"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type {DateClickArg} from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";
import type {DatesSetArg} from "@fullcalendar/core";

type CalendarEventSummary = {
    eventId: number;
    title: string;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
};

type CalendarMonthViewProps = {
    events: CalendarEventSummary[];
    onDatesSet: (info: DatesSetArg) => void;
    onDateClick: (info: DateClickArg) => void;
    onEventClick: (eventId: number) => void;
};

export default function EventMonthView({
                                           events,
                                           onDatesSet,
                                           onDateClick,
                                           onEventClick,
                                       }: CalendarMonthViewProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
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
                dateClick={onDateClick}
                eventClick={(info) => {
                    onEventClick(Number(info.event.id));
                }}
            />
        </section>
    );
}