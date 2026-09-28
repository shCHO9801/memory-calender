package com.memorycalendar.todo.entity;

import com.memorycalendar.global.common.entity.BaseEntity;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static com.memorycalendar.todo.entity.TodoStatus.TODO;

@Entity
@Table(name = "todos")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Todo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    @Column(nullable = false)
    private String content;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoStatus status;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public static Todo of(
            User user,
            Note note,
            String content,
            LocalDateTime dueAt
    ) {
        return Todo.builder()
                .user(user)
                .note(note)
                .content(content)
                .dueAt(dueAt)
                .status(TODO)
                .build();
    }
}
