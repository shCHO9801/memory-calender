package com.memorycalendar.todo.dto;

import com.memorycalendar.todo.entity.Todo;
import com.memorycalendar.todo.entity.TodoStatus;

import java.time.LocalDateTime;

public record TodoResponseDto(
        Long todoId,
        String content,
        LocalDateTime dueAt,
        TodoStatus status,
        LocalDateTime completedAt
) {
    public static TodoResponseDto from(Todo todo) {
        return new TodoResponseDto(
                todo.getId(),
                todo.getContent(),
                todo.getDueAt(),
                todo.getStatus(),
                todo.getCompletedAt()
        );
    }
}
