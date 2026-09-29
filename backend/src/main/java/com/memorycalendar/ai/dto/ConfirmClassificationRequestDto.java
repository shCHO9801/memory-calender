package com.memorycalendar.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ConfirmClassificationRequestDto(
        @NotEmpty
        List<@Valid ConfirmClassificationItemDto> items
) {
}
