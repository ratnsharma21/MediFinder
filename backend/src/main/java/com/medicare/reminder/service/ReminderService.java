package com.medicare.reminder.service;

import com.medicare.common.exception.ForbiddenException;
import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.medicine.entity.Medicine;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.reminder.dto.ReminderRequest;
import com.medicare.reminder.dto.ReminderResponse;
import com.medicare.reminder.entity.Reminder;
import com.medicare.reminder.repository.ReminderRepository;
import com.medicare.user.entity.User;
import com.medicare.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;

    public ReminderService(ReminderRepository reminderRepository,
                           UserRepository userRepository,
                           MedicineRepository medicineRepository) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
        this.medicineRepository = medicineRepository;
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getUserReminders(Long userId) {
        return reminderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReminderResponse getReminderById(Long id, Long userId) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));

        if (!reminder.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to view this reminder");
        }

        return mapToResponse(reminder);
    }

    @Transactional
    public ReminderResponse createReminder(Long userId, ReminderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Medicine medicine = null;
        if (request.getMedicineId() != null) {
            medicine = medicineRepository.findById(request.getMedicineId()).orElse(null);
        }

        Reminder reminder = new Reminder();
        reminder.setUser(user);
        reminder.setMedicine(medicine);
        reminder.setCustomMedicineName(request.getCustomMedicineName().trim());
        reminder.setDosage(request.getDosage().trim());
        reminder.setUnit(request.getUnit() != null ? request.getUnit().trim() : "tablet");
        reminder.setFrequency(request.getFrequency().trim());
        reminder.setTimeOfDay(request.getTimeOfDay().trim());
        reminder.setStartDate(request.getStartDate());
        reminder.setEndDate(request.getEndDate());
        reminder.setInstructions(request.getInstructions() != null ? request.getInstructions().trim() : null);
        reminder.setActive(request.getActive() != null ? request.getActive() : true);

        Reminder saved = reminderRepository.save(reminder);
        return mapToResponse(saved);
    }

    @Transactional
    public ReminderResponse updateReminder(Long id, Long userId, ReminderRequest request) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));

        if (!reminder.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to update this reminder");
        }

        if (request.getMedicineId() != null) {
            Medicine medicine = medicineRepository.findById(request.getMedicineId()).orElse(null);
            reminder.setMedicine(medicine);
        }
        if (request.getCustomMedicineName() != null) {
            reminder.setCustomMedicineName(request.getCustomMedicineName().trim());
        }
        if (request.getDosage() != null) {
            reminder.setDosage(request.getDosage().trim());
        }
        if (request.getUnit() != null) {
            reminder.setUnit(request.getUnit().trim());
        }
        if (request.getFrequency() != null) {
            reminder.setFrequency(request.getFrequency().trim());
        }
        if (request.getTimeOfDay() != null) {
            reminder.setTimeOfDay(request.getTimeOfDay().trim());
        }
        if (request.getStartDate() != null) {
            reminder.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            reminder.setEndDate(request.getEndDate());
        }
        if (request.getInstructions() != null) {
            reminder.setInstructions(request.getInstructions().trim());
        }
        if (request.getActive() != null) {
            reminder.setActive(request.getActive());
        }

        Reminder updated = reminderRepository.save(reminder);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteReminder(Long id, Long userId) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));

        if (!reminder.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to delete this reminder");
        }

        reminderRepository.delete(reminder);
    }

    public ReminderResponse mapToResponse(Reminder reminder) {
        ReminderResponse response = new ReminderResponse();
        response.setId(reminder.getId());
        response.setUserId(reminder.getUser().getId());
        response.setMedicineId(reminder.getMedicine() != null ? reminder.getMedicine().getId() : null);
        response.setCustomMedicineName(reminder.getCustomMedicineName());
        response.setDosage(reminder.getDosage());
        response.setUnit(reminder.getUnit());
        response.setFrequency(reminder.getFrequency());
        response.setTimeOfDay(reminder.getTimeOfDay());
        response.setStartDate(reminder.getStartDate());
        response.setEndDate(reminder.getEndDate());
        response.setInstructions(reminder.getInstructions());
        response.setActive(reminder.isActive());
        response.setCreatedAt(reminder.getCreatedAt());
        response.setUpdatedAt(reminder.getUpdatedAt());
        return response;
    }
}
