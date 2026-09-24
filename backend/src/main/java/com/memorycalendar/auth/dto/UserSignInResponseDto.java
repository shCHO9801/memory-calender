package com.memorycalendar.auth.dto;

import com.memorycalendar.auth.service.dto.UserSignInResult;
import com.memorycalendar.user.entity.User;

public record UserSignInResponseDto(
        Long userId,
        String email,
        String name,
        String accessToken,
        long expiresIn
) {
    public static UserSignInResponseDto from(UserSignInResult result) {
        User user = result.user();

        return new UserSignInResponseDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                result.accessToken(),
                result.expiresIn()
        );
    }
}
