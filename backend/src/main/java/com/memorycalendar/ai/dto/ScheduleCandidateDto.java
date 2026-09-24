package com.memorycalendar.ai.dto;

import java.time.LocalDateTime;

public record ScheduleCandidateDto(
        String title,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String description,
        String location,
        boolean allDay,
        boolean needsConfirmation
) {
}
