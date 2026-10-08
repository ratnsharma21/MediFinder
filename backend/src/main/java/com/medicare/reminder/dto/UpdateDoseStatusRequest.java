package com.medicare.reminder.dto;

import com.medicare.reminder.entity.DoseStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class UpdateDoseStatusRequest {

    @NotNull(message = "Status is required (TAKEN, MISSED, SKIPPED)")
    private DoseStatus status;

    private LocalDateTime actualTime;
    private String notes;

    public UpdateDoseStatusRequest() {}

    public DoseStatus getStatus() {
        return status;
    }

    public void setStatus(DoseStatus status) {
        this.status = status;
    }

    public LocalDateTime getActualTime() {
        return actualTime;
    }

    public void setActualTime(LocalDateTime actualTime) {
        this.actualTime = actualTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
