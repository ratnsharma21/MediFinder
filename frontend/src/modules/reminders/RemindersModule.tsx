// ==============================================================================
// MediFinder / MediCare - Medicine Reminders & Dose Adherence Module
// Primary Owner: Member 4 (Sameer) - feature/medicine-reminders, feature/dose-tracking
// Backend Integration: /api/reminders, /api/dose-logs
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Reminder, DoseLog, DoseStatus, User } from '../../types';
import { reminderService, CreateReminderPayload } from '../../services/reminderService';
import { FREQUENCY_OPTIONS, DOSAGE_UNITS } from '../../utils/constants';

interface RemindersModuleProps {
  user: User | null;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

export const RemindersModule: React.FC<RemindersModuleProps> = ({
  isAuthenticated,
  onOpenAuth
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [customMedicineName, setCustomMedicineName] = useState('');
  const [dosage, setDosage] = useState('1');
  const [unit, setUnit] = useState('tablet');
  const [frequency, setFrequency] = useState('ONCE_DAILY');
  const [timeOfDay, setTimeOfDay] = useState('08:00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructions, setInstructions] = useState('');

  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const rems = await reminderService.getReminders();
      setReminders(rems);
      const logs = await reminderService.getDoseLogs();
      setDoseLogs(logs);
    } catch (err) {
      console.error('Failed to load reminders data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateReminderPayload = {
        customMedicineName,
        dosage: `${dosage} ${unit}`,
        unit,
        frequency,
        timeOfDay,
        startDate,
        instructions: instructions.trim() || undefined,
        active: true
      };
      await reminderService.createReminder(payload);
      setShowCreateModal(false);
      // Reset form
      setCustomMedicineName('');
      setInstructions('');
      loadData();
    } catch (err) {
      console.error('Failed to create reminder', err);
    }
  };

  const handleQuickLog = async (reminder: Reminder, status: DoseStatus) => {
    try {
      await reminderService.logDose({
        reminderId: reminder.id,
        scheduledTime: new Date().toISOString(),
        status,
        notes: `Logged ${status.toLowerCase()} from adherence panel`
      });
      loadData();
    } catch (err) {
      console.error('Failed to log dose', err);
    }
  };

  const handleDeleteReminder = async (id: number) => {
    if (!confirm('Are you sure you want to remove this medication reminder schedule?')) return;
    try {
      await reminderService.deleteReminder(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete reminder', err);
    }
  };

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
            Stay consistent with prescribed dosage schedules and log intake status in real time.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          + Add Medication Schedule
        </button>
      </div>

      <div className="grid grid-cols-3">
        {/* Reminders Column (2 cols) */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Active Medication Schedules ({reminders.length})</h2>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading schedules...
            </div>
          ) : reminders.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No medication schedules created yet.</p>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-secondary btn-sm">
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
                      <span className="badge badge-primary">{rem.frequency.replace('_', ' ')}</span>
                      <span className="badge badge-secondary">🕒 {rem.timeOfDay}</span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {rem.customMedicineName}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Dosage: <strong>{rem.dosage}</strong> • Started: {rem.startDate}
                    </div>
                    {rem.instructions && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--secondary)', marginTop: '0.375rem' }}>
                        ℹ️ {rem.instructions}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => handleQuickLog(rem, 'TAKEN')}
                      className="btn btn-sm"
                      style={{ background: 'var(--success-light)', color: '#065f46', border: '1px solid #a7f3d0' }}
                    >
                      ✓ Log Taken
                    </button>
                    <button
                      onClick={() => handleQuickLog(rem, 'SKIPPED')}
                      className="btn btn-sm"
                      style={{ background: 'var(--warning-light)', color: '#92400e', border: '1px solid #fde68a' }}
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
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
                No dose logs recorded yet. Use the "Log Taken" button to record doses.
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
                        {log.scheduledTime ? new Date(log.scheduledTime).toLocaleDateString() : 'Today'}
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
          }}>
            <button
              onClick={() => setShowCreateModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Add Medication Reminder Schedule
            </h2>

            <form onSubmit={handleCreateReminder}>
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
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
                    type="time"
                    className="form-input"
                    required
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                </div>
              </div>

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
                <label className="form-label">Instructions</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Take after breakfast with water"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Save Medication Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
