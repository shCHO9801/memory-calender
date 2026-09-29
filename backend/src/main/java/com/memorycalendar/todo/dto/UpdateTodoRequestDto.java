package com.memorycalendar.todo.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record UpdateTodoRequestDto(
        @NotBlank
        String content,
        LocalDateTime dueAt
) {
}
