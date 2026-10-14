package com.memorycalendar.ai.service;

import com.memorycalendar.ai.client.GeminiClient;
import com.memorycalendar.ai.dto.AiClassificationResponseDto;
import com.memorycalendar.ai.dto.AiClassificationResultDto;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiClassificationService {

    private final NoteService noteService;
    private final GeminiClient geminiClient;

    public AiClassificationResultDto classify(
            Long userId,
            Long noteId
    ) {
        Note note = noteService.getNote(userId, noteId);

        AiClassificationResponseDto result =
                geminiClient.classify(note.getContent());

        return AiClassificationResultDto.of(
                note.getId(),
                result.items()
        );
    }
}