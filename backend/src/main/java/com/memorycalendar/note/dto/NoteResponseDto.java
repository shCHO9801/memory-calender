package com.memorycalendar.note.dto;

import com.memorycalendar.note.entity.Note;

import java.time.LocalDateTime;

public record NoteResponseDto(
        Long noteId,
        String content,
        LocalDateTime createdAt
) {

    public static NoteResponseDto from(Note note) {
        return new NoteResponseDto(
                note.getId(),
                note.getContent(),
                note.getCreatedAt()
        );
    }
}
