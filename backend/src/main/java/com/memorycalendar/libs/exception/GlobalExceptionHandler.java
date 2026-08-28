package com.memorycalendar.libs.exception;

import com.memorycalendar.libs.dto.ExceptionResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // CustomException 처리 - ErrorCode에 정의된 예외 반환
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ExceptionResponseDto> handleCustomException(
            CustomException e
    ) {
        ErrorCode errorCode = e.getErrorCode();

        log.warn(
                "CustomException 발생 - code: {}, message: {}",
                errorCode.getCode(),
                errorCode.getMessage()
        );

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ExceptionResponseDto.ofCode(
                        errorCode.getHttpStatus().value(),
                        errorCode.getMessage(),
                        errorCode.getCode()
                ));
    }

    // RuntimeException 처리 - 서버 내부 오류 반환
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ExceptionResponseDto> handleRuntimeException(
            RuntimeException e
    ) {
        log.error("RuntimeException 발생: ", e);

        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ExceptionResponseDto.ofCode(
                        errorCode.getHttpStatus().value(),
                        errorCode.getMessage(),
                        errorCode.getCode()
                ));
    }

    // @Valid, @Validated 관련 Validation 오류 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponseDto> handleValidationException(
            MethodArgumentNotValidException e
    ) {
        FieldError fieldError = e.getBindingResult().getFieldError();

        String message = fieldError != null
                ? fieldError.getDefaultMessage()
                : "잘못된 요청입니다.";

        String field = fieldError != null
                ? fieldError.getField()
                : null;

        return ResponseEntity
                .badRequest()
                .body(
                        ExceptionResponseDto.ofValidation(
                        HttpStatus.BAD_REQUEST.value(),
                        message,
                        field
                        )
                );
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ExceptionResponseDto> handleMethodValidationException(
            HandlerMethodValidationException e
    ) {
        log.warn("Method Validation 오류 발생: {}", e.getMessage());

        String message = "잘못된 요청입니다.";
        String field = null;

        if (!e.getParameterValidationResults().isEmpty()) {
            var result = e.getParameterValidationResults().getFirst();

            if (!result.getResolvableErrors().isEmpty()) {
                message = result.getResolvableErrors()
                        .getFirst()
                        .getDefaultMessage();
            }

            field = result.getMethodParameter()
                    .getParameterName();
        }

        return ResponseEntity
                .badRequest()
                .body(ExceptionResponseDto.ofValidation(
                        HttpStatus.BAD_REQUEST.value(),
                        message,
                        field
                ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ExceptionResponseDto> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e
    ) {
        ExceptionResponseDto response = new ExceptionResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "요청 형식이 올바르지 않습니다.",
                null,
                null
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}
