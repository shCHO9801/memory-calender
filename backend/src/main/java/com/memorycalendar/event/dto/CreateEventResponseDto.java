package com.memorycalendar.event.dto;

import com.memorycalendar.event.entity.Event;

import java.time.LocalDateTime;

public record CreateEventResponseDto(
        Long eventId,
        Long noteId,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        boolean allDay,
        LocalDateTime createdAt
) {
    public static CreateEventResponseDto from(Event event) {
        return new CreateEventResponseDto(
                event.getId(),
                event.getNote() != null ? event.getNote().getId() : null,
                event.getTitle(),
                event.getDescription(),
                event.getStartAt(),
                event.getEndAt(),
                event.isAllDay(),
                event.getCreatedAt()
        );
    }
}
