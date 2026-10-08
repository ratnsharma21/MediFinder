package com.medicare.medicine.dto;

import java.time.LocalDateTime;

public class SavedMedicineDto {
    private Long id;
    private MedicineDto medicine;
    private String notes;
    private LocalDateTime createdAt;

    public SavedMedicineDto() {}

    public SavedMedicineDto(Long id, MedicineDto medicine, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.medicine = medicine;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MedicineDto getMedicine() {
        return medicine;
    }

    public void setMedicine(MedicineDto medicine) {
        this.medicine = medicine;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
