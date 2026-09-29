package com.memorycalendar.ai.dto;

import java.util.List;

public record AiClassificationResultDto(
        Long noteId,
        List<AiClassificationItemDto> items
) {
    public static AiClassificationResultDto of(
            Long noteId,
            List<AiClassificationItemDto> items
    ) {
        return new AiClassificationResultDto(
                noteId,
                items
        );
    }
}