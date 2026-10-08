package com.medicare.pharmacy.service;

import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.common.response.PagedResponse;
import com.medicare.pharmacy.dto.PharmacyDto;
import com.medicare.pharmacy.dto.PharmacySearchFilter;
import com.medicare.pharmacy.entity.Pharmacy;
import com.medicare.pharmacy.repository.PharmacyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;

    public PharmacyService(PharmacyRepository pharmacyRepository) {
        this.pharmacyRepository = pharmacyRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<PharmacyDto> searchPharmacies(PharmacySearchFilter filter) {
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(Sort.Direction.ASC, "name"));

        String query = (filter.getQuery() != null && !filter.getQuery().trim().isEmpty()) ? filter.getQuery().trim() : null;
        String city = (filter.getCity() != null && !filter.getCity().trim().isEmpty()) ? filter.getCity().trim() : null;
        String postalCode = (filter.getPostalCode() != null && !filter.getPostalCode().trim().isEmpty()) ? filter.getPostalCode().trim() : null;

        Page<Pharmacy> page = pharmacyRepository.searchPharmacies(query, city, postalCode, filter.getIs24Hours(), pageable);

        List<PharmacyDto> dtos = page.getContent().stream()
                .map(this::mapToPharmacyDto)
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
    public PharmacyDto getPharmacyById(Long id) {
        Pharmacy pharmacy = pharmacyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy", "id", id));
        return mapToPharmacyDto(pharmacy);
    }

    @Transactional(readOnly = true)
    public List<PharmacyDto> getNearbyPharmacies(Double userLat, Double userLng, Double radiusInKm) {
        double maxRadius = (radiusInKm != null && radiusInKm > 0) ? radiusInKm : 10.0;
        List<Pharmacy> allPharmacies = pharmacyRepository.findAll();

        return allPharmacies.stream()
                .map(pharmacy -> {
                    PharmacyDto dto = mapToPharmacyDto(pharmacy);
                    if (userLat != null && userLng != null && pharmacy.getLatitude() != null && pharmacy.getLongitude() != null) {
                        double distance = calculateHaversineDistance(
                                userLat, userLng,
                                pharmacy.getLatitude().doubleValue(),
                                pharmacy.getLongitude().doubleValue()
                        );
                        dto.setDistanceInKm(Math.round(distance * 100.0) / 100.0);
                    }
                    return dto;
                })
                .filter(dto -> dto.getDistanceInKm() == null || dto.getDistanceInKm() <= maxRadius)
                .sorted(Comparator.comparing(dto -> dto.getDistanceInKm() != null ? dto.getDistanceInKm() : Double.MAX_VALUE))
                .collect(Collectors.toList());
    }

    public PharmacyDto mapToPharmacyDto(Pharmacy pharmacy) {
        PharmacyDto dto = new PharmacyDto();
        dto.setId(pharmacy.getId());
        dto.setName(pharmacy.getName());
        dto.setLicenseNumber(pharmacy.getLicenseNumber());
        dto.setContactNumber(pharmacy.getContactNumber());
        dto.setEmail(pharmacy.getEmail());
        dto.setAddress(pharmacy.getAddress());
        dto.setCity(pharmacy.getCity());
        dto.setState(pharmacy.getState());
        dto.setPostalCode(pharmacy.getPostalCode());
        dto.setLatitude(pharmacy.getLatitude());
        dto.setLongitude(pharmacy.getLongitude());
        dto.setOpeningTime(pharmacy.getOpeningTime());
        dto.setClosingTime(pharmacy.getClosingTime());
        dto.setIs24Hours(pharmacy.isIs24Hours());
        dto.setVerified(pharmacy.isVerified());
        dto.setRating(pharmacy.getRating());
        return dto;
    }

    /**
     * Calculates great-circle distance between two points on the Earth surface using Haversine formula
     * @return Distance in kilometers
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
