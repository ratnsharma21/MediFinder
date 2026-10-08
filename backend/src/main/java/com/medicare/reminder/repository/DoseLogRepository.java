package com.medicare.reminder.repository;

import com.medicare.reminder.entity.DoseLog;
import com.medicare.reminder.entity.DoseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoseLogRepository extends JpaRepository<DoseLog, Long> {
    List<DoseLog> findByUserIdOrderByScheduledTimeDesc(Long userId);
    List<DoseLog> findByReminderIdOrderByScheduledTimeDesc(Long reminderId);
    List<DoseLog> findByUserIdAndScheduledTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);
    List<DoseLog> findByUserIdAndStatus(Long userId, DoseStatus status);
    Optional<DoseLog> findByIdAndUserId(Long id, Long userId);
}
