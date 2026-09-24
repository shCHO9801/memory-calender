package com.memorycalendar.ai.service;

import com.memorycalendar.ai.client.GeminiClient;
import com.memorycalendar.ai.dto.AiScheduleExtractionResult;
import com.memorycalendar.ai.dto.ExtractScheduleResponseDto;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiScheduleService {

    private final NoteService noteService;
    private final GeminiClient geminiClient;

    public ExtractScheduleResponseDto extractSchedule(
            Long userId, Long noteId
    ) {
        Note note = noteService.getNote(userId, noteId);

        AiScheduleExtractionResult result =
                geminiClient.extractSchedule(note.getContent());

        return ExtractScheduleResponseDto.of(
                note.getId(),
                result.candidates()
        );
    }
}
