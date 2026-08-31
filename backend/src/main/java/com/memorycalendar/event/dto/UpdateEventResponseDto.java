package com.memorycalendar.event.dto;

import com.memorycalendar.event.entity.Event;

import java.time.LocalDateTime;

public record UpdateEventResponseDto(
        Long eventId,
        Long noteId,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        boolean allDay,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UpdateEventResponseDto from(Event event) {
        return new UpdateEventResponseDto(
                event.getId(),
                event.getNote() != null ? event.getNote().getId() : null,
                event.getTitle(),
                event.getDescription(),
                event.getStartAt(),
                event.getEndAt(),
                event.isAllDay(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}
