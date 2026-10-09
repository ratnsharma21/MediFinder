/**
 * MediFinder Healthcare OS - Main Layout Container Component
 */

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { User } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenAddReminder: () => void;
  onSearchGlobal: (query: string) => void;
  activeRemindersCount?: number;
  unreadNotificationsCount?: number;
  ordersCount?: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  user,
  isAuthenticated,
  onLogout,
  onOpenAuth,
  onOpenAddReminder,
  onSearchGlobal,
  activeRemindersCount = 0,
  unreadNotificationsCount = 0,
  ordersCount = 0,
}) => {
  return (
    <div className="medicare-app-layout">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isAuthenticated={isAuthenticated}
        activeRemindersCount={activeRemindersCount}
        unreadNotificationsCount={unreadNotificationsCount}
        ordersCount={ordersCount}
      />

      {/* Main Content Area */}
      <div className="medicare-main-wrapper">
        {/* Top Navbar */}
        <TopNavbar
          user={user}
          isAuthenticated={isAuthenticated}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
          onOpenAddReminder={onOpenAddReminder}
          onSearchGlobal={onSearchGlobal}
          onNavigate={setActiveTab}
          unreadCount={unreadNotificationsCount}
        />

        {/* Page Body */}
        <main className="medicare-page-body">
          {children}
        </main>
      </div>
    </div>
  );
};
