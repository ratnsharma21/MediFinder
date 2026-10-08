package com.medicare.user.dto;

public class UserSettingsDto {
    private Long id;
    private boolean emailNotificationsEnabled;
    private boolean smsNotificationsEnabled;
    private boolean browserNotificationsEnabled;
    private boolean inAppNotificationsEnabled;
    private boolean darkMode;
    private String reminderSound;

    public UserSettingsDto() {}

    public UserSettingsDto(Long id, boolean emailNotificationsEnabled, boolean smsNotificationsEnabled, boolean browserNotificationsEnabled, boolean inAppNotificationsEnabled, boolean darkMode, String reminderSound) {
        this.id = id;
        this.emailNotificationsEnabled = emailNotificationsEnabled;
        this.smsNotificationsEnabled = smsNotificationsEnabled;
        this.browserNotificationsEnabled = browserNotificationsEnabled;
        this.inAppNotificationsEnabled = inAppNotificationsEnabled;
        this.darkMode = darkMode;
        this.reminderSound = reminderSound;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isEmailNotificationsEnabled() {
        return emailNotificationsEnabled;
    }

    public void setEmailNotificationsEnabled(boolean emailNotificationsEnabled) {
        this.emailNotificationsEnabled = emailNotificationsEnabled;
    }

    public boolean isSmsNotificationsEnabled() {
        return smsNotificationsEnabled;
    }

    public void setSmsNotificationsEnabled(boolean smsNotificationsEnabled) {
        this.smsNotificationsEnabled = smsNotificationsEnabled;
    }

    public boolean isBrowserNotificationsEnabled() {
        return browserNotificationsEnabled;
    }

    public void setBrowserNotificationsEnabled(boolean browserNotificationsEnabled) {
        this.browserNotificationsEnabled = browserNotificationsEnabled;
    }

    public boolean isInAppNotificationsEnabled() {
        return inAppNotificationsEnabled;
    }

    public void setInAppNotificationsEnabled(boolean inAppNotificationsEnabled) {
        this.inAppNotificationsEnabled = inAppNotificationsEnabled;
    }

    public boolean isDarkMode() {
        return darkMode;
    }

    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }

    public String getReminderSound() {
        return reminderSound;
    }

    public void setReminderSound(String reminderSound) {
        this.reminderSound = reminderSound;
    }
}
