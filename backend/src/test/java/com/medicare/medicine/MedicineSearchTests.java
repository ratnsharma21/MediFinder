package com.medicare.medicine;

import com.medicare.common.response.PagedResponse;
import com.medicare.medicine.dto.MedicineDto;
import com.medicare.medicine.dto.MedicineSearchFilter;
import com.medicare.medicine.entity.Manufacturer;
import com.medicare.medicine.entity.Medicine;
import com.medicare.medicine.repository.ManufacturerRepository;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.medicine.service.MedicineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class MedicineSearchTests {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    private Medicine testMedicine1;
    private Medicine testMedicine2;

    @BeforeEach
    void setUp() {
        medicineRepository.deleteAll();
        manufacturerRepository.deleteAll();

        Manufacturer manufacturer = new Manufacturer("Cipla Test Lab", "India", "https://cipla.com", "info@cipla.com");
        manufacturer = manufacturerRepository.save(manufacturer);

        testMedicine1 = new Medicine();
        testMedicine1.setName("Paracetamol 500mg");
        testMedicine1.setGenericName("Paracetamol");
        testMedicine1.setBrandName("Calpol");
        testMedicine1.setCategory("Analgesics & Antipyretics");
        testMedicine1.setDosageForm("Tablet");
        testMedicine1.setStrength("500mg");
        testMedicine1.setPackSize("10 Tablets");
        testMedicine1.setComposition("Paracetamol IP 500mg");
        testMedicine1.setIndications("Fever and mild headache relief");
        testMedicine1.setPrecautions("Do not exceed recommended dose");
        testMedicine1.setRequiresPrescription(false);
        testMedicine1.setMrp(BigDecimal.valueOf(25.50));
        testMedicine1.setManufacturer(manufacturer);
        testMedicine1.setAvailable(true);
        testMedicine1 = medicineRepository.save(testMedicine1);

        testMedicine2 = new Medicine();
        testMedicine2.setName("Amoxicillin 500mg Capsule");
        testMedicine2.setGenericName("Amoxicillin");
        testMedicine2.setBrandName("Novamox");
        testMedicine2.setCategory("Antibiotics & Anti-infectives");
        testMedicine2.setDosageForm("Capsule");
        testMedicine2.setStrength("500mg");
        testMedicine2.setPackSize("10 Capsules");
        testMedicine2.setComposition("Amoxicillin Trihydrate 500mg");
        testMedicine2.setIndications("Bacterial infections treatment");
        testMedicine2.setPrecautions("Complete full antibiotic course");
        testMedicine2.setRequiresPrescription(true);
        testMedicine2.setMrp(BigDecimal.valueOf(85.00));
        testMedicine2.setManufacturer(manufacturer);
        testMedicine2.setAvailable(true);
        testMedicine2 = medicineRepository.save(testMedicine2);
    }

    @Test
    void searchMedicines_byGenericName_shouldReturnMatches() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setQuery("Paracetamol");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals("Paracetamol 500mg", results.getContent().get(0).getName());
        assertEquals("Paracetamol", results.getContent().get(0).getGenericName());
    }

    @Test
    void searchMedicines_byBrandName_shouldReturnMatches() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setQuery("Novamox");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals("Amoxicillin 500mg Capsule", results.getContent().get(0).getName());
    }

    @Test
    void searchMedicines_withNonExistentQuery_shouldReturnEmpty() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setQuery("NonExistentSaltXYZ123");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(0, results.getTotalElements());
        assertTrue(results.getContent().isEmpty());
    }

    @Test
    void searchMedicines_withEmptyQuery_shouldReturnAll() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setQuery("   ");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(2, results.getTotalElements());
    }

    @Test
    void searchMedicines_querySanitization_shouldHandleSpecialChars() {
        String sanitized = medicineService.sanitizeSearchQuery("  Paracetamol %%% ___  ");
        assertNotNull(sanitized);
        assertFalse(sanitized.contains("%%%"));
    }
}
