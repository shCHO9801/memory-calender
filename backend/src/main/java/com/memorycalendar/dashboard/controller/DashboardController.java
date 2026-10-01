package com.memorycalendar.dashboard.controller;

import com.memorycalendar.dashboard.dto.DashboardResponseDto;
import com.memorycalendar.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponseDto> getDashboard(
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());

        DashboardResponseDto result =
                dashboardService.getDashboard(userId);

        return ResponseEntity.ok(result);
    }
}
