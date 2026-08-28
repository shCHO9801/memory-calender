package com.memorycalendar.event.entity;

import com.memorycalendar.global.common.entity.BaseEntity;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Event extends BaseEntity {

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
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "all_day", nullable = false)
    private boolean allDay;

    public static Event of (
            User user,
            Note note,
            String title,
            String description,
            LocalDateTime startAt,
            LocalDateTime endAt,
            boolean allDay
    ) {
        return Event.builder()
                .user(user)
                .note(note)
                .title(title)
                .description(description)
                .startAt(startAt)
                .endAt(endAt)
                .allDay(allDay)
                .build();
    }
}
