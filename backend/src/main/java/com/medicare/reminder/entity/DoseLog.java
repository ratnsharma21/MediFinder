package com.medicare.reminder.entity;

import com.medicare.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dose_logs")
public class DoseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_id", nullable = false)
    private Reminder reminder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "scheduled_time", nullable = false)
    private LocalDateTime scheduledTime;

    @Column(name = "actual_time")
    private LocalDateTime actualTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DoseStatus status = DoseStatus.TAKEN;

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DoseLog() {}

    public DoseLog(Reminder reminder, User user, LocalDateTime scheduledTime, LocalDateTime actualTime, DoseStatus status, String notes) {
        this.reminder = reminder;
        this.user = user;
        this.scheduledTime = scheduledTime;
        this.actualTime = actualTime;
        this.status = status != null ? status : DoseStatus.TAKEN;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reminder getReminder() {
        return reminder;
    }

    public void setReminder(Reminder reminder) {
        this.reminder = reminder;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
