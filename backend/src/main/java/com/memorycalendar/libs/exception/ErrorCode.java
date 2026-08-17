package com.memorycalendar.libs.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    /* 400 BAD_REQUEST */

    /* 401 UNAUTHORIZED */

    /* 403 FORBIDDEN */

    /* 404 NOT_FOUND */
    USER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "USER_001",
            "유저를 찾을 수 없습니다."
    ),

    /* 409 Conflict*/
    DUPLICATE_EMAIL(
            HttpStatus.CONFLICT,
            "USER_002",
            "이미 사용 중인 이메일입니다."
    ),

    /* 500 INTERNAL_SERVER_ERROR */
    INTERNAL_SERVER_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "COMMON_500",
            "서버 오류가 발생했습니다."
    );

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
