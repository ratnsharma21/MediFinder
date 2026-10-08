package com.medicare.medicine;

import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.medicine.dto.MedicineDetailDto;
import com.medicare.medicine.dto.RetailerOfferDto;
import com.medicare.medicine.entity.Manufacturer;
import com.medicare.medicine.entity.Medicine;
import com.medicare.medicine.entity.Retailer;
import com.medicare.medicine.entity.RetailerOffer;
import com.medicare.medicine.repository.ManufacturerRepository;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.medicine.repository.RetailerOfferRepository;
import com.medicare.medicine.repository.RetailerRepository;
import com.medicare.medicine.service.MedicineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class MedicineDetailTests {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private RetailerOfferRepository retailerOfferRepository;

    private Medicine testMedicine;
    private Retailer testRetailer1;
    private Retailer testRetailer2;

    @BeforeEach
    void setUp() {
        retailerOfferRepository.deleteAll();
        retailerRepository.deleteAll();
        medicineRepository.deleteAll();
        manufacturerRepository.deleteAll();

        Manufacturer manufacturer = new Manufacturer("Dr. Reddy's Lab", "India");
        manufacturer = manufacturerRepository.save(manufacturer);

        testMedicine = new Medicine();
        testMedicine.setName("Omez 20 Capsule");
        testMedicine.setGenericName("Omeprazole");
        testMedicine.setBrandName("Omez");
        testMedicine.setCategory("Gastrointestinal & Antacids");
        testMedicine.setDosageForm("Capsule");
        testMedicine.setStrength("20mg");
        testMedicine.setPackSize("15 Capsules");
        testMedicine.setComposition("Omeprazole IP 20mg");
        testMedicine.setIndications("Heartburn, acidity and stomach ulcers");
        testMedicine.setPrecautions("Take before breakfast");
        testMedicine.setStorageInstructions("Store in cool dry place");
        testMedicine.setRequiresPrescription(true);
        testMedicine.setMrp(BigDecimal.valueOf(175.00));
        testMedicine.setManufacturer(manufacturer);
        testMedicine.setAvailable(true);
        testMedicine = medicineRepository.save(testMedicine);

        testRetailer1 = new Retailer("Tata 1mg Test", "https://1mg.com");
        testRetailer1.setRating(BigDecimal.valueOf(4.80));
        testRetailer1 = retailerRepository.save(testRetailer1);

        testRetailer2 = new Retailer("PharmEasy Test", "https://pharmeasy.in");
        testRetailer2.setRating(BigDecimal.valueOf(4.60));
        testRetailer2 = retailerRepository.save(testRetailer2);

        RetailerOffer offer1 = new RetailerOffer(testMedicine, testRetailer1, BigDecimal.valueOf(148.75), "https://1mg.com/omez");
        offer1.setDiscountPercent(BigDecimal.valueOf(15.00));
        offer1.setInStock(true);
        offer1.setDeliveryEstimateDays(1);
        retailerOfferRepository.save(offer1);

        RetailerOffer offer2 = new RetailerOffer(testMedicine, testRetailer2, BigDecimal.valueOf(145.25), "https://pharmeasy.in/omez");
        offer2.setDiscountPercent(BigDecimal.valueOf(17.00));
        offer2.setInStock(true);
        offer2.setDeliveryEstimateDays(2);
        retailerOfferRepository.save(offer2);
    }

    @Test
    void getMedicineById_shouldReturnCompleteClinicalDetails() {
        MedicineDetailDto detail = medicineService.getMedicineById(testMedicine.getId());

        assertNotNull(detail);
        assertEquals("Omez 20 Capsule", detail.getName());
        assertEquals("Omeprazole", detail.getGenericName());
        assertEquals("Omeprazole IP 20mg", detail.getComposition());
        assertEquals("Dr. Reddy's Lab", detail.getManufacturer().getName());
        assertTrue(detail.isRequiresPrescription());
        assertEquals(BigDecimal.valueOf(175.00), detail.getMrp());
    }

    @Test
    void getMedicineById_shouldCalculatePriceProvenanceCorrectly() {
        MedicineDetailDto detail = medicineService.getMedicineById(testMedicine.getId());

        assertNotNull(detail);
        assertEquals(2, detail.getTotalOffersCount());
        assertEquals(BigDecimal.valueOf(145.25), detail.getLowestPrice());
        assertEquals("PharmEasy Test", detail.getBestRetailerName());
        assertEquals(BigDecimal.valueOf(17.00), detail.getMaxDiscountPercent());
    }

    @Test
    void getMedicineOffers_shouldReturnSortedByPrice() {
        List<RetailerOfferDto> offers = medicineService.getMedicineOffers(testMedicine.getId());

        assertNotNull(offers);
        assertEquals(2, offers.size());
        assertEquals(BigDecimal.valueOf(145.25), offers.get(0).getSellingPrice());
        assertEquals(BigDecimal.valueOf(148.75), offers.get(1).getSellingPrice());
    }

    @Test
    void getMedicineById_nonExistentId_shouldThrowNotFoundException() {
        assertThrows(ResourceNotFoundException.class, () -> {
            medicineService.getMedicineById(999999L);
        });
    }

    @Test
    void getMedicineById_invalidId_shouldThrowIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () -> {
            medicineService.getMedicineById(-5L);
        });
    }
}
