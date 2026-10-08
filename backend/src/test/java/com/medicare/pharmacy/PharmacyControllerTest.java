package com.medicare.pharmacy;

import com.medicare.pharmacy.entity.Pharmacy;
import com.medicare.pharmacy.repository.PharmacyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PharmacyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    private Pharmacy testPharmacy;

    @BeforeEach
    void setUp() {
        pharmacyRepository.deleteAll();

        testPharmacy = new Pharmacy();
        testPharmacy.setName("Apollo Pharmacy - Indiranagar");
        testPharmacy.setLicenseNumber("DL-KA-BNG-2021-9921");
        testPharmacy.setContactNumber("+91 80 2520 1122");
        testPharmacy.setEmail("apollo@medicare.demo");
        testPharmacy.setAddress("100 Feet Road, Indiranagar");
        testPharmacy.setCity("Bengaluru");
        testPharmacy.setState("Karnataka");
        testPharmacy.setPostalCode("560038");
        testPharmacy.setLatitude(BigDecimal.valueOf(12.97159870));
        testPharmacy.setLongitude(BigDecimal.valueOf(77.64098450));
        testPharmacy.setOpeningTime(LocalTime.of(0, 0));
        testPharmacy.setClosingTime(LocalTime.of(23, 59));
        testPharmacy.setIs24Hours(true);
        testPharmacy.setVerified(true);
        testPharmacy.setRating(BigDecimal.valueOf(4.80));

        testPharmacy = pharmacyRepository.save(testPharmacy);
    }

    @Test
    void testGetPharmacies() throws Exception {
        mockMvc.perform(get("/api/pharmacies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].name", is("Apollo Pharmacy - Indiranagar")))
                .andExpect(jsonPath("$.data.content[0].is24Hours", is(true)));
    }

    @Test
    void testGetPharmacies_WithCoordinatesCalculatesDistance() throws Exception {
        mockMvc.perform(get("/api/pharmacies")
                        .param("latitude", "12.9716")
                        .param("longitude", "77.6410"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content[0].distanceInKm", notNullValue()));
    }

    @Test
    void testGetPharmacies_InvalidPaginationNegativePage() throws Exception {
        mockMvc.perform(get("/api/pharmacies")
                        .param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Page index cannot be negative")));
    }

    @Test
    void testGetPharmacies_InvalidPaginationExcessiveSize() throws Exception {
        mockMvc.perform(get("/api/pharmacies")
                        .param("size", "250"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Page size must be between 1 and 100")));
    }

    @Test
    void testGetPharmacyById() throws Exception {
        mockMvc.perform(get("/api/pharmacies/" + testPharmacy.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(testPharmacy.getId().intValue())))
                .andExpect(jsonPath("$.data.city", is("Bengaluru")))
                .andExpect(jsonPath("$.data.postalCode", is("560038")));
    }

    @Test
    void testGetNearbyPharmacies() throws Exception {
        // Search around Indiranagar (12.9716, 77.6410)
        mockMvc.perform(get("/api/pharmacies/nearby")
                        .param("latitude", "12.9716")
                        .param("longitude", "77.6410")
                        .param("radiusInKm", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].distanceInKm", notNullValue()));
    }

    @Test
    void testGetNearbyPharmacies_InvalidLatitude() throws Exception {
        mockMvc.perform(get("/api/pharmacies/nearby")
                        .param("latitude", "95.0")
                        .param("longitude", "77.6410")
                        .param("radiusInKm", "5.0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("Latitude must be between -90.0 and 90.0 degrees")));
    }

    @Test
    void testGetNearbyPharmacies_InvalidLongitude() throws Exception {
        mockMvc.perform(get("/api/pharmacies/nearby")
                        .param("latitude", "12.9716")
                        .param("longitude", "200.0")
                        .param("radiusInKm", "5.0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("Longitude must be between -180.0 and 180.0 degrees")));
    }

    @Test
    void testGetNearbyPharmacies_InvalidRadius() throws Exception {
        mockMvc.perform(get("/api/pharmacies/nearby")
                        .param("latitude", "12.9716")
                        .param("longitude", "77.6410")
                        .param("radiusInKm", "-1.0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("Radius must be greater than 0 and cannot exceed 500.0 kilometers")));
    }

    @Test
    void testGetNearbyPharmacies_EmptyWhenOutOfRadius() throws Exception {
        mockMvc.perform(get("/api/pharmacies/nearby")
                        .param("latitude", "19.0760")
                        .param("longitude", "72.8777")
                        .param("radiusInKm", "1.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(0)));
    }
}