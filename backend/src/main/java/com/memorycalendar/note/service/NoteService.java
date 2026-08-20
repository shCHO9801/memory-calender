package com.memorycalendar.note.service;

import com.memorycalendar.libs.dto.SliceResponseDto;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.note.dto.CreateNoteRequestDto;
import com.memorycalendar.note.dto.NoteResponseDto;
import com.memorycalendar.note.dto.UpdateNoteRequestDto;
import com.memorycalendar.note.entity.Note;
import com.memorycalendar.note.repository.NoteRepository;
import com.memorycalendar.user.entity.User;
import com.memorycalendar.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.memorycalendar.libs.exception.ErrorCode.NOTE_NOT_FOUND;
import static com.memorycalendar.libs.exception.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Transactional
    public Note createNote(Long userId, CreateNoteRequestDto requestDto) {

        User user = findUserById(userId);

        Note note = Note.of(
                user,
                requestDto.content()
        );

        return noteRepository.save(note);
    }

    public SliceResponseDto<NoteResponseDto> getNotes(
            Long userId,
            Pageable pageable
    ) {

        Slice<NoteResponseDto> notes = noteRepository
                .findAllByUserId(userId, pageable)
                .map(NoteResponseDto::from);

        return SliceResponseDto.from(notes);
    }

    public Note getNote(Long userId, Long noteId) {

        return noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new CustomException(NOTE_NOT_FOUND));
    }

    @Transactional
    public Note updateNote(Long userId, Long noteId, UpdateNoteRequestDto requestDto) {

        Note note = getNote(userId, noteId);

        note.updateContent(requestDto.content());

        return note;
    }

    @Transactional
    public void deleteNote(Long userId, Long noteId) {
        Note note = getNote(userId, noteId);

        noteRepository.delete(note);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));
    }
}
