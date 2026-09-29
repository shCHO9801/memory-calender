package com.memorycalendar.ai.service;

import com.memorycalendar.ai.dto.CandidateType;
import com.memorycalendar.ai.dto.ConfirmClassificationItemDto;
import com.memorycalendar.ai.dto.ConfirmClassificationRequestDto;
import com.memorycalendar.event.dto.CreateEventRequestDto;
import com.memorycalendar.event.service.EventService;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.service.NoteService;
import com.memorycalendar.todo.dto.CreateTodoRequestDto;
import com.memorycalendar.todo.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.memorycalendar.libs.exception.ErrorCode.AI_CONFIRM_INVALID;

@Service
@RequiredArgsConstructor
public class AiClassificationConfirmService {

    private final NoteService noteService;
    private final EventService eventService;
    private final TodoService todoService;

    @Transactional
    public void confirm(
            Long userId,
            Long noteId,
            ConfirmClassificationRequestDto requestDto
    ) {
        Note note = noteService.getNote(userId, noteId);

        for (ConfirmClassificationItemDto item : requestDto.items()) {
            validate(item);

            if (item.type() == CandidateType.EVENT) {
                CreateEventRequestDto eventRequest =
                        new CreateEventRequestDto(
                                note.getId(),
                                item.content(),
                                null,
                                item.startAt(),
                                item.endAt(),
                                false,
                                item.location()
                        );

                eventService.createEvent(userId, eventRequest);
            }

            if (item.type() == CandidateType.TODO) {
                CreateTodoRequestDto todoRequest =
                        new CreateTodoRequestDto(
                                note.getId(),
                                item.content(),
                                item.dueAt()
                        );

                todoService.createTodo(userId, todoRequest);
            }
        }
    }

    private void validate(ConfirmClassificationItemDto item) {
        if (item.type() == CandidateType.EVENT) {
            if (item.startAt() == null) {
                throw new CustomException(AI_CONFIRM_INVALID);
            }

            if (item.dueAt() != null) {
                throw new CustomException(AI_CONFIRM_INVALID);
            }
        }

        if (item.type() == CandidateType.TODO) {
            if (item.startAt() != null || item.endAt() != null) {
                throw new CustomException(AI_CONFIRM_INVALID);
            }
        }
    }
}