package com.memorycalendar.event.dto;

import com.memorycalendar.event.entity.Event;

import java.time.LocalDateTime;

public record EventResponseDto(
        Long eventId,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        boolean allDay,
        String location
) {
    public static EventResponseDto from(Event event) {
        return new EventResponseDto(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartAt(),
                event.getEndAt(),
                event.isAllDay(),
                event.getLocation()
        );
    }
}
