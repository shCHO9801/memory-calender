package com.memorycalendar.libs.exception;

import com.memorycalendar.libs.dto.ExceptionResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 비즈니스 로직에서 발생한 CustomException 처리
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

    // 처리되지 않은 RuntimeException을 서버 내부 오류로 처리
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

    // @RequestBody DTO의 @Valid 검증 실패 처리
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

    // Controller 메서드 파라미터의 Validation 실패 처리
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

    // @RequestBody JSON 역직렬화 및 요청 형식 오류 처리
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

    // 필수 @RequestParam 누락 오류 처리
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ExceptionResponseDto> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e
    ) {
        ExceptionResponseDto response = new ExceptionResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "필수 요청 파라미터가 누락되었습니다.",
                null,
                e.getParameterName()
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    // @RequestParam 타입 변환 실패 오류 처리
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ExceptionResponseDto> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException e
    ) {
        ExceptionResponseDto response = new ExceptionResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "요청 파라미터 형식이 올바르지 않습니다.",
                null,
                e.getName()
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}
