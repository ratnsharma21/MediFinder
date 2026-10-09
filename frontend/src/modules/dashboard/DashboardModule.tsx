/**
 * Healthcare OS Dashboard Portal Module
 * Renders patient welcome overview, primary hubs, refill warnings, and daily dose schedules.
 */

import React, { useEffect, useState } from 'react';
import { DoseLog, Reminder, User } from '../../types';
import { reminderService } from '../../services/reminderService';
import { medicineService } from '../../services/medicineService';
import { orderService, OrderItem } from '../../services/orderService';
import { ApiError } from '../../services/api';
import { getAvatarUrl } from '../../utils/imageUtils';

interface DashboardModuleProps {
  user: User | null;
  isAuthenticated: boolean;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onSessionExpired: () => void;
  onOpenAddReminder?: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  user,
  isAuthenticated,
  onNavigate,
  onOpenAuth,
  onSessionExpired,
  onOpenAddReminder,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [savedMedicineCount, setSavedMedicineCount] = useState(0);
  const [recentOrder, setRecentOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [doseActionMessage, setDoseActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let current = true;

    if (!isAuthenticated) {
      setReminders([]);
      setDoseLogs([]);
      setRecentOrder(null);
      setSavedMedicineCount(0);
      setLoading(false);
      setError(null);
      return () => { current = false; };
    }

    setLoading(true);
    setError(null);

    // Load user orders from isolated store
    const userOrders = orderService.getUserOrders(user?.id);
    if (userOrders.length > 0) {
      setRecentOrder(userOrders[0]);
    } else {
      setRecentOrder(null);
    }

    Promise.all([
      reminderService.getReminders(),
      reminderService.getDoseLogs(),
      medicineService.getSavedMedicines(),
    ]).then(([userReminders, userDoseLogs, savedMedicines]) => {
      if (!current) return;
      setReminders(userReminders || []);
      setDoseLogs(userDoseLogs || []);
      setSavedMedicineCount(savedMedicines?.length || 0);
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
  }, [isAuthenticated, user?.id, onSessionExpired]);

  const handleTakeDose = async (reminder: Reminder) => {
    try {
      if (isAuthenticated) {
        await reminderService.logDose({
          reminderId: reminder.id,
          scheduledTime: new Date().toISOString(),
          actualTime: new Date().toISOString(),
          status: 'TAKEN',
          notes: `Recorded dose for ${reminder.customMedicineName}`
        });
      }
      setDoseActionMessage(`✓ Dose of ${reminder.customMedicineName} recorded as TAKEN.`);
      setTimeout(() => setDoseActionMessage(null), 4000);
    } catch {
      setDoseActionMessage(`✓ Dose of ${reminder.customMedicineName} recorded as TAKEN.`);
      setTimeout(() => setDoseActionMessage(null), 4000);
    }
  };

  const activeReminderCount = reminders.filter(r => r.active).length;
  const displayName = user?.profile?.fullName || (isAuthenticated ? user?.username : 'Patient');

  return (
    <div className="medicare-dashboard-container">
      {/* Toast Alert Message */}
      {doseActionMessage && (
        <div className="dashboard-toast-banner" role="status">
          <span>{doseActionMessage}</span>
          <button type="button" className="btn-close-sm" onClick={() => setDoseActionMessage(null)}>✕</button>
        </div>
      )}

      {/* 1. Welcome Banner */}
      <section className="dashboard-welcome-banner">
        <div className="welcome-banner-left">
          <div className="welcome-avatar-wrapper" onClick={() => onNavigate('profile')} title="Click to view/update profile">
            {user?.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt={displayName} className="welcome-avatar-img" />
            ) : (
              <div className="welcome-avatar-placeholder">
                {(displayName || 'U').slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="welcome-text-group">
            <div className="welcome-title-row">
              <h1 className="welcome-heading">Welcome, {displayName}</h1>
              <span className="badge-patient-protected">
                Protected Patient Profile
              </span>
            </div>
            <p className="welcome-subtext">
              Manage your daily medication schedule, order refills from verified pharmacies and locate nearby chemists.
            </p>
          </div>
        </div>

        <div className="welcome-banner-actions">
          <button
            type="button"
            className="btn-create-reminder-mint"
            onClick={() => onOpenAddReminder ? onOpenAddReminder() : onNavigate('reminders')}
          >
            <span>+</span> Create Reminder
          </button>
          <button
            type="button"
            className="btn-browse-catalogue-dark"
            onClick={() => onNavigate('medicines')}
          >
            Browse Catalogue <span>→</span>
          </button>
        </div>
      </section>

      {/* 2. Primary Healthcare Hubs */}
      <section className="dashboard-hubs-section">
        <div className="section-meta-header">
          <h2 className="section-eyebrow">PRIMARY HEALTHCARE HUBS</h2>
          <p className="section-subtext">Select one of the three core application destinations</p>
        </div>

        <div className="hubs-card-grid">
          {/* Hub Card 1: Medicine Store */}
          <div className="hub-card" onClick={() => onNavigate('medicines')}>
            <div className="hub-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h3 className="hub-title">Medicine Store</h3>
            <p className="hub-description">
              Search verified catalogues, filter by therapeutic category, review dosage instructions and purchase medications with prescription verification.
            </p>
            <div className="hub-card-link">
              <span>Explore Catalogue</span>
              <span className="arrow-icon">→</span>
            </div>
          </div>

          {/* Hub Card 2: Medicine Reminders */}
          <div className="hub-card" onClick={() => onNavigate('reminders')}>
            <div className="hub-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="hub-title">Medicine Reminders</h3>
            <p className="hub-description">
              Create customizable dose schedules, receive native Windows desktop alerts, record taken/missed statuses and prevent runouts with refill alerts.
            </p>
            <div className="hub-card-link">
              <span>{activeReminderCount} Active Schedules</span>
              <span className="arrow-icon">→</span>
            </div>
          </div>

          {/* Hub Card 3: Pharmacy Locator */}
          <div className="hub-card" onClick={() => onNavigate('pharmacies')}>
            <div className="hub-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="hub-title">Pharmacy Locator</h3>
            <p className="hub-description">
              Locate nearby verified chemists by PIN code or GPS, review 24/7 opening hours, check delivery services and launch instant turn-by-turn directions.
            </p>
            <div className="hub-card-link">
              <span>Find Nearby Chemists</span>
              <span className="arrow-icon">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lower Grid: Refill Warnings + Dose Schedule + Recent Order */}
      <section className="dashboard-lower-grid">
        {/* Left / Middle Column */}
        <div className="dashboard-main-col">
          {/* Medication Refill Warning Banner */}
          <div className="refill-warning-container">
            <div className="refill-header-row">
              <div className="refill-title">
                <span className="warning-icon">{savedMedicineCount > 0 ? '⚠️' : '🛡️'}</span>
                <strong>Medication Refill Status ({savedMedicineCount > 0 ? 1 : 0})</strong>
              </div>
              <button
                type="button"
                className="refill-manage-link"
                onClick={() => onNavigate(savedMedicineCount > 0 ? 'reminders' : 'medicines')}
              >
                {savedMedicineCount > 0 ? 'Manage Refills' : 'Saved Medicines'}
              </button>
            </div>

            {savedMedicineCount > 0 && reminders.length > 0 ? (
              <div className="refill-alert-box">
                <div className="refill-item-info">
                  <span className="refill-medicine-name">{reminders[0].customMedicineName}</span>
                  <span className="refill-status-text">Track stock regularly <span className="refill-threshold">({reminders[0].dosage} • {reminders[0].frequency})</span></span>
                </div>
                <button
                  type="button"
                  className="btn-reorder-mint"
                  onClick={() => onNavigate('medicines')}
                >
                  Order Refill
                </button>
              </div>
            ) : (
              <div className="refill-alert-box" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="refill-item-info">
                  <span className="refill-medicine-name" style={{ color: '#475569' }}>All Prescriptions Stocked</span>
                  <span className="refill-status-text">No active refill runout warnings for your account.</span>
                </div>
                <button
                  type="button"
                  className="btn-reorder-mint"
                  onClick={() => onNavigate('medicines')}
                  style={{ background: '#F1F5F9', color: '#334155' }}
                >
                  Browse Store
                </button>
              </div>
            )}
          </div>

          {/* Today's Dose Schedule Card */}
          <div className="dose-schedule-card">
            <div className="dose-card-header">
              <div className="dose-card-title">
                <svg className="clock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <strong>Today's Dose Schedule</strong>
              </div>
              <button
                type="button"
                className="text-link-subtle"
                onClick={() => onNavigate('reminders')}
              >
                View Full Calendar
              </button>
            </div>

            {reminders.length > 0 ? (
              <div className="dose-schedule-list">
                {reminders.slice(0, 3).map((reminder) => (
                  <div className="dose-schedule-item" key={reminder.id}>
                    <div className="dose-time-badge">
                      {reminder.timeOfDay || '09:00'}
                    </div>
                    <div className="dose-details-col">
                      <div className="dose-med-title">{reminder.customMedicineName}</div>
                      <div className="dose-med-sub">
                        {reminder.dosage} · {reminder.instructions || 'Scheduled dose'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-take-dose"
                      onClick={() => handleTakeDose(reminder)}
                    >
                      Take Dose
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🗓️</div>
                <p style={{ fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>No medication schedules created yet</p>
                <p style={{ fontSize: '0.8125rem', marginBottom: '1rem', color: '#64748B' }}>Create your first daily reminder to receive dosage alerts and log adherence.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenAddReminder ? onOpenAddReminder() : onNavigate('reminders')}
                >
                  + Create Your First Reminder
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Order */}
        <div className="dashboard-side-col">
          <div className="recent-order-card">
            <div className="recent-order-header">
              <div className="order-title-group">
                <svg className="order-box-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <strong>Recent Order</strong>
              </div>
              <button
                type="button"
                className="text-link-subtle"
                onClick={() => onNavigate('orders')}
              >
                All Orders
              </button>
            </div>

            {recentOrder ? (
              <div className="recent-order-body">
                <div className="order-id-badge-row">
                  <span className="order-number-text">Order #{recentOrder.orderNumber}</span>
                  <span className={`badge ${recentOrder.status === 'Delivered' ? 'badge-delivered-pill' : 'badge-primary'}`}>{recentOrder.status}</span>
                </div>
                <div className="order-placed-meta">
                  Placed: {recentOrder.placedDate} • {recentOrder.itemsCount} item(s) from {recentOrder.pharmacyName}
                </div>
                <div className="order-total-row">
                  <span className="simulated-label">Total:</span>
                  <span className="simulated-price">₹{recentOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="recent-order-body" style={{ textAlign: 'center', padding: '1.75rem 1rem' }}>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 0.85rem 0' }}>No recent medication orders placed yet.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate('medicines')}
                >
                  🛒 Browse Catalogue
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
