package com.medicare.pharmacy.repository;

import com.medicare.pharmacy.entity.Pharmacy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    @Query("SELECT p FROM Pharmacy p " +
           "WHERE (:query IS NULL OR :query = '' OR " +
           "       LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "       p.postalCode LIKE CONCAT('%', :query, '%')) " +
           "AND (:city IS NULL OR :city = '' OR LOWER(p.city) = LOWER(:city)) " +
           "AND (:postalCode IS NULL OR :postalCode = '' OR p.postalCode = :postalCode) " +
           "AND (:is24Hours IS NULL OR p.is24Hours = :is24Hours)")
    Page<Pharmacy> searchPharmacies(
            @Param("query") String query,
            @Param("city") String city,
            @Param("postalCode") String postalCode,
            @Param("is24Hours") Boolean is24Hours,
            Pageable pageable
    );

    List<Pharmacy> findByCityIgnoreCase(String city);

    List<Pharmacy> findByPostalCode(String postalCode);
}
