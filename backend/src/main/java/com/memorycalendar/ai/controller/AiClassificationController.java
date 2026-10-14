package com.memorycalendar.ai.controller;

import com.memorycalendar.ai.dto.AiClassificationResultDto;
import com.memorycalendar.ai.dto.ConfirmClassificationRequestDto;
import com.memorycalendar.ai.service.AiClassificationConfirmService;
import com.memorycalendar.ai.service.AiClassificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class AiClassificationController {

    private final AiClassificationService aiClassificationService;
    private final AiClassificationConfirmService aiClassificationConfirmService;

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

    @PostMapping("/{noteId}/classification/confirm")
    public ResponseEntity<Void> confirm(
            Authentication authentication,
            @PathVariable Long noteId,
            @Valid @RequestBody ConfirmClassificationRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        aiClassificationConfirmService.confirm(
                userId,
                noteId,
                requestDto
        );

        return ResponseEntity.noContent().build();
    }
}
