package com.medicare.reminder.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.reminder.dto.ReminderRequest;
import com.medicare.reminder.dto.ReminderResponse;
import com.medicare.reminder.service.ReminderService;
import com.medicare.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing medication reminder schedules and dosage timings.
 */
@RestController
@RequestMapping("/api/reminders")
@Tag(name = "Medicine Reminders", description = "Personal medication scheduling, dosage timing, and active reminder alarms")
@SecurityRequirement(name = "BearerAuth")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    @Operation(summary = "Get user reminders", description = "Retrieves all active and historical medication reminder schedules created by the authenticated user")
    public ResponseEntity<ApiResponse<List<ReminderResponse>>> getUserReminders(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ReminderResponse> reminders = reminderService.getUserReminders(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Reminders retrieved successfully", reminders));
    }

    @PostMapping
    @Operation(summary = "Create medicine reminder", description = "Sets up a new medication dosage schedule with timing, frequency, and start/end dates")
    public ResponseEntity<ApiResponse<ReminderResponse>> createReminder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReminderRequest request) {
        ReminderResponse created = reminderService.createReminder(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Reminder created successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reminder by ID", description = "Retrieves a specific medication reminder belonging to the authenticated user")
    public ResponseEntity<ApiResponse<ReminderResponse>> getReminderById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        ReminderResponse reminder = reminderService.getReminderById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Reminder retrieved successfully", reminder));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Partially update reminder", description = "Updates specific reminder attributes such as active state, dosage, or reminder time")
    public ResponseEntity<ApiResponse<ReminderResponse>> patchReminder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestBody ReminderRequest request) {
        ReminderResponse updated = reminderService.patchReminder(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Reminder updated successfully", updated));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update reminder", description = "Replaces or modifies reminder schedule settings")
    public ResponseEntity<ApiResponse<ReminderResponse>> updateReminder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ReminderRequest request) {
        ReminderResponse updated = reminderService.updateReminder(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Reminder updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete reminder", description = "Permanently removes a medication reminder schedule for the current user")
    public ResponseEntity<ApiResponse<String>> deleteReminder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        reminderService.deleteReminder(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Reminder deleted successfully", null));
    }
}
