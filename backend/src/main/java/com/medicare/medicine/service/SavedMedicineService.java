package com.medicare.medicine.service;

import com.medicare.common.exception.BadRequestException;
import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.medicine.dto.SavedMedicineDto;
import com.medicare.medicine.entity.Medicine;
import com.medicare.medicine.entity.SavedMedicine;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.medicine.repository.SavedMedicineRepository;
import com.medicare.user.entity.User;
import com.medicare.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedMedicineService {

    private final SavedMedicineRepository savedMedicineRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final MedicineService medicineService;

    public SavedMedicineService(SavedMedicineRepository savedMedicineRepository,
                                MedicineRepository medicineRepository,
                                UserRepository userRepository,
                                MedicineService medicineService) {
        this.savedMedicineRepository = savedMedicineRepository;
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
        this.medicineService = medicineService;
    }

    @Transactional(readOnly = true)
    public List<SavedMedicineDto> getSavedMedicines(Long userId) {
        return savedMedicineRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(s -> new SavedMedicineDto(
                        s.getId(),
                        medicineService.mapToMedicineDto(s.getMedicine()),
                        s.getNotes(),
                        s.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public SavedMedicineDto saveMedicine(Long userId, Long medicineId, String notes) {
        if (savedMedicineRepository.existsByUserIdAndMedicineId(userId, medicineId)) {
            throw new BadRequestException("Medicine is already saved in your bookmarks");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", medicineId));

        SavedMedicine saved = new SavedMedicine(user, medicine, notes);
        SavedMedicine result = savedMedicineRepository.save(saved);

        return new SavedMedicineDto(
                result.getId(),
                medicineService.mapToMedicineDto(result.getMedicine()),
                result.getNotes(),
                result.getCreatedAt()
        );
    }

    @Transactional
    public void removeSavedMedicine(Long userId, Long medicineId) {
        if (!savedMedicineRepository.existsByUserIdAndMedicineId(userId, medicineId)) {
            throw new ResourceNotFoundException("Saved medicine not found for this user");
        }
        savedMedicineRepository.deleteByUserIdAndMedicineId(userId, medicineId);
    }
}
