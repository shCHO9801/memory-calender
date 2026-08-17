package com.memorycalendar.auth.dto;

import com.memorycalendar.user.entity.User;

import java.time.LocalDateTime;

public record UserSignupResponseDto(
        Long userId,
        String email,
        String name,
        LocalDateTime createdAt
) {
    public static UserSignupResponseDto from(User user) {
        return new UserSignupResponseDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt()
        );
    }
}
