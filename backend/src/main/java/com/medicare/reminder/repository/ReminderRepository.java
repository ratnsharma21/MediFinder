package com.medicare.reminder.repository;

import com.medicare.reminder.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Reminder> findByUserIdAndActiveTrue(Long userId);
    Optional<Reminder> findByIdAndUserId(Long id, Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select reminder from Reminder reminder where reminder.id = :id")
    Optional<Reminder> findByIdForUpdate(@Param("id") Long id);
}
