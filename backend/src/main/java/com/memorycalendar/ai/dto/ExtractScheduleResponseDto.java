package com.memorycalendar.ai.dto;

import java.util.List;

public record ExtractScheduleResponseDto(
        Long noteId,
        List<ScheduleCandidateDto> candidates
) {
    public static ExtractScheduleResponseDto of(
            Long noteId,
            List<ScheduleCandidateDto> candidates
    ) {
        return new ExtractScheduleResponseDto(noteId, candidates);
    }
}
