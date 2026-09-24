package com.memorycalendar.ai.dto;

import java.util.List;

public record AiScheduleExtractionResult(
        List<ScheduleCandidateDto> candidates
) {
}
