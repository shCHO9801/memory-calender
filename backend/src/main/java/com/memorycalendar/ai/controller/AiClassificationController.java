package com.memorycalendar.ai.controller;

import com.memorycalendar.ai.dto.AiClassificationResultDto;
import com.memorycalendar.ai.service.AiClassificationService;
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
public class AiClassificationController {

    private final AiClassificationService aiClassificationService;

    @PostMapping("/{noteId}/classification")
    public ResponseEntity<AiClassificationResultDto> classify(
            Authentication authentication,
            @PathVariable Long noteId
    ) {
        Long userId = Long.valueOf(authentication.getName());

        AiClassificationResultDto response =
                aiClassificationService.classify(userId, noteId);

        return ResponseEntity.ok(response);
    }
}
