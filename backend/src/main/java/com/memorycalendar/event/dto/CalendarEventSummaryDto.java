package com.memorycalendar.event.dto;

import com.memorycalendar.event.entity.Event;

import java.time.LocalDateTime;

public record CalendarEventSummaryDto(
        Long eventId,
        String title,
        LocalDateTime startAt,
        LocalDateTime endAt,
        boolean allDay
) {
    public static CalendarEventSummaryDto from(Event event) {
        return new CalendarEventSummaryDto(
                event.getId(),
                event.getTitle(),
                event.getStartAt(),
                event.getEndAt(),
                event.isAllDay()
        );
    }
}