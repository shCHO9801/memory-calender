package com.memorycalendar.event.repository;

import com.memorycalendar.event.entity.Event;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByIdAndUserId(Long eventId, Long userId);

    Slice<Event> findAllByUserIdAndStartAtBetween(
            Long userId,
            LocalDateTime startAt,
            LocalDateTime endAt,
            Pageable pageable
    );

    List<Event> findAllByUserIdAndStartAtBetweenOrderByStartAtAsc(
            Long userId,
            LocalDateTime startAt,
            LocalDateTime endAt
    );

    @Query("""
            SELECT e
            FROM Event e
            WHERE e.user.id = :userId
              AND e.startAt < :rangeEnd
              AND (
                    (e.endAt IS NULL AND e.startAt >= :rangeStart)
                    OR
                    (e.endAt IS NOT NULL AND e.endAt >= :rangeStart)
                  )
            ORDER BY e.startAt ASC
            """)
    List<Event> findCalendarEvents(
            @Param("userId") Long userId,
            @Param("rangeStart") LocalDateTime rangeStart,
            @Param("rangeEnd") LocalDateTime rangeEnd
    );
}
