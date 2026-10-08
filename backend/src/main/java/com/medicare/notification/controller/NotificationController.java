package com.medicare.notification.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.notification.dto.NotificationDto;
import com.medicare.notification.service.NotificationService;
import com.medicare.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "User alert notifications and in-app medicine reminder triggers")
@SecurityRequirement(name = "BearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get user notifications", description = "Retrieves all in-app notifications for the authenticated user")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUserNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count", description = "Retrieves count of unread notifications for badge display")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        long unread = notificationService.getUnreadCount(currentUser.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unread);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved", response));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Updates the notification read status to true")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        NotificationDto notification = notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }
}
