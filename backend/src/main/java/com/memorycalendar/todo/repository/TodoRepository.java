package com.memorycalendar.todo.repository;

import com.memorycalendar.todo.entity.Todo;
import com.memorycalendar.todo.entity.TodoStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Optional<Todo> findByIdAndUserId(Long todoId, Long userId);

    Slice<Todo> findAllByUserId(Long userId, Pageable pageable);

    Slice<Todo> findAllByUserIdAndStatus(Long userId, TodoStatus status, Pageable pageable);
}
