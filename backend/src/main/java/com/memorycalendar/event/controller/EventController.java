package com.memorycalendar.event.controller;

import com.memorycalendar.event.dto.CreateEventRequestDto;
import com.memorycalendar.event.dto.CreateEventResponseDto;
import com.memorycalendar.event.entity.Event;
import com.memorycalendar.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<CreateEventResponseDto> createEvent(
            Authentication authentication,
            @Valid  @RequestBody CreateEventRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Event createdEvent =
                eventService.createEvent(userId, requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CreateEventResponseDto.from(createdEvent));
    }
}
