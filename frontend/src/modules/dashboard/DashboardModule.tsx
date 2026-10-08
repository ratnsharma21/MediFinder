// ==============================================================================
// MediFinder / MediCare - Dashboard Module
// Primary Owner: Member 5 (Sachin) - feature/dashboard-ui, feature/profile-settings
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { User, Reminder, DoseLog } from '../../types';
import { reminderService } from '../../services/reminderService';
import { medicineService } from '../../services/medicineService';
import { pharmacyService } from '../../services/pharmacyService';

interface DashboardModuleProps {
  user: User | null;
  isAuthenticated: boolean;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  user,
  isAuthenticated,
  onNavigate,
  onOpenAuth
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [medicineCount, setMedicineCount] = useState<number>(0);
  const [pharmacyCount, setPharmacyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const medRes = await medicineService.getMedicines({ size: 1 });
        setMedicineCount(medRes.totalElements || 8);

        const pharmRes = await pharmacyService.getPharmacies({ size: 1 });
        setPharmacyCount(pharmRes.totalElements || 6);

        if (isAuthenticated) {
          const rems = await reminderService.getReminders();
          setReminders(rems);
          const logs = await reminderService.getDoseLogs();
          setDoseLogs(logs);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [isAuthenticated]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        color: '#ffffff',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', marginBottom: '0.75rem' }}>
            MediCare Platform v1.0 • Ratn Foundation
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
            {isAuthenticated && user
              ? `Welcome back, ${user.profile?.fullName || user.username}!`
              : 'Smart Medicine Discovery & Pharmacy Locator'}
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Compare verified online pharmacy prices, find nearby 24x7 medical stores with GPS mapping, and stay on top of daily medication schedules.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('medicines')} className="btn" style={{ background: '#ffffff', color: '#0369a1', fontWeight: 700 }}>
              🔍 Search Medicines
            </button>
            <button onClick={() => onNavigate('pharmacies')} className="btn" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              📍 Locate Nearby Stores
            </button>
            {!isAuthenticated && (
              <button onClick={onOpenAuth} className="btn" style={{ background: '#ffffff', color: '#0f766e', fontWeight: 700 }}>
                ⏰ Set Dose Alarms
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-4">
        <Card>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Catalogue Medicines</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {loading ? '...' : medicineCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Indexed formulations</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Partner Pharmacies</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>
            {loading ? '...' : pharmacyCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Geo-located medical stores</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Reminders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>
            {isAuthenticated ? reminders.filter(r => r.active).length : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            {isAuthenticated ? 'Scheduled dose alerts' : 'Sign in to track'}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Logged Doses</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {isAuthenticated ? doseLogs.length : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            {isAuthenticated ? 'Adherence history' : 'Sign in to view'}
          </div>
        </Card>
      </div>

      {/* Module Overview for Team Members */}
      <div className="grid grid-cols-2">
        <Card title="📦 Medicine Store & Price Comparison (Member 2)" subtitle="Managed on branch: feature/medicine-catalogue">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Search medicines by brand name, generic compound, or category. Compare pricing across online partners (Tata 1mg, PharmEasy, Netmeds, Apollo).
          </p>
          <button onClick={() => onNavigate('medicines')} className="btn btn-secondary btn-sm">
            Open Medicine Catalogue →
          </button>
        </Card>

        <Card title="📍 Pharmacy Locator & Map Integration (Member 3)" subtitle="Managed on branch: feature/pharmacy-locator">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Locate physical pharmacies near you using GPS coordinates, filter 24x7 emergency medical counters, and access direct contact numbers.
          </p>
          <button onClick={() => onNavigate('pharmacies')} className="btn btn-secondary btn-sm">
            Open Pharmacy Locator →
          </button>
        </Card>
      </div>
    </div>
  );
};
