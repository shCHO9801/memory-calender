package com.memorycalendar.note.repository;

import com.memorycalendar.note.entity.Note;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Slice<Note> findAllByUserId(Long userId, Pageable pageable);

    Optional<Note> findByIdAndUserId(Long noteId, Long userId);
}
