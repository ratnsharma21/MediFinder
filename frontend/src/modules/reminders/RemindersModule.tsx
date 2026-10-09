// ==============================================================================
// MediFinder / MediCare - Medicine Reminders & Dose Adherence Module
// Primary Owner: Member 4 (Sameer) - feature/medicine-reminders, feature/dose-tracking
// Backend Integration: /api/reminders, /api/dose-logs
// ==============================================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Reminder, DoseLog, DoseStatus, User } from '../../types';
import { reminderService, CreateReminderPayload } from '../../services/reminderService';
import { FREQUENCY_OPTIONS, DOSAGE_UNITS } from '../../utils/constants';

interface RemindersModuleProps {
  user: User | null;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatLocalDateTime = (date: Date): string => {
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${formatLocalDate(date)}T${hours}:${minutes}:00`;
};

const getNextOccurrence = (reminder: Reminder, now: Date): Date | null => {
  if (!reminder.active || reminder.frequency === 'AS_NEEDED') return null;

  const times = reminder.timeOfDay.split(',').map(value => value.trim()).filter(Boolean).sort();
  if (times.length === 0) return null;

  const today = formatLocalDate(now);
  const firstDate = reminder.startDate > today ? reminder.startDate : today;
  const date = new Date(`${firstDate}T00:00:00`);
  for (let dayOffset = 0; dayOffset < 2; dayOffset += 1) {
    const scheduledDate = new Date(date);
    scheduledDate.setDate(date.getDate() + dayOffset);
    const scheduledDateText = formatLocalDate(scheduledDate);
    if (reminder.endDate && scheduledDateText > reminder.endDate) return null;

    for (const time of times) {
      const occurrence = new Date(`${scheduledDateText}T${time}:00`);
      if (occurrence >= now) return occurrence;
    }
  }

  return null;
};

const getDoseLogOccurrence = (reminder: Reminder, now: Date): Date | null => {
  const today = formatLocalDate(now);
  if (!reminder.active || today < reminder.startDate || (reminder.endDate && today > reminder.endDate)) {
    return null;
  }
  if (reminder.frequency === 'AS_NEEDED') return now;

  const latestDueTime = reminder.timeOfDay.split(',')
    .map(value => value.trim())
    .filter(time => time <= `${`${now.getHours()}`.padStart(2, '0')}:${`${now.getMinutes()}`.padStart(2, '0')}`)
    .sort()
    .pop();
  if (latestDueTime) return new Date(`${today}T${latestDueTime}:00`);
  return getNextOccurrence(reminder, now);
};

export const RemindersModule: React.FC<RemindersModuleProps> = ({
  user,
  isAuthenticated,
  onOpenAuth
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyReminderId, setBusyReminderId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => typeof window === 'undefined' || !('Notification' in window)
    ? 'unsupported'
    : Notification.permission);
  const alertedSlots = useRef(new Set<string>());
  const alertedDate = useRef('');

  // Form State
  const [customMedicineName, setCustomMedicineName] = useState('');
  const [dosage, setDosage] = useState('1');
  const [unit, setUnit] = useState('tablet');
  const [frequency, setFrequency] = useState('ONCE_DAILY');
  const [timeOfDay, setTimeOfDay] = useState('08:00');
  const [startDate, setStartDate] = useState(formatLocalDate(new Date()));
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('');

  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setReminders([]);
      setDoseLogs([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [rems, logs] = await Promise.all([
        reminderService.getReminders(),
        reminderService.getDoseLogs()
      ]);
      setReminders(rems);
      setDoseLogs(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resetForm = () => {
    setCustomMedicineName('');
    setDosage('1');
    setUnit('tablet');
    setFrequency('ONCE_DAILY');
    setTimeOfDay('08:00');
    setStartDate(formatLocalDate(new Date()));
    setEndDate('');
    setInstructions('');
  };

  const openCreateForm = () => {
    setEditingReminder(null);
    resetForm();
    setError('');
    setShowCreateModal(true);
  };

  const openEditForm = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setCustomMedicineName(reminder.customMedicineName);
    const suffix = ` ${reminder.unit}`;
    setDosage(reminder.dosage.toLowerCase().endsWith(suffix.toLowerCase())
      ? reminder.dosage.slice(0, -suffix.length)
      : reminder.dosage);
    setUnit(reminder.unit);
    setFrequency(reminder.frequency);
    setTimeOfDay(reminder.timeOfDay);
    setStartDate(reminder.startDate);
    setEndDate(reminder.endDate || '');
    setInstructions(reminder.instructions || '');
    setError('');
    setShowCreateModal(true);
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload: CreateReminderPayload = {
        customMedicineName: customMedicineName.trim(),
        dosage: `${dosage.trim()} ${unit}`,
        unit,
        frequency,
        timeOfDay: timeOfDay.split(',').map(value => value.trim()).join(', '),
        startDate,
        endDate: endDate || null,
        instructions: instructions.trim() || undefined,
        active: editingReminder?.active ?? true
      };
      if (editingReminder) {
        await reminderService.updateReminder(editingReminder.id, payload);
        setSuccess('Reminder updated.');
      } else {
        await reminderService.createReminder(payload);
        setSuccess('Reminder created.');
      }
      setShowCreateModal(false);
      setEditingReminder(null);
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickLog = async (reminder: Reminder, status: DoseStatus) => {
    const loggedAt = new Date();
    const occurrence = getDoseLogOccurrence(reminder, loggedAt);
    if (!occurrence) {
      setError('There is no scheduled dose within this reminder date range.');
      return;
    }

    setBusyReminderId(reminder.id);
    setError('');
    setSuccess('');
    try {
      await reminderService.logDose({
        reminderId: reminder.id,
        scheduledTime: formatLocalDateTime(occurrence),
        actualTime: status === 'TAKEN' ? formatLocalDateTime(loggedAt) : undefined,
        status,
      });
      setSuccess(`Dose marked ${status.toLowerCase()}.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to record this dose. Please try again.');
    } finally {
      setBusyReminderId(null);
    }
  };

  const handleToggleReminder = async (reminder: Reminder) => {
    setBusyReminderId(reminder.id);
    setError('');
    setSuccess('');
    try {
      await reminderService.updateReminder(reminder.id, { active: !reminder.active });
      setSuccess(`Reminder ${reminder.active ? 'disabled' : 'enabled'}.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update this reminder. Please try again.');
    } finally {
      setBusyReminderId(null);
    }
  };

  const handleDeleteReminder = async (id: number) => {
    if (!confirm('Are you sure you want to remove this medication reminder schedule?')) return;
    setBusyReminderId(id);
    setError('');
    setSuccess('');
    try {
      await reminderService.deleteReminder(id);
      setSuccess('Reminder deleted.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete this reminder. Please try again.');
    } finally {
      setBusyReminderId(null);
    }
  };

  const requestBrowserNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      setError('Browser notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setError('');
        setSuccess('Browser reminders are enabled while MediFinder is open.');
      } else {
        setError(permission === 'denied'
          ? 'Browser notifications are blocked. Allow them in your browser settings to enable alerts.'
          : 'Browser notification permission was not granted.');
      }
    } catch (err) {
      setError(err instanceof Error
        ? `Unable to request browser notification permission: ${err.message}`
        : 'Unable to request browser notification permission.');
    }
  };

  useEffect(() => {
    if (!isAuthenticated || notificationPermission !== 'granted'
        || user?.settings?.browserNotificationsEnabled === false) return;

    const checkForDueReminders = () => {
      const now = new Date();
      const today = formatLocalDate(now);
      if (alertedDate.current !== today) {
        alertedSlots.current.clear();
        alertedDate.current = today;
      }

      const currentTime = `${`${now.getHours()}`.padStart(2, '0')}:${`${now.getMinutes()}`.padStart(2, '0')}`;
      reminders.forEach(reminder => {
        if (!reminder.active || reminder.frequency === 'AS_NEEDED'
            || today < reminder.startDate || (reminder.endDate && today > reminder.endDate)) return;

        const times = reminder.timeOfDay.split(',').map(value => value.trim());
        if (!times.includes(currentTime)) return;

        const slot = `${reminder.id}:${today}:${currentTime}`;
        if (alertedSlots.current.has(slot)) return;
        alertedSlots.current.add(slot);
        try {
          new Notification('Medication reminder', {
            body: `${reminder.customMedicineName} — ${reminder.dosage}`,
            tag: slot
          });
        } catch {
          alertedSlots.current.delete(slot);
          setError('A browser alert could not be displayed. Check your browser notification settings.');
        }
      });
    };

    checkForDueReminders();
    const timer = window.setInterval(checkForDueReminders, 15_000);
    return () => window.clearInterval(timer);
  }, [isAuthenticated, notificationPermission, reminders, user?.settings?.browserNotificationsEnabled]);

  if (!isAuthenticated) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Medication Adherence & Dose Reminders
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Create personalized dose alarms, set morning/evening schedules, and track medication intake history.
          </p>
          <button onClick={onOpenAuth} className="btn btn-primary">
            Sign In to Manage Reminders
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Medication Reminders & Dose Tracking
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Manage your schedules and record dose history. Browser alerts require this page to stay open.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => void requestBrowserNotifications()}
            className="btn btn-secondary"
            disabled={notificationPermission === 'unsupported'
              || notificationPermission === 'granted'
              || user?.settings?.browserNotificationsEnabled === false}
          >
            {notificationPermission === 'unsupported'
              ? 'Notifications unsupported'
              : user?.settings?.browserNotificationsEnabled === false
                ? 'Browser alerts disabled in settings'
              : notificationPermission === 'granted'
                ? 'Browser alerts enabled'
                : notificationPermission === 'denied'
                  ? 'Allow alerts in browser settings'
                  : 'Enable browser alerts'}
          </button>
          <button onClick={openCreateForm} className="btn btn-primary">
            + Add Medication Schedule
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-light)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}
      {success && (
        <div role="status" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
          {success}
        </div>
      )}

      <div className="grid grid-cols-3">
        {/* Reminders Column (2 cols) */}
        <div className="reminder-schedules-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Medication Schedules ({reminders.filter(reminder => reminder.active).length} active)
          </h2>

          {loading ? (
            <div role="status" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading schedules...
            </div>
          ) : reminders.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No medication schedules created yet.</p>
                <button onClick={openCreateForm} className="btn btn-secondary btn-sm">
                  Add your first reminder
                </button>
              </div>
            </Card>
          ) : (
            reminders.map(rem => (
              <Card key={rem.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`badge ${rem.active ? 'badge-primary' : 'badge-secondary'}`}>
                        {rem.frequency.replace(/_/g, ' ')}
                      </span>
                      <span className="badge badge-secondary">🕒 {rem.timeOfDay}</span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {rem.customMedicineName}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Dosage: <strong>{rem.dosage}</strong> • Started: {rem.startDate}
                      {rem.endDate && <> • Ends: {rem.endDate}</>}
                    </div>
                    {rem.active && getNextOccurrence(rem, new Date()) && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--primary)', marginTop: '0.375rem' }}>
                        Next scheduled: {getNextOccurrence(rem, new Date())?.toLocaleString()}
                      </div>
                    )}
                    {rem.instructions && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--secondary)', marginTop: '0.375rem' }}>
                        ℹ️ {rem.instructions}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleQuickLog(rem, 'TAKEN')}
                      className="btn btn-sm"
                      disabled={!rem.active || busyReminderId === rem.id}
                      style={{ background: 'var(--success-light)', color: '#065f46', border: '1px solid #a7f3d0' }}
                    >
                      ✓ Log Taken
                    </button>
                    <button
                      onClick={() => handleQuickLog(rem, 'SKIPPED')}
                      className="btn btn-sm"
                      disabled={!rem.active || busyReminderId === rem.id}
                      style={{ background: 'var(--warning-light)', color: '#92400e', border: '1px solid #fde68a' }}
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => handleQuickLog(rem, 'MISSED')}
                      className="btn btn-sm btn-secondary"
                      disabled={!rem.active || busyReminderId === rem.id}
                    >
                      Missed
                    </button>
                    <button
                      onClick={() => openEditForm(rem)}
                      className="btn btn-sm btn-secondary"
                      disabled={busyReminderId === rem.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void handleToggleReminder(rem)}
                      className="btn btn-sm btn-secondary"
                      disabled={busyReminderId === rem.id}
                    >
                      {rem.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      disabled={busyReminderId === rem.id}
                      style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.25rem' }}
                      title="Delete Reminder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Dose History Column (1 col) */}
        <div>
          <Card title="Adherence History" subtitle="Recent intake confirmations">
            {doseLogs.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                No dose logs recorded yet. Use the dose controls on an active reminder to record a dose.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {doseLogs.slice(0, 8).map(log => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.625rem',
                      background: 'var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{log.medicineName}</div>
                      <div style={{ color: 'var(--text-light)', fontSize: '0.6875rem' }}>
                        {log.scheduledTime ? new Date(log.scheduledTime).toLocaleString() : 'Today'}
                      </div>
                    </div>
                    <span className={`badge ${
                      log.status === 'TAKEN' ? 'badge-success' : log.status === 'SKIPPED' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Create Reminder Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '500px',
            padding: '2rem',
            position: 'relative'
          }} role="dialog" aria-modal="true" aria-labelledby="reminder-form-title">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setEditingReminder(null);
              }}
              aria-label="Close reminder form"
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h2 id="reminder-form-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingReminder ? 'Edit Medication Reminder' : 'Add Medication Reminder Schedule'}
            </h2>

            <form onSubmit={handleSaveReminder}>
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  maxLength={150}
                  placeholder="e.g. Dolo 650, Augmentin, Metformin"
                  value={customMedicineName}
                  onChange={(e) => setCustomMedicineName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dose Quantity *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. 1"
                    maxLength={38}
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit *</label>
                  <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    {DOSAGE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Frequency *</label>
                  <select className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    {FREQUENCY_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time of Day *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    maxLength={100}
                    placeholder="08:00 or 08:00, 20:00"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)' }}>
                    Enter one or more 24-hour times, separated by commas.
                  </small>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date (optional)</label>
                  <input
                    type="date"
                    className="form-input"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions</label>
                <input
                  type="text"
                  className="form-input"
                  maxLength={255}
                  placeholder="e.g. Take after breakfast with water"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {error && (
                <div role="alert" style={{ margin: '0.75rem 0', color: 'var(--danger)' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', marginTop: '0.5rem' }}>
                {saving ? 'Saving...' : editingReminder ? 'Save Changes' : 'Save Medication Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
