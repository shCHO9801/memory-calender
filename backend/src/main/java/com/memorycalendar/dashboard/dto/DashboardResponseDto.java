package com.memorycalendar.dashboard.dto;

import com.memorycalendar.event.dto.EventResponseDto;
import com.memorycalendar.todo.dto.TodoResponseDto;

import java.util.List;

public record DashboardResponseDto(
        List<EventResponseDto> todayEvents,
        List<TodoResponseDto> activeTodos
) {
}
