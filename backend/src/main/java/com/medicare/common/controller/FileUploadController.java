package com.medicare.common.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.common.service.S3StorageService;
import com.medicare.security.UserPrincipal;
import com.medicare.user.dto.UpdateProfileRequest;
import com.medicare.user.dto.UserProfileDto;
import com.medicare.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for Image and File Uploads to AWS S3
 */
@RestController
@RequestMapping("/api")
@Tag(name = "File Uploads", description = "AWS S3 file and profile image uploads")
public class FileUploadController {

    private final S3StorageService s3StorageService;
    private final UserService userService;

    public FileUploadController(S3StorageService s3StorageService, UserService userService) {
        this.s3StorageService = s3StorageService;
        this.userService = userService;
    }

    @PostMapping(value = "/upload/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image to AWS S3", description = "Uploads a profile picture or asset to the S3 bucket and returns the public URL")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = s3StorageService.uploadImage(file, "avatars");
        Map<String, String> result = new HashMap<>();
        result.put("url", url);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully to S3", result));
    }

    @PostMapping(value = "/users/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Upload and update user profile avatar", description = "Uploads an avatar image to AWS S3 and links it directly to current user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> uploadUserAvatar(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam("file") MultipartFile file) {

        String avatarUrl = s3StorageService.uploadImage(file, "avatars");

        UpdateProfileRequest updateRequest = new UpdateProfileRequest();
        updateRequest.setAvatarUrl(avatarUrl);

        UserProfileDto updatedProfile = userService.updateUserProfile(currentUser.getId(), updateRequest);
        return ResponseEntity.ok(ApiResponse.success("Profile avatar updated successfully", updatedProfile));
    }
}
