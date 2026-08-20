package com.memorycalendar.note.dto;

import com.memorycalendar.note.entity.Note;

import java.time.LocalDateTime;

public record CreateNoteResponseDto(
        Long userId,
        String content,
        LocalDateTime createdAt
) {

    public static CreateNoteResponseDto from(Note note) {
        return new CreateNoteResponseDto(
                note.getId(),
                note.getContent(),
                note.getCreatedAt()
        );
    }
}
