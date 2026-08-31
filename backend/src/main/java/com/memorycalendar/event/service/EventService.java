package com.memorycalendar.event.service;

import com.memorycalendar.event.dto.CreateEventRequestDto;
import com.memorycalendar.event.dto.EventResponseDto;
import com.memorycalendar.event.entity.Event;
import com.memorycalendar.event.repository.EventRepository;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.repository.NoteRepository;
import com.memorycalendar.user.entity.User;
import com.memorycalendar.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.memorycalendar.libs.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;
    private final EventRepository eventRepository;

    @Transactional
    public Event createEvent(Long userId, CreateEventRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        Note note = null;

        if (requestDto.noteId() != null) {
            note = noteRepository.findByIdAndUserId(requestDto.noteId(), userId)
                    .orElseThrow(() -> new CustomException(NOTE_NOT_FOUND));
        }

        if (requestDto.endAt() != null
                && requestDto.endAt().isBefore(requestDto.startAt())) {
            throw new CustomException(INVALID_EVENT_TIME);
        }

        Event newEvent = Event.of(
                user,
                note,
                requestDto.title(),
                requestDto.description(),
                requestDto.startAt(),
                requestDto.endAt(),
                requestDto.allDay()
        );

        return eventRepository.save(newEvent);
    }

    public Event getEvent(Long userId, Long eventId) {

        return eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new CustomException(EVENT_NOT_FOUND));
    }

    public Slice<EventResponseDto> getEvents(
            Long userId,
            LocalDateTime startAt,
            LocalDateTime endAt,
            Pageable pageable
    ) {
        return eventRepository
                .findAllByUserIdAndStartAtBetween(
                        userId,
                        startAt,
                        endAt,
                        pageable
                )
                .map(EventResponseDto::from);
    }
}
