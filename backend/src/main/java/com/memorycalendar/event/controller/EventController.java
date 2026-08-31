package com.memorycalendar.event.controller;

import com.memorycalendar.event.dto.CreateEventRequestDto;
import com.memorycalendar.event.dto.CreateEventResponseDto;
import com.memorycalendar.event.dto.EventResponseDto;
import com.memorycalendar.event.entity.Event;
import com.memorycalendar.event.service.EventService;
import com.memorycalendar.libs.dto.SliceResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<CreateEventResponseDto> createEvent(
            Authentication authentication,
            @Valid @RequestBody CreateEventRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Event createdEvent =
                eventService.createEvent(userId, requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CreateEventResponseDto.from(createdEvent));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponseDto> getEvent(
            Authentication authentication,
            @PathVariable Long eventId
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Event event = eventService.getEvent(userId, eventId);

        return ResponseEntity.ok(EventResponseDto.from(event));
    }

    @GetMapping
    public ResponseEntity<SliceResponseDto<EventResponseDto>> getEvents(
            Authentication authentication,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startAt,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endAt,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Order.asc("createdAt"),
                        Sort.Order.asc("id")
                )
        );

        Slice<EventResponseDto> events =
                eventService.getEvents(userId, startAt, endAt, pageable);

        return ResponseEntity.ok(SliceResponseDto.from(events));
    }
}
