package com.medicare.medicine.repository;

import com.medicare.medicine.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long>, JpaSpecificationExecutor<Medicine> {

    @Query("SELECT DISTINCT m.category FROM Medicine m WHERE m.category IS NOT NULL ORDER BY m.category ASC")
    List<String> findDistinctCategories();

    @Query("SELECT m FROM Medicine m " +
           "WHERE (:query IS NULL OR :query = '' OR " +
           "       LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(m.genericName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(m.brandName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(m.composition) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:category IS NULL OR :category = '' OR LOWER(m.category) = LOWER(:category)) " +
           "AND (:prescription IS NULL OR m.requiresPrescription = :prescription) " +
           "AND (:minPrice IS NULL OR m.mrp >= :minPrice) " +
           "AND (:maxPrice IS NULL OR m.mrp <= :maxPrice)")
    Page<Medicine> searchMedicines(
            @Param("query") String query,
            @Param("category") String category,
            @Param("prescription") Boolean prescription,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
}
