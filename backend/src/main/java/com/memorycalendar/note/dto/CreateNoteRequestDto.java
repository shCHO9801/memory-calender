package com.memorycalendar.note.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateNoteRequestDto(
        @NotBlank(message = "메모 내용은 필수입니다.")
        String content
) {
}
