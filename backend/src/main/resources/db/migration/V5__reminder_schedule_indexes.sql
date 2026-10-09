-- Support per-user schedule lookups and duplicate dose checks by scheduled slot.
CREATE INDEX idx_reminders_user_schedule
    ON reminders (user_id, is_active, start_date, end_date);

CREATE INDEX idx_dose_logs_reminder_time
    ON dose_logs (reminder_id, scheduled_time);
