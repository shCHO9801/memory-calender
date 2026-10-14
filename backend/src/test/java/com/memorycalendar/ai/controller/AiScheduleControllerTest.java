package com.memorycalendar.ai.controller;

import com.memorycalendar.ai.client.GeminiClient;
import com.memorycalendar.event.repository.EventRepository;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.repository.NoteRepository;
import com.memorycalendar.todo.repository.TodoRepository;
import com.memorycalendar.user.entity.User;
import com.memorycalendar.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static com.memorycalendar.libs.exception.ErrorCode.AI_API_ERROR;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "jwt.secret=test-jwt-secret-key-must-be-at-least-32-bytes-long",
        "jwt.access-token-expiration=3600"
})
@AutoConfigureMockMvc
class AiClassificationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    @Autowired
    NoteRepository noteRepository;

    @Autowired
    TodoRepository todoRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @MockitoBean
    GeminiClient geminiClient;

    private Note note;
    private String accessToken;

    @BeforeEach
    void setUp() throws Exception {

        todoRepository.deleteAll();
        eventRepository.deleteAll();
        noteRepository.deleteAll();
        userRepository.deleteAll();

        User user = userRepository.save(
                User.of(
                        "test@example.com",
                        passwordEncoder.encode("password123!"),
                        "테스트"
                )
        );

        note = noteRepository.save(
                Note.of(
                        user,
                        "내일 오후 3시에 병원 가고 금요일까지 보험 서류 보내기"
                )
        );

        accessToken = loginAndGetAccessToken();
    }

    @Test
    void aiClassificationFailsWhenApiCallFails() throws Exception {
        // given
        given(geminiClient.classify(anyString()))
                .willThrow(new CustomException(AI_API_ERROR));

        // when & then
        mockMvc.perform(
                        post("/api/notes/{noteId}/classification", note.getId())
                                .header(
                                        "Authorization",
                                        "Bearer " + accessToken
                                )
                )
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.status").value(502))
                .andExpect(jsonPath("$.code").value("AI_001"))
                .andExpect(jsonPath("$.message")
                        .value("AI 분류 중 오류가 발생했습니다."));
    }

    private String loginAndGetAccessToken() throws Exception {

        String response = mockMvc.perform(
                        post("/api/auth/signin")
                                .contentType("application/json")
                                .content("""
                                        {
                                          "email": "test@example.com",
                                          "password": "password123!"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        com.fasterxml.jackson.databind.ObjectMapper objectMapper =
                new com.fasterxml.jackson.databind.ObjectMapper();

        return objectMapper
                .readTree(response)
                .get("accessToken")
                .asText();
    }
}