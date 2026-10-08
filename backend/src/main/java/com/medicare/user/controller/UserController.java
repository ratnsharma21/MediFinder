package com.medicare.user.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.security.UserPrincipal;
import com.medicare.user.dto.*;
import com.medicare.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users & Profiles", description = "Current authenticated user profile and preference settings management")
@SecurityRequirement(name = "BearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user", description = "Retrieves user details, linked profile, and settings for the authenticated token owner")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDto user = userService.getCurrentUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User details retrieved successfully", user));
    }

    @GetMapping("/me/profile")
    @Operation(summary = "Get current user profile", description = "Retrieves the medical and contact profile of the authenticated user")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileDto profile = userService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PatchMapping("/me")
    @Operation(summary = "Update current user profile (PATCH /api/users/me)", description = "Updates personal contact, emergency contact, or address details")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfilePatch(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdateProfileRequest request) {
        UserProfileDto updated = userService.updateUserProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/me/profile")
    @Operation(summary = "Update user profile", description = "Updates personal contact, emergency contact, or address details")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdateProfileRequest request) {
        UserProfileDto updated = userService.updateUserProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/me/settings")
    @Operation(summary = "Get current user settings", description = "Retrieves notification, theme, and sound preferences")
    public ResponseEntity<ApiResponse<UserSettingsDto>> getUserSettings(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserSettingsDto settings = userService.getUserSettings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Settings retrieved successfully", settings));
    }

    @PatchMapping("/me/settings")
    @Operation(summary = "Update current user settings", description = "Updates user notification channels, dark mode, and sound options")
    public ResponseEntity<ApiResponse<UserSettingsDto>> updateUserSettings(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdateSettingsRequest request) {
        UserSettingsDto updated = userService.updateUserSettings(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", updated));
    }
}
