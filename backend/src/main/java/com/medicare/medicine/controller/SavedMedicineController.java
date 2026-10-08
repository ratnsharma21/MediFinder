package com.medicare.medicine.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.medicine.dto.SavedMedicineDto;
import com.medicare.medicine.service.SavedMedicineService;
import com.medicare.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-medicines")
@Tag(name = "Saved Medicines", description = "Authenticated user medicine watchlist and bookmarks")
@SecurityRequirement(name = "BearerAuth")
public class SavedMedicineController {

    private final SavedMedicineService savedMedicineService;

    public SavedMedicineController(SavedMedicineService savedMedicineService) {
        this.savedMedicineService = savedMedicineService;
    }

    @GetMapping
    @Operation(summary = "Get user saved medicines", description = "Retrieves all bookmarked medicines for the authenticated user")
    public ResponseEntity<ApiResponse<List<SavedMedicineDto>>> getSavedMedicines(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<SavedMedicineDto> saved = savedMedicineService.getSavedMedicines(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Saved medicines retrieved successfully", saved));
    }

    @PostMapping("/{medicineId}")
    @Operation(summary = "Bookmark / save a medicine", description = "Adds a medicine to the user's saved list with optional personal notes")
    public ResponseEntity<ApiResponse<SavedMedicineDto>> saveMedicine(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long medicineId,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = (body != null) ? body.get("notes") : null;
        SavedMedicineDto saved = savedMedicineService.saveMedicine(currentUser.getId(), medicineId, notes);
        return new ResponseEntity<>(ApiResponse.success("Medicine saved successfully", saved), HttpStatus.CREATED);
    }

    @DeleteMapping("/{medicineId}")
    @Operation(summary = "Remove medicine from saved list", description = "Deletes a medicine from the authenticated user's bookmarks")
    public ResponseEntity<ApiResponse<String>> removeSavedMedicine(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long medicineId) {
        savedMedicineService.removeSavedMedicine(currentUser.getId(), medicineId);
        return ResponseEntity.ok(ApiResponse.success("Medicine removed from saved list", null));
    }
}
