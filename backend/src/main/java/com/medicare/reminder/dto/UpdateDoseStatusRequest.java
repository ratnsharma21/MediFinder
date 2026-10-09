package com.medicare.reminder.dto;

import com.medicare.reminder.entity.DoseStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class UpdateDoseStatusRequest {

    @NotNull(message = "Status is required (TAKEN, MISSED, SKIPPED)")
    private DoseStatus status;

    private LocalDateTime actualTime;

    @Size(max = 255, message = "Notes must be 255 characters or fewer")
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
