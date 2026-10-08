package com.medicare.medicine.repository;

import com.medicare.medicine.entity.SavedMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedMedicineRepository extends JpaRepository<SavedMedicine, Long> {
    List<SavedMedicine> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<SavedMedicine> findByUserIdAndMedicineId(Long userId, Long medicineId);
    boolean existsByUserIdAndMedicineId(Long userId, Long medicineId);
    void deleteByUserIdAndMedicineId(Long userId, Long medicineId);
}
