package com.memorycalendar.auth.service.dto;

import com.memorycalendar.user.entity.User;

public record UserSignInResult(
        User user,
        String accessToken,
        long expiresIn
) {
    public static UserSignInResult of(
            User user,
            String accessToken,
            long expiresIn
    ) {
        return new UserSignInResult(
                user,
                accessToken,
                expiresIn
        );
    }
}
