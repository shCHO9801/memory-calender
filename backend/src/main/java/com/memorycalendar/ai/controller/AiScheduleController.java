package com.memorycalendar.ai.controller;

import com.memorycalendar.ai.dto.ExtractScheduleResponseDto;
import com.memorycalendar.ai.service.AiScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class AiScheduleController {

    private final AiScheduleService aiScheduleService;

    @PostMapping("/{noteId}/schedule-extraction")
    public ResponseEntity<ExtractScheduleResponseDto> extractSchedule(
            Authentication authentication,
            @PathVariable Long noteId
    ) {

        Long userId = Long.valueOf(authentication.getName());

        ExtractScheduleResponseDto response = aiScheduleService.extractSchedule(userId, noteId);

        return ResponseEntity.ok(response);
    }
}
