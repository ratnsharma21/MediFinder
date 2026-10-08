package com.medicare.reminder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReminderRequest {

    private Long medicineId;

    @NotBlank(message = "Medicine name is required")
    private String customMedicineName;

    @NotBlank(message = "Dosage is required (e.g. 1 tablet, 5 ml)")
    private String dosage;

    private String unit = "tablet";

    @NotBlank(message = "Frequency is required (e.g. ONCE_DAILY, TWICE_DAILY, THRICE_DAILY)")
    private String frequency;

    @NotBlank(message = "Time of day is required (e.g. 08:00, 20:00)")
    private String timeOfDay;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;
    private String instructions;
    private Boolean active = true;

    public ReminderRequest() {}

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getCustomMedicineName() {
        return customMedicineName;
    }

    public void setCustomMedicineName(String customMedicineName) {
        this.customMedicineName = customMedicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getTimeOfDay() {
        return timeOfDay;
    }

    public void setTimeOfDay(String timeOfDay) {
        this.timeOfDay = timeOfDay;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
