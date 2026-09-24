package com.memorycalendar.note.controller;

import com.memorycalendar.libs.dto.SliceResponseDto;
import com.memorycalendar.note.dto.CreateNoteRequestDto;
import com.memorycalendar.note.dto.CreateNoteResponseDto;
import com.memorycalendar.note.dto.NoteResponseDto;
import com.memorycalendar.note.dto.UpdateNoteRequestDto;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<CreateNoteResponseDto> createNote(
            Authentication authentication,
            @Valid @RequestBody CreateNoteRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Note newNote = noteService.createNote(userId, requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CreateNoteResponseDto.from(newNote));
    }

    @GetMapping
    public ResponseEntity<SliceResponseDto<NoteResponseDto>> getNotes(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                )
        );

        SliceResponseDto<NoteResponseDto> response =
                noteService.getNotes(userId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponseDto> getNote(
            Authentication authentication,
            @PathVariable Long noteId
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Note note = noteService.getNote(userId, noteId);

        return ResponseEntity.ok(NoteResponseDto.from(note));
    }

    @PatchMapping("/{noteId}")
    public ResponseEntity<NoteResponseDto> updateNote(
            Authentication authentication,
            @PathVariable Long noteId,
            @Valid @RequestBody UpdateNoteRequestDto requestDto
    ) {
        Long userId = Long.valueOf(authentication.getName());

        Note note = noteService.updateNote(userId, noteId, requestDto);

        return ResponseEntity.ok(NoteResponseDto.from(note));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            Authentication authentication,
            @PathVariable Long noteId
    ) {
        Long userId = Long.valueOf(authentication.getName());

        noteService.deleteNote(userId, noteId);

        return ResponseEntity.noContent().build();
    }
}
