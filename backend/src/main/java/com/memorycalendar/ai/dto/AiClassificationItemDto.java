package com.memorycalendar.ai.dto;

import java.time.LocalDateTime;

public record AiClassificationItemDto(
        CandidateType type,
        String content,
        LocalDateTime startAt,
        LocalDateTime endAt,
        LocalDateTime dueAt,
        String location,
        boolean needsConfirmation
) {
}