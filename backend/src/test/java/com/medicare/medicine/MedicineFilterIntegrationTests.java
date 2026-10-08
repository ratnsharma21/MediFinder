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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class MedicineFilterIntegrationTests {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @BeforeEach
    void setUp() {
        medicineRepository.deleteAll();
        manufacturerRepository.deleteAll();

        Manufacturer m1 = manufacturerRepository.save(new Manufacturer("Cipla Test", "India"));
        Manufacturer m2 = manufacturerRepository.save(new Manufacturer("Sun Pharma Test", "India"));

        createMedicine("Dolo 650", "Paracetamol", "Dolo", "Analgesics", "Tablet", "650mg", false, BigDecimal.valueOf(30.00), m1);
        createMedicine("Augmentin 625", "Amoxicillin", "Augmentin", "Antibiotics", "Tablet", "625mg", true, BigDecimal.valueOf(200.00), m1);
        createMedicine("Ascoril LS", "Ambroxol", "Ascoril", "Respiratory", "Syrup", "100ml", true, BigDecimal.valueOf(110.00), m2);
        createMedicine("Cetirizine 10", "Cetirizine", "Cetzine", "Allergy", "Tablet", "10mg", false, BigDecimal.valueOf(20.00), m2);
        createMedicine("Becosules Z", "B-Complex", "Becosules", "Vitamins", "Capsule", "Multivitamin", false, BigDecimal.valueOf(45.00), m2);
    }

    private void createMedicine(String name, String generic, String brand, String cat, String form, String strength, boolean rx, BigDecimal mrp, Manufacturer m) {
        Medicine med = new Medicine();
        med.setName(name);
        med.setGenericName(generic);
        med.setBrandName(brand);
        med.setCategory(cat);
        med.setDosageForm(form);
        med.setStrength(strength);
        med.setRequiresPrescription(rx);
        med.setMrp(mrp);
        med.setManufacturer(m);
        med.setAvailable(true);
        medicineRepository.save(med);
    }

    @Test
    void filterByCategory_shouldReturnMatchingCategoryOnly() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setCategory("Antibiotics");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals("Augmentin 625", results.getContent().get(0).getName());
    }

    @Test
    void filterByDosageForm_shouldFilterSyrups() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setDosageForm("Syrup");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals("Ascoril LS", results.getContent().get(0).getName());
    }

    @Test
    void filterByPriceRange_shouldReturnMedicinesWithinBounds() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setMinPrice(BigDecimal.valueOf(25.00));
        filter.setMaxPrice(BigDecimal.valueOf(120.00));

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(3, results.getTotalElements()); // Dolo (30), Ascoril (110), Becosules (45)
    }

    @Test
    void filterByPrescriptionRequired_otcOnly_shouldReturnNonPrescription() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setRequiresPrescription(false);

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(3, results.getTotalElements()); // Dolo, Cetirizine, Becosules
    }

    @Test
    void sortByPrice_ascending_shouldReturnCheapestFirst() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setSortBy("price");
        filter.setSortDirection("ASC");

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(5, results.getTotalElements());
        assertEquals("Cetirizine 10", results.getContent().get(0).getName()); // 20.00
        assertEquals("Augmentin 625", results.getContent().get(4).getName()); // 200.00
    }

    @Test
    void pagination_shouldRespectPageSize() {
        MedicineSearchFilter filter = new MedicineSearchFilter();
        filter.setPage(0);
        filter.setSize(2);

        PagedResponse<MedicineDto> results = medicineService.searchMedicines(filter);

        assertNotNull(results);
        assertEquals(2, results.getContent().size());
        assertEquals(5, results.getTotalElements());
        assertEquals(3, results.getTotalPages());
    }

    @Test
    void getDistinctCategoriesAndDosageForms_shouldReturnPopulatedLists() {
        List<String> categories = medicineService.getCategories();
        List<String> dosageForms = medicineService.getDosageForms();

        assertNotNull(categories);
        assertTrue(categories.size() >= 4);

        assertNotNull(dosageForms);
        assertTrue(dosageForms.contains("Tablet"));
        assertTrue(dosageForms.contains("Syrup"));
        assertTrue(dosageForms.contains("Capsule"));
    }
}
