package com.medicare.medicine;

import com.medicare.medicine.entity.Manufacturer;
import com.medicare.medicine.entity.Medicine;
import com.medicare.medicine.entity.Retailer;
import com.medicare.medicine.entity.RetailerOffer;
import com.medicare.medicine.repository.ManufacturerRepository;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.medicine.repository.RetailerOfferRepository;
import com.medicare.medicine.repository.RetailerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MedicineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private RetailerOfferRepository retailerOfferRepository;

    private Medicine testMedicine;

    @BeforeEach
    void setUp() {
        retailerOfferRepository.deleteAll();
        medicineRepository.deleteAll();
        manufacturerRepository.deleteAll();
        retailerRepository.deleteAll();

        Manufacturer manufacturer = new Manufacturer("Cipla Ltd", "India", "https://cipla.com", "contact@cipla.com");
        manufacturer = manufacturerRepository.save(manufacturer);

        testMedicine = new Medicine();
        testMedicine.setName("Dolo 650 Tablet");
        testMedicine.setGenericName("Paracetamol");
        testMedicine.setBrandName("Dolo");
        testMedicine.setCategory("Analgesic");
        testMedicine.setDosageForm("Tablet");
        testMedicine.setStrength("650 mg");
        testMedicine.setPackSize("15 Tablets in 1 Strip");
        testMedicine.setMrp(BigDecimal.valueOf(34.00));
        testMedicine.setManufacturer(manufacturer);
        testMedicine.setRequiresPrescription(false);
        testMedicine = medicineRepository.save(testMedicine);

        Retailer retailer = new Retailer("Tata 1mg", "https://1mg.com", "https://1mg.com/logo.svg", BigDecimal.valueOf(4.7));
        retailer = retailerRepository.save(retailer);

        RetailerOffer offer = new RetailerOffer();
        offer.setMedicine(testMedicine);
        offer.setRetailer(retailer);
        offer.setSellingPrice(BigDecimal.valueOf(28.50));
        offer.setDiscountPercent(BigDecimal.valueOf(16.18));
        offer.setProductUrl("https://1mg.com/drugs/dolo-650");
        offer.setInStock(true);
        offer.setDeliveryEstimateDays(1);
        retailerOfferRepository.save(offer);
    }

    @Test
    void testGetMedicines() throws Exception {
        mockMvc.perform(get("/api/medicines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[0].name", is("Dolo 650 Tablet")))
                .andExpect(jsonPath("$.data.content[0].lowestPrice", is(28.5)));
    }

    @Test
    void testSearchMedicinesByQuery() throws Exception {
        mockMvc.perform(get("/api/medicines").param("query", "Paracetamol"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].genericName", is("Paracetamol")));
    }

    @Test
    void testGetMedicineById() throws Exception {
        mockMvc.perform(get("/api/medicines/" + testMedicine.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(testMedicine.getId().intValue())))
                .andExpect(jsonPath("$.data.name", is("Dolo 650 Tablet")))
                .andExpect(jsonPath("$.data.manufacturer.name", is("Cipla Ltd")));
    }

    @Test
    void testGetMedicineOffers() throws Exception {
        mockMvc.perform(get("/api/medicines/" + testMedicine.getId() + "/offers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].retailerName", is("Tata 1mg")))
                .andExpect(jsonPath("$.data[0].sellingPrice", is(28.5)));
    }

    @Test
    void testGetCategories() throws Exception {
        mockMvc.perform(get("/api/medicines/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasItem("Analgesic")));
    }
}
