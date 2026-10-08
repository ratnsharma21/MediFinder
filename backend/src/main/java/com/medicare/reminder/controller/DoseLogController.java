package com.medicare.reminder.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.reminder.dto.DoseLogRequest;
import com.medicare.reminder.dto.DoseLogResponse;
import com.medicare.reminder.dto.UpdateDoseStatusRequest;
import com.medicare.reminder.service.DoseLogService;
import com.medicare.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dose-logs")
@Tag(name = "Dose Tracking & Adherence", description = "Record and verify medication intake (TAKEN, MISSED, SKIPPED) and track adherence history")
@SecurityRequirement(name = "BearerAuth")
public class DoseLogController {

    private final DoseLogService doseLogService;

    public DoseLogController(DoseLogService doseLogService) {
        this.doseLogService = doseLogService;
    }

    @GetMapping
    @Operation(summary = "Get user dose history", description = "Retrieves recorded medication dose logs and adherence status for the authenticated user")
    public ResponseEntity<ApiResponse<List<DoseLogResponse>>> getUserDoseLogs(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(description = "Filter by specific reminder ID")
            @RequestParam(required = false) Long reminderId) {

        List<DoseLogResponse> logs;
        if (reminderId != null) {
            logs = doseLogService.getReminderDoseLogs(reminderId, currentUser.getId());
        } else {
            logs = doseLogService.getUserDoseLogs(currentUser.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Dose logs retrieved successfully", logs));
    }

    @PostMapping
    @Operation(summary = "Record dose log entry", description = "Logs an instance of medication intake or records a missed/skipped dose")
    public ResponseEntity<ApiResponse<DoseLogResponse>> logDose(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DoseLogRequest request) {
        DoseLogResponse logged = doseLogService.logDose(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Dose logged successfully", logged), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update dose status", description = "Updates status of a dose log entry (TAKEN, MISSED, SKIPPED) or records personal notes")
    public ResponseEntity<ApiResponse<DoseLogResponse>> updateDoseStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UpdateDoseStatusRequest request) {
        DoseLogResponse updated = doseLogService.updateDoseStatus(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Dose status updated successfully", updated));
    }
}
