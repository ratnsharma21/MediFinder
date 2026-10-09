import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { DoseLog, Reminder, User } from '../../types';
import { reminderService } from '../../services/reminderService';
import { medicineService } from '../../services/medicineService';
import { ApiError } from '../../services/api';

interface DashboardModuleProps {
  user: User | null;
  isAuthenticated: boolean;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onSessionExpired: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  user,
  isAuthenticated,
  onNavigate,
  onOpenAuth,
  onSessionExpired,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [savedMedicineCount, setSavedMedicineCount] = useState(0);
  const [loading, setLoading] = useState(isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let current = true;

    if (!isAuthenticated) {
      setReminders([]);
      setDoseLogs([]);
      setSavedMedicineCount(0);
      setLoading(false);
      setError(null);
      return () => { current = false; };
    }

    setLoading(true);
    setError(null);
    Promise.all([
      reminderService.getReminders(),
      reminderService.getDoseLogs(),
      medicineService.getSavedMedicines(),
    ]).then(([userReminders, userDoseLogs, savedMedicines]) => {
      if (!current) return;
      setReminders(userReminders);
      setDoseLogs(userDoseLogs);
      setSavedMedicineCount(savedMedicines.length);
    }).catch((requestError: unknown) => {
      if (!current) return;
      if (requestError instanceof ApiError && requestError.status === 401) {
        onSessionExpired();
        setError('Your session expired. Sign in again to view your dashboard.');
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Dashboard data could not be loaded.');
      }
    }).finally(() => {
      if (current) setLoading(false);
    });

    return () => { current = false; };
  }, [isAuthenticated, onSessionExpired, reloadKey]);

  const activeReminderCount = reminders.filter(reminder => reminder.active).length;
  const today = new Date().toLocaleDateString();
  const todayDoseCount = doseLogs.filter(log => new Date(log.scheduledTime).toLocaleDateString() === today).length;
  const recentDoseLogs = [...doseLogs]
    .sort((first, second) => Date.parse(second.scheduledTime) - Date.parse(first.scheduledTime))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="badge" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>
            MediFinder care overview
          </span>
          <h1>{isAuthenticated && user ? `Welcome back, ${user.profile?.fullName || user.username}` : 'Your care, in one place'}</h1>
          <p>Manage your medication schedule, review dose history, and keep useful medicines close at hand.</p>
          <div className="dashboard-actions">
            <button onClick={() => onNavigate('reminders')} className="btn dashboard-action-primary">View reminders</button>
            <button onClick={() => onNavigate('medicines')} className="btn dashboard-action-secondary">Find medicines</button>
            {!isAuthenticated && <button onClick={onOpenAuth} className="btn dashboard-action-primary">Sign in</button>}
          </div>
        </div>
      </section>

      {!isAuthenticated ? (
        <Card>
          <div className="dashboard-empty">
            <h2>Sign in to see your personal dashboard</h2>
            <p>Your reminders, dose history, and saved medicines appear here after you sign in.</p>
            <button onClick={onOpenAuth} className="btn btn-primary">Sign in or create an account</button>
          </div>
        </Card>
      ) : (
        <>
          {error ? (
            <div className="dashboard-error" role="alert">
              <span>{error}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setReloadKey(value => value + 1)}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <section className="grid grid-cols-3" aria-label="Personal activity summary">
            <Card>
              <div className="dashboard-stat-label">Active reminders</div>
              <div className="dashboard-stat-value">{loading ? '...' : activeReminderCount}</div>
              <button className="dashboard-text-link" onClick={() => onNavigate('reminders')}>Manage schedule</button>
            </Card>
            <Card>
              <div className="dashboard-stat-label">Doses logged today</div>
              <div className="dashboard-stat-value">{loading ? '...' : todayDoseCount}</div>
              <button className="dashboard-text-link" onClick={() => onNavigate('reminders')}>Review dose history</button>
            </Card>
            <Card>
              <div className="dashboard-stat-label">Saved medicines</div>
              <div className="dashboard-stat-value">{loading ? '...' : savedMedicineCount}</div>
              <button className="dashboard-text-link" onClick={() => onNavigate('medicines')}>Browse medicines</button>
            </Card>
              </section>

              <section className="grid grid-cols-2 dashboard-detail-grid">
            <Card title="Medication schedule" subtitle="Your active reminders">
              {loading ? (
                <p className="dashboard-muted" role="status">Loading reminders...</p>
              ) : reminders.filter(reminder => reminder.active).length === 0 ? (
                <div className="dashboard-empty-inline">
                  <p>No active reminders yet.</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('reminders')}>Create a reminder</button>
                </div>
              ) : (
                <div className="dashboard-list">
                  {reminders.filter(reminder => reminder.active).slice(0, 4).map(reminder => (
                    <div className="dashboard-list-row" key={reminder.id}>
                      <div>
                        <strong>{reminder.customMedicineName}</strong>
                        <span>{reminder.dosage} · {reminder.frequency.replace(/_/g, ' ').toLowerCase()}</span>
                      </div>
                      <span className="badge badge-secondary">{reminder.timeOfDay}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Recent dose history" subtitle="Most recent recorded doses">
              {loading ? (
                <p className="dashboard-muted" role="status">Loading dose history...</p>
              ) : recentDoseLogs.length === 0 ? (
                <div className="dashboard-empty-inline">
                  <p>No doses have been logged yet.</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('reminders')}>Open reminders</button>
                </div>
              ) : (
                <div className="dashboard-list">
                  {recentDoseLogs.map(log => (
                    <div className="dashboard-list-row" key={log.id}>
                      <div>
                        <strong>{log.medicineName}</strong>
                        <span>{new Date(log.scheduledTime).toLocaleString()}</span>
                      </div>
                      <span className={`badge ${log.status === 'TAKEN' ? 'badge-success' : log.status === 'SKIPPED' ? 'badge-warning' : 'badge-danger'}`}>
                        {log.status.toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
              </section>

              <section className="dashboard-navigation" aria-label="Explore MediFinder">
            <div>
              <h2>Find care nearby</h2>
              <p>Search pharmacies and review location details.</p>
            </div>
            <button onClick={() => onNavigate('pharmacies')} className="btn btn-secondary">Open pharmacy locator</button>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};
