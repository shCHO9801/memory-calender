package com.memorycalendar.todo.service;

import com.memorycalendar.libs.dto.SliceResponseDto;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.service.NoteService;
import com.memorycalendar.todo.dto.CreateTodoRequestDto;
import com.memorycalendar.todo.dto.TodoResponseDto;
import com.memorycalendar.todo.dto.UpdateTodoRequestDto;
import com.memorycalendar.todo.entity.Todo;
import com.memorycalendar.todo.entity.TodoStatus;
import com.memorycalendar.todo.repository.TodoRepository;
import com.memorycalendar.user.entity.User;
import com.memorycalendar.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import static com.memorycalendar.libs.exception.ErrorCode.TODO_NOT_FOUND;
import static com.memorycalendar.libs.exception.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final NoteService noteService;

    @Transactional
    public Todo createTodo(Long userId, CreateTodoRequestDto requestDto) {

        User user = findUserById(userId);
        Note note = requestDto.noteId() != null ?
                noteService.getNote(userId, requestDto.noteId())
                : null;

        Todo todo = Todo.of(
                user,
                note,
                requestDto.content(),
                requestDto.dueAt()
        );

        return todoRepository.save(todo);
    }

    public Todo getTodo(Long userId, Long todoId) {

        return todoRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new CustomException(TODO_NOT_FOUND));
    }

    public SliceResponseDto<TodoResponseDto> getTodos(
            Long userId,
            TodoStatus status,
            Pageable pageable
    ) {
        Slice<Todo> todos;

        if (status == null) {
            todos = todoRepository.findAllByUserId(userId, pageable);
        } else {
            todos = todoRepository.findAllByUserIdAndStatus(userId, status, pageable);
        }

        return SliceResponseDto.from(
                todos.map(TodoResponseDto::from)
        );
    }

    @Transactional
    public Todo updateTodo(
            Long userId,
            Long todoId,
            UpdateTodoRequestDto requestDto
    ) {

        Todo todo = getTodo(userId, todoId);

        todo.updateContent(requestDto.content());
        todo.updateDueAt(requestDto.dueAt());

        return todo;
    }

    @Transactional
    public Todo updateTodoStatus(Long userId, Long todoId, TodoStatus status) {

        Todo todo = getTodo(userId, todoId);

        todo.changeStatus(status);

        return todo;
    }

    @Transactional
    public void deleteTodo(Long userId, Long todoId) {
        Todo todo = getTodo(userId, todoId);
        todoRepository.delete(todo);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));
    }
}
