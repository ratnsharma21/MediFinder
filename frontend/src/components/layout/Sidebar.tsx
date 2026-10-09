import React from 'react';
import { User } from '../../types';
import { getAvatarUrl } from '../../utils/imageUtils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: User | null;
  isAuthenticated?: boolean;
  activeRemindersCount?: number;
  unreadNotificationsCount?: number;
  ordersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isAuthenticated,
  activeRemindersCount = 0,
  unreadNotificationsCount = 0,
  ordersCount = 0
}) => {
  const displayName = user?.profile?.fullName || (isAuthenticated ? user?.username : 'Patient');
  const roleLabel = isAuthenticated ? (user?.role === 'ROLE_ADMIN' ? 'Admin / Lead' : 'Verified Patient') : 'Healthcare User';
  const avatarUrl = getAvatarUrl(user?.profile?.avatarUrl);
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P';
  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      {/* Brand Logo Header */}
      <div className="sidebar-brand" onClick={() => setActiveTab('dashboard')}>
        <div className="brand-logo-icon">
          <img src="/logo.png" alt="MediFinder Logo" className="brand-logo-img" />
        </div>
        <div className="brand-text">
          <div className="brand-name">Medi<span className="brand-accent">Finder</span></div>
          <div className="brand-subtitle">HEALTHCARE OS</div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {/* Core Healthcare Section */}
        <div className="nav-group">
          <div className="nav-group-title">CORE HEALTHCARE</div>

          <button
            type="button"
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
              </svg>
            </span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'medicines' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicines')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </span>
            <span className="nav-label">Medicine Store</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </span>
            <span className="nav-label">Medicine Reminders</span>
            {activeRemindersCount > 0 && (
              <span className="nav-badge badge-orange">{activeRemindersCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'pharmacies' ? 'active' : ''}`}
            onClick={() => setActiveTab('pharmacies')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <span className="nav-label">Pharmacy Locator</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </span>
            <span className="nav-label">Orders</span>
            {ordersCount > 0 && (
              <span className="nav-badge badge-slate">{ordersCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
            <span className="nav-label">Medical Records</span>
          </button>
        </div>

        {/* Account & Support Section */}
        <div className="nav-group">
          <div className="nav-group-title">ACCOUNT & SUPPORT</div>

          <button
            type="button"
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </span>
            <span className="nav-label">Notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="nav-badge badge-red">{unreadNotificationsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'profile' || activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <span className="nav-label">Profile</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </span>
            <span className="nav-label">Settings</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </span>
            <span className="nav-label">Help and Support</span>
          </button>
        </div>
      </nav>

      {/* Bottom Status Card */}
      <div className="sidebar-footer">
        <div className="security-status-box">
          <div className="security-status-indicator"></div>
          <div className="security-status-text">
            <div className="status-title">Local Demo Mode</div>
            <div className="status-subtitle">Encrypted Local DB</div>
          </div>
          <span className="security-shield-icon">🛡️</span>
        </div>
      </div>
    </aside>
  );
};
