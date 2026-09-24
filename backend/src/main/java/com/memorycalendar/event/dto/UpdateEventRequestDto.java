package com.memorycalendar.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record UpdateEventRequestDto(
        @NotBlank(message = "일정 제목은 필수입니다.")
        String title,

        String description,

        @NotNull(message = "일정 시작 시간은 필수입니다.")
        LocalDateTime startAt,

        LocalDateTime endAt,

        boolean allDay
) {
}
