import React from 'react';
import { User } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isAuthenticated,
  onLogout,
  onOpenAuth
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container navbar-shell" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '4.25rem'
      }}>
        {/* Logo */}
        <div className="navbar-brand"
          onClick={() => setActiveTab('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
          }}>
            M+
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Medi<span style={{ color: varColor('--primary') }}>Finder</span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
              Smart Healthcare & Pharmacy Portal
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-tabs" aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'medicines', label: 'Medicine Store', icon: '💊' },
            { id: 'pharmacies', label: 'Pharmacy Locator', icon: '📍' },
            { id: 'reminders', label: 'Adherence Reminders', icon: '⏰' },
            ...(isAuthenticated ? [{ id: 'account', label: 'Profile & Settings', icon: '◉' }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 0.875rem',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Auth / Profile action */}
        <div className="navbar-account" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{user.profile?.fullName || user.username}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
              <button onClick={onLogout} className="btn btn-secondary btn-sm">
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary btn-sm">
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

function varColor(name: string) {
  return `var(${name})`;
}
