package com.memorycalendar.event.repository;

import com.memorycalendar.event.entity.Event;
import com.memorycalendar.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByIdAndUserId(Long eventId, Long userId);

    List<Event> user(User user);

    Slice<Event> findAllByUserIdAndStartAtBetween(Long userId, LocalDateTime startAt, LocalDateTime endAt, Pageable pageable);
}
