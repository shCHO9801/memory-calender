package com.memorycalendar.todo.controller;

import com.memorycalendar.libs.dto.SliceResponseDto;
import com.memorycalendar.todo.dto.*;
import com.memorycalendar.todo.entity.Todo;
import com.memorycalendar.todo.entity.TodoStatus;
import com.memorycalendar.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<CreateTodoResponseDto> createTodo(
            Authentication authentication,
            @Valid @RequestBody CreateTodoRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Todo newTodo = todoService.createTodo(userId, requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CreateTodoResponseDto.from(newTodo));
    }

    @GetMapping("/{todoId}")
    public ResponseEntity<TodoResponseDto> getTodo(
            Authentication authentication,
            @PathVariable Long todoId
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Todo todo = todoService.getTodo(userId, todoId);

        return ResponseEntity.ok(TodoResponseDto.from(todo));
    }

    @GetMapping
    public ResponseEntity<SliceResponseDto<TodoResponseDto>> getTodos(
            Authentication authentication,
            @RequestParam(required = false) TodoStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                )
        );

        SliceResponseDto<TodoResponseDto> response =
                todoService.getTodos(userId, status, pageable);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{todoId}")
    public ResponseEntity<TodoResponseDto> updateTodo(
            Authentication authentication,
            @PathVariable Long todoId,
            @Valid @RequestBody UpdateTodoRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Todo todo = todoService.updateTodo(userId, todoId, requestDto);

        return ResponseEntity.ok(TodoResponseDto.from(todo));
    }

    @PatchMapping("/{todoId}/status")
    public ResponseEntity<TodoResponseDto> updateTodoStatus(
            Authentication authentication,
            @PathVariable Long todoId,
            @Valid @RequestBody UpdateTodoStatusRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Todo todo = todoService.updateTodoStatus(
                userId,
                todoId,
                requestDto.status()
        );

        return ResponseEntity.ok(TodoResponseDto.from(todo));
    }

    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo(
            Authentication authentication,
            @PathVariable Long todoId
    ) {
        Long userId = Long.valueOf(authentication.getName());

        todoService.deleteTodo(userId, todoId);

        return ResponseEntity.noContent().build();
    }
}
