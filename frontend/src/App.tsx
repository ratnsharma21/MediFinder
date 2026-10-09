/**
 * MediFinder Healthcare OS - Main Application Root
 */

import React, { useCallback, useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { MedicineStoreModule } from './modules/medicine-store/MedicineStoreModule';
import { PharmacyLocatorModule } from './modules/pharmacy-locator/PharmacyLocatorModule';
import { RemindersModule } from './modules/reminders/RemindersModule';
import { AccountModule } from './modules/account/AccountModule';
import { OrdersModule } from './modules/orders/OrdersModule';
import { MedicalRecordsModule } from './modules/records/MedicalRecordsModule';
import { NotificationsModule } from './modules/notifications/NotificationsModule';
import { HelpSupportModule } from './modules/support/HelpSupportModule';
import { AuthPage } from './modules/auth/AuthPage';
import { AuthModal } from './modules/auth/AuthModal';
import { useAuth } from './hooks/useAuth';
import { reminderService } from './services/reminderService';
import { notificationService } from './services/notificationService';
import { orderService } from './services/orderService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [triggerCreateReminder, setTriggerCreateReminder] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { user, isAuthenticated, logout, refreshUser, updateUser } = useAuth();

  const [activeRemindersCount, setActiveRemindersCount] = useState<number>(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    document.documentElement.dataset.theme = user?.settings?.darkMode ? 'dark' : 'light';
  }, [user?.settings?.darkMode]);

  // Dynamically load user-specific counts whenever user identity is authenticated
  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated || !user) {
      setActiveRemindersCount(0);
      setUnreadNotificationsCount(0);
      setOrdersCount(0);
      return;
    }

    const loadCounts = async () => {
      try {
        const [reminders, unreadCount, orders] = await Promise.allSettled([
          reminderService.getReminders(),
          notificationService.getUnreadCount(),
          orderService.getUserOrders(user.id),
        ]);

        if (!isMounted) return;

        if (reminders.status === 'fulfilled') {
          setActiveRemindersCount(reminders.value.filter(r => r.active !== false).length);
        }
        if (unreadCount.status === 'fulfilled') {
          setUnreadNotificationsCount(unreadCount.value);
        }
        if (orders.status === 'fulfilled') {
          setOrdersCount(orders.value.length);
        }
      } catch (err) {
        console.error('Failed to load user-specific badge counts:', err);
      }
    };

    loadCounts();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id, activeTab]);

  const handleSessionExpired = useCallback(() => {
    void logout();
  }, [logout]);

  const handleSearchGlobal = (query: string) => {
    setGlobalSearchQuery(query);
    setActiveTab('medicines');
  };

  const handleOpenAddReminder = () => {
    setTriggerCreateReminder(true);
    setActiveTab('reminders');
  };

  // If user is not logged in, show initial Login / Registration Page
  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => refreshUser()} />;
  }

  // Once authenticated, render main Healthcare OS interface
  return (
    <>
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddReminder={handleOpenAddReminder}
        onSearchGlobal={handleSearchGlobal}
        activeRemindersCount={activeRemindersCount}
        unreadNotificationsCount={unreadNotificationsCount}
        ordersCount={ordersCount}
      >
        {activeTab === 'dashboard' && (
          <DashboardModule
            user={user}
            isAuthenticated={isAuthenticated}
            onNavigate={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSessionExpired={handleSessionExpired}
            onOpenAddReminder={handleOpenAddReminder}
          />
        )}
        {activeTab === 'medicines' && (
          <MedicineStoreModule
            initialQuery={globalSearchQuery}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'pharmacies' && <PharmacyLocatorModule />}
        {activeTab === 'reminders' && (
          <RemindersModule
            user={user}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            initialOpenCreate={triggerCreateReminder}
            onClearInitialOpenCreate={() => setTriggerCreateReminder(false)}
          />
        )}
        {activeTab === 'orders' && <OrdersModule user={user} onNavigate={setActiveTab} />}
        {activeTab === 'records' && <MedicalRecordsModule user={user} onNavigate={setActiveTab} />}
        {activeTab === 'notifications' && <NotificationsModule onNavigate={setActiveTab} />}
        {(activeTab === 'account' || activeTab === 'profile' || activeTab === 'settings') && (
          <AccountModule
            user={user}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSessionExpired={handleSessionExpired}
            onAccountUpdated={updateUser}
            onLogout={logout}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'support' && <HelpSupportModule onNavigate={setActiveTab} />}
      </MainLayout>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => refreshUser()}
      />
    </>
  );
};

export default App;
