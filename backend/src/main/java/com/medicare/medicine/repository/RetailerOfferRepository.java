package com.medicare.medicine.repository;

import com.medicare.medicine.entity.RetailerOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetailerOfferRepository extends JpaRepository<RetailerOffer, Long> {
    List<RetailerOffer> findByMedicineIdOrderBySellingPriceAsc(Long medicineId);
    Optional<RetailerOffer> findByMedicineIdAndRetailerId(Long medicineId, Long retailerId);
}
