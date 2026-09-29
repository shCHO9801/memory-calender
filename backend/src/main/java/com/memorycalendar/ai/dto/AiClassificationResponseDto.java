package com.memorycalendar.ai.dto;

import java.util.List;

public record AiClassificationResponseDto(
        List<AiClassificationItemDto> items
) {
}