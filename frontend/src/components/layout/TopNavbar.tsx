/**
 * MediFinder Healthcare OS - Global Top Navigation Bar Component
 */

import React, { useState } from 'react';
import { User } from '../../types';

interface TopNavbarProps {
  user: User | null;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddReminder: () => void;
  onSearchGlobal: (query: string) => void;
  onNavigate: (tab: string) => void;
  unreadCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  isAuthenticated,
  onOpenAuth,
  onLogout,
  onOpenAddReminder,
  onSearchGlobal,
  onNavigate,
  unreadCount = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchGlobal(searchQuery.trim());
      onNavigate('medicines');
    }
  };

  const displayName = user?.profile?.fullName || (isAuthenticated ? user?.username : 'Patient');
  const roleLabel = isAuthenticated ? (user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Patient') : 'Healthcare User';
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P';

  return (
    <header className="app-topbar">
      {/* Global Search Bar */}
      <form className="topbar-search-form" onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="topbar-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines, brands, active ingredients or pharmacies..."
          />
          <button type="submit" className="search-find-btn">
            Find
          </button>
        </div>
      </form>

      {/* Right Actions & Profile Hub */}
      <div className="topbar-actions">
        {/* Demo Catalogue Badge */}
        <div className="demo-catalogue-badge" onClick={() => onNavigate('medicines')} title="Browsing Verified Medical Database">
          DEMO CATALOGUE
        </div>

        {/* Add Reminder Action */}
        <button
          type="button"
          className="btn-add-reminder-nav"
          onClick={onOpenAddReminder}
        >
          <span>+</span> Add Reminder
        </button>

        {/* Support Mail Button */}
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => onNavigate('support')}
          title="Help & Healthcare Records"
          aria-label="Help"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </button>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="topbar-icon-btn notif-bell"
          onClick={() => onNavigate('notifications')}
          title="Notifications & Dose Alarms"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && <span className="notif-dot"></span>}
        </button>

        {/* Patient Profile Chip */}
        <div className="profile-chip-container">
          <div
            className="patient-profile-chip"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="patient-avatar">
              {user?.profile?.avatarUrl ? (
                <img src={user.profile.avatarUrl} alt={displayName} className="patient-avatar-img" />
              ) : (
                initials
              )}
            </div>
            <div className="patient-info">
              <div className="patient-name">{displayName}</div>
              <div className="patient-role">{roleLabel}</div>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-header">
                <div className="dropdown-avatar-row">
                  <div className="dropdown-avatar-preview">
                    {user?.profile?.avatarUrl ? (
                      <img src={user.profile.avatarUrl} alt={displayName} className="dropdown-avatar-img" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="dropdown-user-names">
                    <strong>{displayName}</strong>
                    <span>{user?.email || 'patient.alex@medifinder.local'}</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => { setIsProfileMenuOpen(false); onNavigate('profile'); }}
              >
                👤 Medical Profile
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => { setIsProfileMenuOpen(false); onNavigate('settings'); }}
              >
                ⚙️ Account Settings
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => { setIsProfileMenuOpen(false); onNavigate('records'); }}
              >
                📋 Health Records
              </button>
              <div className="dropdown-divider"></div>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="dropdown-item text-danger"
                  onClick={() => { setIsProfileMenuOpen(false); onLogout(); }}
                >
                  🚪 Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  className="dropdown-item text-primary"
                  onClick={() => { setIsProfileMenuOpen(false); onOpenAuth(); }}
                >
                  🔑 Sign In / Register
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
