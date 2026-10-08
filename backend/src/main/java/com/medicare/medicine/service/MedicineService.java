package com.medicare.medicine.service;

import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.common.response.PagedResponse;
import com.medicare.medicine.dto.*;
import com.medicare.medicine.entity.Manufacturer;
import com.medicare.medicine.entity.Medicine;
import com.medicare.medicine.entity.RetailerOffer;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.medicine.repository.RetailerOfferRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final RetailerOfferRepository retailerOfferRepository;

    public MedicineService(MedicineRepository medicineRepository,
                           RetailerOfferRepository retailerOfferRepository) {
        this.medicineRepository = medicineRepository;
        this.retailerOfferRepository = retailerOfferRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<MedicineDto> searchMedicines(MedicineSearchFilter filter) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(filter.getSortDirection()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = "price".equalsIgnoreCase(filter.getSortBy()) || "mrp".equalsIgnoreCase(filter.getSortBy()) ? "mrp" : "name";
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(direction, sortField));

        String query = (filter.getQuery() != null && !filter.getQuery().trim().isEmpty()) ? filter.getQuery().trim() : null;
        String category = (filter.getCategory() != null && !filter.getCategory().trim().isEmpty()) ? filter.getCategory().trim() : null;
        String dosageForm = (filter.getDosageForm() != null && !filter.getDosageForm().trim().isEmpty()) ? filter.getDosageForm().trim() : null;

        Page<Medicine> page = medicineRepository.searchMedicinesWithFilters(
                query,
                category,
                dosageForm,
                filter.getRequiresPrescription(),
                filter.getMinPrice(),
                filter.getMaxPrice(),
                pageable
        );

        List<MedicineDto> dtos = page.getContent().stream()
                .map(this::mapToMedicineDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public MedicineDetailDto getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));

        return mapToMedicineDetailDto(medicine);
    }

    @Transactional(readOnly = true)
    public List<RetailerOfferDto> getMedicineOffers(Long medicineId) {
        if (!medicineRepository.existsById(medicineId)) {
            throw new ResourceNotFoundException("Medicine", "id", medicineId);
        }

        List<RetailerOffer> offers = retailerOfferRepository.findByMedicineIdOrderBySellingPriceAsc(medicineId);
        return offers.stream().map(this::mapToRetailerOfferDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return medicineRepository.findDistinctCategories();
    }

    @Transactional(readOnly = true)
    public List<String> getDosageForms() {
        return medicineRepository.findDistinctDosageForms();
    }

    @Transactional(readOnly = true)
    public List<MedicineDto> getFeaturedMedicines() {
        List<Medicine> featured = medicineRepository.findTop8ByAvailableTrueOrderByCreatedAtDesc();
        return featured.stream().map(this::mapToMedicineDto).collect(Collectors.toList());
    }

    public MedicineDto mapToMedicineDto(Medicine medicine) {
        if (medicine == null) return null;

        MedicineDto dto = new MedicineDto();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setGenericName(medicine.getGenericName());
        dto.setBrandName(medicine.getBrandName());
        dto.setCategory(medicine.getCategory());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());
        dto.setPackSize(medicine.getPackSize());
        dto.setRequiresPrescription(medicine.isRequiresPrescription());
        dto.setMrp(medicine.getMrp());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setAvailable(medicine.isAvailable());

        if (medicine.getManufacturer() != null) {
            dto.setManufacturerName(medicine.getManufacturer().getName());
        }

        if (medicine.getOffers() != null && !medicine.getOffers().isEmpty()) {
            BigDecimal min = medicine.getOffers().stream()
                    .map(RetailerOffer::getSellingPrice)
                    .min(BigDecimal::compareTo)
                    .orElse(medicine.getMrp());
            dto.setLowestPrice(min);
        } else {
            dto.setLowestPrice(medicine.getMrp());
        }

        return dto;
    }

    public MedicineDetailDto mapToMedicineDetailDto(Medicine medicine) {
        if (medicine == null) return null;

        MedicineDetailDto dto = new MedicineDetailDto();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setGenericName(medicine.getGenericName());
        dto.setBrandName(medicine.getBrandName());
        dto.setCategory(medicine.getCategory());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());
        dto.setPackSize(medicine.getPackSize());
        dto.setComposition(medicine.getComposition());
        dto.setIndications(medicine.getIndications());
        dto.setSideEffects(medicine.getSideEffects());
        dto.setPrecautions(medicine.getPrecautions());
        dto.setStorageInstructions(medicine.getStorageInstructions());
        dto.setRequiresPrescription(medicine.isRequiresPrescription());
        dto.setMrp(medicine.getMrp());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setAvailable(medicine.isAvailable());
        dto.setUpdatedAt(medicine.getUpdatedAt());

        if (medicine.getManufacturer() != null) {
            dto.setManufacturer(mapToManufacturerDto(medicine.getManufacturer()));
        }

        if (medicine.getOffers() != null) {
            dto.setOffers(medicine.getOffers().stream().map(this::mapToRetailerOfferDto).collect(Collectors.toList()));
        }

        return dto;
    }

    public ManufacturerDto mapToManufacturerDto(Manufacturer m) {
        if (m == null) return null;
        return new ManufacturerDto(
                m.getId(),
                m.getName(),
                m.getCountry(),
                m.getWebsite(),
                m.getContactEmail(),
                m.isVerified()
        );
    }

    public RetailerOfferDto mapToRetailerOfferDto(RetailerOffer offer) {
        if (offer == null) return null;
        return new RetailerOfferDto(
                offer.getId(),
                offer.getRetailer() != null ? offer.getRetailer().getId() : null,
                offer.getRetailer() != null ? offer.getRetailer().getName() : "Unknown Retailer",
                offer.getRetailer() != null ? offer.getRetailer().getLogoUrl() : null,
                offer.getRetailer() != null ? offer.getRetailer().getRating() : BigDecimal.valueOf(4.50),
                offer.getSellingPrice(),
                offer.getDiscountPercent(),
                offer.getProductUrl(),
                offer.isInStock(),
                offer.getDeliveryEstimateDays()
        );
    }
}
