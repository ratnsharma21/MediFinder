package com.medicare.medicine.controller;

import com.medicare.common.response.ApiResponse;
import com.medicare.common.response.PagedResponse;
import com.medicare.medicine.dto.MedicineDetailDto;
import com.medicare.medicine.dto.MedicineDto;
import com.medicare.medicine.dto.MedicineSearchFilter;
import com.medicare.medicine.dto.RetailerOfferDto;
import com.medicare.medicine.service.MedicineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@Tag(name = "Medicines & Catalogue", description = "Medicine search, categorisation, details, manufacturer metadata, and verified retailer offers")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    @Operation(summary = "Search and list medicines", description = "Retrieves paginated medicine list with optional full-text search query, category filter, prescription requirement filter, price range, and sorting")
    public ResponseEntity<ApiResponse<PagedResponse<MedicineDto>>> getMedicines(
            @Parameter(description = "Search query matching medicine name, generic name, brand, or composition")
            @RequestParam(required = false) String query,
            @Parameter(description = "Filter by category (e.g. Antibiotic, Analgesic, Antidiabetic)")
            @RequestParam(required = false) String category,
            @Parameter(description = "Filter by prescription requirement")
            @RequestParam(required = false) Boolean requiresPrescription,
            @Parameter(description = "Minimum MRP filter")
            @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum MRP filter")
            @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field (name or price)")
            @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setQuery(query);
        filter.setCategory(category);
        filter.setRequiresPrescription(requiresPrescription);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setPage(page);
        filter.setSize(size);
        filter.setSortBy(sortBy);
        filter.setSortDirection(sortDirection);

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);
        return ResponseEntity.ok(ApiResponse.success("Medicines retrieved successfully", results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get medicine details by ID", description = "Retrieves comprehensive information including dosage form, strength, pack size, composition, indications, precautions, manufacturer info, and online retailer pricing")
    public ResponseEntity<ApiResponse<MedicineDetailDto>> getMedicineById(@PathVariable Long id) {
        MedicineDetailDto medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine details retrieved successfully", medicine));
    }

    @GetMapping("/{id}/offers")
    @Operation(summary = "Get online retailer offers for a medicine", description = "Retrieves current price comparison quotes from verified online medical stores (e.g. Tata 1mg, PharmEasy, Netmeds)")
    public ResponseEntity<ApiResponse<List<RetailerOfferDto>>> getMedicineOffers(@PathVariable Long id) {
        List<RetailerOfferDto> offers = medicineService.getMedicineOffers(id);
        return ResponseEntity.ok(ApiResponse.success("Offers retrieved successfully", offers));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all available medicine categories", description = "Retrieves the list of distinct medicine categories for frontend filter dropdowns")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = medicineService.getCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
}
