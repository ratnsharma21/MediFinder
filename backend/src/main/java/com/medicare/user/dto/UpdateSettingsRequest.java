package com.medicare.user.dto;

public class UpdateSettingsRequest {
    private Boolean emailNotificationsEnabled;
    private Boolean smsNotificationsEnabled;
    private Boolean browserNotificationsEnabled;
    private Boolean inAppNotificationsEnabled;
    private Boolean darkMode;
    private String reminderSound;

    public UpdateSettingsRequest() {}

    public Boolean getEmailNotificationsEnabled() {
        return emailNotificationsEnabled;
    }

    public void setEmailNotificationsEnabled(Boolean emailNotificationsEnabled) {
        this.emailNotificationsEnabled = emailNotificationsEnabled;
    }

    public Boolean getSmsNotificationsEnabled() {
        return smsNotificationsEnabled;
    }

    public void setSmsNotificationsEnabled(Boolean smsNotificationsEnabled) {
        this.smsNotificationsEnabled = smsNotificationsEnabled;
    }

    public Boolean getBrowserNotificationsEnabled() {
        return browserNotificationsEnabled;
    }

    public void setBrowserNotificationsEnabled(Boolean browserNotificationsEnabled) {
        this.browserNotificationsEnabled = browserNotificationsEnabled;
    }

    public Boolean getInAppNotificationsEnabled() {
        return inAppNotificationsEnabled;
    }

    public void setInAppNotificationsEnabled(Boolean inAppNotificationsEnabled) {
        this.inAppNotificationsEnabled = inAppNotificationsEnabled;
    }

    public Boolean getDarkMode() {
        return darkMode;
    }

    public void setDarkMode(Boolean darkMode) {
        this.darkMode = darkMode;
    }

    public String getReminderSound() {
        return reminderSound;
    }

    public void setReminderSound(String reminderSound) {
        this.reminderSound = reminderSound;
    }
}
