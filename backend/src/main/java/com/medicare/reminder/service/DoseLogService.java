package com.medicare.reminder.service;

import com.medicare.common.exception.BadRequestException;
import com.medicare.common.exception.ConflictException;
import com.medicare.common.exception.ForbiddenException;
import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.reminder.dto.DoseLogRequest;
import com.medicare.reminder.dto.DoseLogResponse;
import com.medicare.reminder.dto.UpdateDoseStatusRequest;
import com.medicare.reminder.entity.DoseLog;
import com.medicare.reminder.entity.DoseStatus;
import com.medicare.reminder.entity.Reminder;
import com.medicare.reminder.repository.DoseLogRepository;
import com.medicare.reminder.repository.ReminderRepository;
import com.medicare.user.entity.User;
import com.medicare.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoseLogService {

    private final DoseLogRepository doseLogRepository;
    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public DoseLogService(DoseLogRepository doseLogRepository,
                          ReminderRepository reminderRepository,
                          UserRepository userRepository) {
        this.doseLogRepository = doseLogRepository;
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<DoseLogResponse> getUserDoseLogs(Long userId) {
        return doseLogRepository.findByUserIdOrderByScheduledTimeDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoseLogResponse> getReminderDoseLogs(Long reminderId, Long userId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));

        if (!reminder.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to view dose logs for this reminder");
        }

        return doseLogRepository.findByReminderIdOrderByScheduledTimeDesc(reminderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoseLogResponse logDose(Long userId, DoseLogRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Reminder reminder = reminderRepository.findByIdForUpdate(request.getReminderId())
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", request.getReminderId()));

        if (!reminder.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not own this medication reminder");
        }

        LocalDateTime scheduledTime = request.getScheduledTime().withSecond(0).withNano(0);
        if (scheduledTime.toLocalDate().isBefore(reminder.getStartDate())
                || (reminder.getEndDate() != null
                && scheduledTime.toLocalDate().isAfter(reminder.getEndDate()))) {
            throw new BadRequestException("Scheduled time must fall within the reminder date range");
        }
        if (!doseLogRepository.findByReminderIdAndScheduledTime(reminder.getId(), scheduledTime).isEmpty()) {
            throw new ConflictException("A dose has already been recorded for this scheduled time");
        }

        LocalDateTime actualTime = request.getActualTime() != null ? request.getActualTime() :
                (request.getStatus() == DoseStatus.TAKEN ? LocalDateTime.now() : null);

        DoseLog log = new DoseLog(
                reminder,
                user,
                scheduledTime,
                actualTime,
                request.getStatus() != null ? request.getStatus() : DoseStatus.TAKEN,
                request.getNotes() != null ? request.getNotes().trim() : null
        );

        DoseLog saved = doseLogRepository.save(log);
        return mapToResponse(saved);
    }

    @Transactional
    public DoseLogResponse updateDoseStatus(Long doseLogId, Long userId, UpdateDoseStatusRequest request) {
        DoseLog log = doseLogRepository.findById(doseLogId)
                .orElseThrow(() -> new ResourceNotFoundException("DoseLog", "id", doseLogId));

        if (!log.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to modify this dose record");
        }

        log.setStatus(request.getStatus());

        if (request.getStatus() == DoseStatus.TAKEN) {
            log.setActualTime(request.getActualTime() != null ? request.getActualTime() : LocalDateTime.now());
        } else {
            log.setActualTime(request.getActualTime());
        }

        if (request.getNotes() != null) {
            log.setNotes(request.getNotes().trim());
        }

        DoseLog updated = doseLogRepository.save(log);
        return mapToResponse(updated);
    }

    public DoseLogResponse mapToResponse(DoseLog log) {
        DoseLogResponse response = new DoseLogResponse();
        response.setId(log.getId());
        response.setReminderId(log.getReminder().getId());
        response.setMedicineName(log.getReminder().getCustomMedicineName());
        response.setDosage(log.getReminder().getDosage());
        response.setScheduledTime(log.getScheduledTime());
        response.setActualTime(log.getActualTime());
        response.setStatus(log.getStatus());
        response.setNotes(log.getNotes());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }
}
