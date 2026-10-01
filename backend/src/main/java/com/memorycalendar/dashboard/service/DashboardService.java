package com.memorycalendar.dashboard.service;

import com.memorycalendar.dashboard.dto.DashboardResponseDto;
import com.memorycalendar.event.dto.EventResponseDto;
import com.memorycalendar.event.repository.EventRepository;
import com.memorycalendar.todo.dto.TodoResponseDto;
import com.memorycalendar.todo.entity.TodoStatus;
import com.memorycalendar.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EventRepository eventRepository;
    private final TodoRepository todoRepository;

    public DashboardResponseDto getDashboard(Long userId) {

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();

        List<EventResponseDto> todayEvents =
                eventRepository
                        .findAllByUserIdAndStartAtBetweenOrderByStartAtAsc(
                                userId,
                                todayStart,
                                tomorrowStart
                        ).stream()
                        .map(EventResponseDto::from)
                        .toList();

        List<TodoResponseDto> activeTodos =
                todoRepository.findAllByUserIdAndStatusNotOrderByDueAtAsc(
                                userId,
                                TodoStatus.DONE
                        ).stream()
                        .map(TodoResponseDto::from)
                        .toList();


        return new DashboardResponseDto(
                todayEvents,
                activeTodos
        );
    }
}
