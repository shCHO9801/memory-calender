package com.memorycalendar.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConfirmClassificationItemDto(
        @NotNull
        CandidateType type,

        @NotBlank
        String content,

        LocalDateTime startAt,
        LocalDateTime endAt,
        LocalDateTime dueAt,
        String location
) {
}