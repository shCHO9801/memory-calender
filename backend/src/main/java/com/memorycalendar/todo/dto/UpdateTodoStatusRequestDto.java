package com.memorycalendar.todo.dto;

import com.memorycalendar.todo.entity.TodoStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTodoStatusRequestDto(
        @NotNull
        TodoStatus status
) {
}
