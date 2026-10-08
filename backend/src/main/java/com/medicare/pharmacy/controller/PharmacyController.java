package com.medicare.pharmacy.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.common.response.PagedResponse;
import com.medicare.pharmacy.dto.PharmacyDto;
import com.medicare.pharmacy.dto.PharmacySearchFilter;
import com.medicare.pharmacy.service.PharmacyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")
@Tag(name = "Pharmacies & Locator", description = "Locate nearby licensed pharmacies, search by postal code or city, and retrieve contact details and operating hours")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    public PharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    @GetMapping
    @Operation(summary = "Search and list pharmacies", description = "Retrieves paginated pharmacy stores filtered by name, address, city, postal code, or 24/7 operating status")
    public ResponseEntity<ApiResponse<PagedResponse<PharmacyDto>>> getPharmacies(
            @Parameter(description = "Search query for pharmacy name or address")
            @RequestParam(required = false) String query,
            @Parameter(description = "City name (e.g. Bengaluru, Gurugram)")
            @RequestParam(required = false) String city,
            @Parameter(description = "PIN / Postal code")
            @RequestParam(required = false) String postalCode,
            @Parameter(description = "Filter by 24x7 emergency open status")
            @RequestParam(required = false) Boolean is24Hours,
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size) {

        PharmacySearchFilter filter = new PharmacySearchFilter();
        filter.setQuery(query);
        filter.setCity(city);
        filter.setPostalCode(postalCode);
        filter.setIs24Hours(is24Hours);
        filter.setPage(page);
        filter.setSize(size);

        PagedResponse<PharmacyDto> results = pharmacyService.searchPharmacies(filter);
        return ResponseEntity.ok(ApiResponse.success("Pharmacies retrieved successfully", results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get pharmacy details by ID", description = "Retrieves detailed contact information, address, operating hours, coordinates, license info, and customer rating")
    public ResponseEntity<ApiResponse<PharmacyDto>> getPharmacyById(@PathVariable Long id) {
        PharmacyDto pharmacy = pharmacyService.getPharmacyById(id);
        return ResponseEntity.ok(ApiResponse.success("Pharmacy details retrieved successfully", pharmacy));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Find nearby pharmacies by GPS coordinates", description = "Calculates proximity distance using Haversine algorithm and returns pharmacies within the specified radius in kilometers")
    public ResponseEntity<ApiResponse<List<PharmacyDto>>> getNearbyPharmacies(
            @Parameter(description = "User GPS latitude (e.g. 12.9716)", required = true)
            @RequestParam Double latitude,
            @Parameter(description = "User GPS longitude (e.g. 77.5946)", required = true)
            @RequestParam Double longitude,
            @Parameter(description = "Radius in kilometers (defaults to 10.0 km)")
            @RequestParam(defaultValue = "10.0") Double radiusInKm) {

        List<PharmacyDto> nearby = pharmacyService.getNearbyPharmacies(latitude, longitude, radiusInKm);
        return ResponseEntity.ok(ApiResponse.success("Nearby pharmacies located successfully", nearby));
    }
}
