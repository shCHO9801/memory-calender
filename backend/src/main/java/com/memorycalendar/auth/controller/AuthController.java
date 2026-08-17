package com.memorycalendar.auth.controller;

import com.memorycalendar.auth.dto.EmailCheckResponseDto;
import com.memorycalendar.auth.dto.UserSignupRequestDto;
import com.memorycalendar.auth.dto.UserSignupResponseDto;
import com.memorycalendar.auth.service.AuthService;
import com.memorycalendar.user.entity.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponseDto> signup(
            @Valid @RequestBody UserSignupRequestDto userSignupRequestDto
    ) {
        User signUpUser = authService.signup(userSignupRequestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserSignupResponseDto.from(signUpUser));
    }

    @GetMapping("/check-email")
    public ResponseEntity<EmailCheckResponseDto> checkEmail(
            @RequestParam
            @NotBlank
            @Email
            String email
    ) {
        boolean result = authService.checkEmail(email);

        return ResponseEntity.ok(
                new EmailCheckResponseDto(result)
        );
    }
}
