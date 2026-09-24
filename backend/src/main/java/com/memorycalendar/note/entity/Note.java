package com.memorycalendar.note.entity;

import com.memorycalendar.global.common.entity.BaseEntity;
import com.memorycalendar.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Note extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private Note(User user, String content) {
        this.user = user;
        this.content = content;
    }

    public static Note of(User user, String content) {
        return new Note(user, content);
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
