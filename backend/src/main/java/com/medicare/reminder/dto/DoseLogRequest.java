package com.medicare.reminder.dto;

import com.medicare.reminder.entity.DoseStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class DoseLogRequest {

    @NotNull(message = "Reminder ID is required")
    private Long reminderId;

    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledTime;

    private LocalDateTime actualTime;
    private DoseStatus status = DoseStatus.TAKEN;

    @Size(max = 255, message = "Notes must be 255 characters or fewer")
    private String notes;

    public DoseLogRequest() {}

    public Long getReminderId() {
        return reminderId;
    }

    public void setReminderId(Long reminderId) {
        this.reminderId = reminderId;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public LocalDateTime getActualTime() {
        return actualTime;
    }

    public void setActualTime(LocalDateTime actualTime) {
        this.actualTime = actualTime;
    }

    public DoseStatus getStatus() {
        return status;
    }

    public void setStatus(DoseStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
