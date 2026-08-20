package com.memorycalendar.auth.service;

import com.memorycalendar.auth.dto.UserSignInRequestDto;
import com.memorycalendar.auth.dto.UserSignupRequestDto;
import com.memorycalendar.auth.jwt.JwtProvider;
import com.memorycalendar.auth.service.dto.UserSignInResult;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.user.entity.User;
import com.memorycalendar.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.memorycalendar.libs.exception.ErrorCode.DUPLICATE_EMAIL;
import static com.memorycalendar.libs.exception.ErrorCode.INVALID_CREDENTIALS;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

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

    public UserSignInResult signin(UserSignInRequestDto requestDto) {
        User user = userRepository.findByEmail(requestDto.email())
                .orElseThrow(() -> new CustomException(INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(
                requestDto.password(),
                user.getPassword())
        ) {
            throw new CustomException(INVALID_CREDENTIALS);
        }

        String accessToken = jwtProvider.createAccessToken(user.getId());

        return UserSignInResult.of(user,
                accessToken,
                jwtProvider.getAccessTokenExpiration()
        );
    }
}
