package com.medicare.pharmacy;

import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.common.response.PagedResponse;
import com.medicare.pharmacy.dto.PharmacyDto;
import com.medicare.pharmacy.dto.PharmacySearchFilter;
import com.medicare.pharmacy.entity.Pharmacy;
import com.medicare.pharmacy.repository.PharmacyRepository;
import com.medicare.pharmacy.service.PharmacyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PharmacyServiceTest {

    @Mock
    private PharmacyRepository pharmacyRepository;

    @InjectMocks
    private PharmacyService pharmacyService;

    private Pharmacy p1;
    private Pharmacy p2;

    @BeforeEach
    void setUp() {
        p1 = new Pharmacy();
        p1.setId(1L);
        p1.setName("Apollo Pharmacy - Indiranagar 24x7");
        p1.setLicenseNumber("DL-KA-BNG-2021-9921");
        p1.setContactNumber("+91 80 2520 1122");
        p1.setAddress("100 Feet Road, Indiranagar");
        p1.setCity("Bengaluru");
        p1.setState("Karnataka");
        p1.setPostalCode("560038");
        p1.setLatitude(BigDecimal.valueOf(12.97159870));
        p1.setLongitude(BigDecimal.valueOf(77.64098450));
        p1.setOpeningTime(LocalTime.of(0, 0));
        p1.setClosingTime(LocalTime.of(23, 59));
        p1.setIs24Hours(true);
        p1.setVerified(true);
        p1.setRating(BigDecimal.valueOf(4.80));

        p2 = new Pharmacy();
        p2.setId(2L);
        p2.setName("MedPlus Pharmacy - Whitefield");
        p2.setLicenseNumber("DL-KA-BNG-2020-5421");
        p2.setContactNumber("+91 80 2845 3344");
        p2.setAddress("Whitefield Main Road");
        p2.setCity("Bengaluru");
        p2.setState("Karnataka");
        p2.setPostalCode("560066");
        p2.setLatitude(BigDecimal.valueOf(12.96981200));
        p2.setLongitude(BigDecimal.valueOf(77.74994500));
        p2.setOpeningTime(LocalTime.of(8, 0));
        p2.setClosingTime(LocalTime.of(23, 0));
        p2.setIs24Hours(false);
        p2.setVerified(true);
        p2.setRating(BigDecimal.valueOf(4.60));
    }

    @Test
    @DisplayName("Should retrieve pharmacy by valid ID")
    void testGetPharmacyById_Success() {
        when(pharmacyRepository.findById(1L)).thenReturn(Optional.of(p1));

        PharmacyDto dto = pharmacyService.getPharmacyById(1L);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Apollo Pharmacy - Indiranagar 24x7", dto.getName());
        assertTrue(dto.isIs24Hours());
        assertTrue(dto.getOpenNow());
        assertEquals("Open 24 Hours (Emergency)", dto.getFormattedHours());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when pharmacy ID not found")
    void testGetPharmacyById_NotFound() {
        when(pharmacyRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> pharmacyService.getPharmacyById(999L));
    }

    @Test
    @DisplayName("Should search pharmacies with query filter and pagination")
    void testSearchPharmacies_Success() {
        PharmacySearchFilter filter = new PharmacySearchFilter();
        filter.setQuery("Apollo");
        filter.setCity("Bengaluru");
        filter.setPage(0);
        filter.setSize(10);

        Page<Pharmacy> page = new PageImpl<>(Collections.singletonList(p1));
        when(pharmacyRepository.searchPharmacies(eq("Apollo"), eq("Bengaluru"), eq(null), eq(null), any(Pageable.class)))
                .thenReturn(page);

        PagedResponse<PharmacyDto> response = pharmacyService.searchPharmacies(filter);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("Apollo Pharmacy - Indiranagar 24x7", response.getContent().get(0).getName());
    }

    @Test
    @DisplayName("Should calculate proximity distance and sort by closest store")
    void testGetNearbyPharmacies_SortingAndRadius() {
        when(pharmacyRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        double userLat = 12.9716;
        double userLng = 77.6410;
        double radiusInKm = 20.0;

        List<PharmacyDto> nearby = pharmacyService.getNearbyPharmacies(userLat, userLng, radiusInKm);

        assertNotNull(nearby);
        assertEquals(2, nearby.size());
        assertTrue(nearby.get(0).getDistanceInKm() < nearby.get(1).getDistanceInKm());
        assertTrue(nearby.get(0).getDistanceInKm() < 1.0);
    }

    @Test
    @DisplayName("Should filter out pharmacies outside specified radius")
    void testGetNearbyPharmacies_StrictRadiusFilter() {
        when(pharmacyRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        double userLat = 12.9716;
        double userLng = 77.6410;
        double radiusInKm = 2.0;

        List<PharmacyDto> nearby = pharmacyService.getNearbyPharmacies(userLat, userLng, radiusInKm);

        assertNotNull(nearby);
        assertEquals(1, nearby.size());
        assertEquals("Apollo Pharmacy - Indiranagar 24x7", nearby.get(0).getName());
    }
}