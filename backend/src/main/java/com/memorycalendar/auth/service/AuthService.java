package com.memorycalendar.auth.service;

import com.memorycalendar.auth.dto.UserSignupRequestDto;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.user.entity.User;
import com.memorycalendar.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.memorycalendar.libs.exception.ErrorCode.DUPLICATE_EMAIL;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User signup(UserSignupRequestDto requestDto) {

        String email = requestDto.email();
        String password = requestDto.password();
        String name = requestDto.name();

        if (userRepository.existsByEmail(email)) {
            throw new CustomException(DUPLICATE_EMAIL);
        }

        String encodedPassword = passwordEncoder.encode(password);

        User signUpUser = User.of(email, encodedPassword, name);

        return userRepository.save(signUpUser);
    }

    public boolean checkEmail(String email) {
        return !userRepository.existsByEmail(email);
    }
}
