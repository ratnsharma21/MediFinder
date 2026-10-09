package com.medicare.pharmacy;

import com.medicare.pharmacy.entity.Pharmacy;
import com.medicare.pharmacy.repository.PharmacyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
public class JaipurPharmacyLocationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    @BeforeEach
    void setUp() {
        pharmacyRepository.deleteAll();

        // Seed Jaipur Hospital Counter
        Pharmacy smsHospital = new Pharmacy();
        smsHospital.setName("SMS Hospital Pharmacy Counter - JLN Marg");
        smsHospital.setLicenseNumber("RJ-JPR-2023-SMS01");
        smsHospital.setContactNumber("+91 141 251 8241");
        smsHospital.setAddress("SMS Hospital Complex, Sawai Ram Singh Road");
        smsHospital.setCity("Jaipur");
        smsHospital.setState("Rajasthan");
        smsHospital.setPostalCode("302004");
        smsHospital.setLatitude(BigDecimal.valueOf(26.89720000));
        smsHospital.setLongitude(BigDecimal.valueOf(75.81550000));
        smsHospital.setOpeningTime(LocalTime.of(0, 0));
        smsHospital.setClosingTime(LocalTime.of(23, 59));
        smsHospital.setIs24Hours(true);
        smsHospital.setVerified(true);
        smsHospital.setRating(BigDecimal.valueOf(4.90));
        pharmacyRepository.save(smsHospital);

        // Seed Apollo Jaipur
        Pharmacy apolloJaipur = new Pharmacy();
        apolloJaipur.setName("Apollo Pharmacy - C Scheme");
        apolloJaipur.setLicenseNumber("RJ-JPR-2022-APL88");
        apolloJaipur.setContactNumber("+91 141 237 9901");
        apolloJaipur.setAddress("Bhagwan Das Road, C Scheme, Ashok Nagar");
        apolloJaipur.setCity("Jaipur");
        apolloJaipur.setState("Rajasthan");
        apolloJaipur.setPostalCode("302001");
        apolloJaipur.setLatitude(BigDecimal.valueOf(26.91150000));
        apolloJaipur.setLongitude(BigDecimal.valueOf(75.80230000));
        apolloJaipur.setOpeningTime(LocalTime.of(0, 0));
        apolloJaipur.setClosingTime(LocalTime.of(23, 59));
        apolloJaipur.setIs24Hours(true);
        apolloJaipur.setVerified(true);
        apolloJaipur.setRating(BigDecimal.valueOf(4.85));
        pharmacyRepository.save(apolloJaipur);
    }

    @Test
    @DisplayName("1. Default locator search by city 'Jaipur' returns Jaipur pharmacies")
    void testGetPharmaciesByCityJaipur() throws Exception {
        mockMvc.perform(get("/api/pharmacies")
                        .param("city", "Jaipur"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(2)))
                .andExpect(jsonPath("$.data.content[*].city", everyItem(is("Jaipur"))))
                .andExpect(jsonPath("$.data.content[*].state", everyItem(is("Rajasthan"))));
    }

    @Test
    @DisplayName("2. Proximity search around Jaipur coordinates calculates distance correctly")
    void testGetPharmaciesProximityJaipurCoordinates() throws Exception {
        // Jaipur center: 26.9124, 75.7873
        mockMvc.perform(get("/api/pharmacies")
                        .param("latitude", "26.9124")
                        .param("longitude", "75.7873")
                        .param("radiusInKm", "15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(2)))
                .andExpect(jsonPath("$.data.content[0].distanceInKm", notNullValue()));
    }

    @Test
    @DisplayName("3. 24 Hours filter works on Jaipur establishments")
    void testGet24HoursJaipurPharmacies() throws Exception {
        mockMvc.perform(get("/api/pharmacies")
                        .param("city", "Jaipur")
                        .param("is24Hours", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(2)));
    }
}
