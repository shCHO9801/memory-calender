package com.memorycalendar.libs.dto;

import org.springframework.data.domain.Slice;

import java.util.List;

public record SliceResponseDto<T>(
        List<T> content,
        int page,
        int size,
        boolean hasNext
) {

    public static <T> SliceResponseDto<T> from(Slice<T> slice) {
        return new SliceResponseDto<>(
                slice.getContent(),
                slice.getNumber(),
                slice.getSize(),
                slice.hasNext()
        );
    }
}
