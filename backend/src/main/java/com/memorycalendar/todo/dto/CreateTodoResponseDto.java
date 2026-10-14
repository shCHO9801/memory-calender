package com.memorycalendar.todo.dto;

import com.memorycalendar.todo.entity.Todo;

import java.time.LocalDateTime;

public record CreateTodoResponseDto(
        Long todoId,
        String content,
        LocalDateTime dueAt,
        LocalDateTime createdAt
) {

    public static CreateTodoResponseDto from(Todo todo) {
        return new CreateTodoResponseDto(
                todo.getId(),
                todo.getContent(),
                todo.getDueAt(),
                todo.getCreatedAt()
        );
    }
}
