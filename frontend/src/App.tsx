import React, { useCallback, useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { MedicineStoreModule } from './modules/medicine-store/MedicineStoreModule';
import { PharmacyLocatorModule } from './modules/pharmacy-locator/PharmacyLocatorModule';
import { RemindersModule } from './modules/reminders/RemindersModule';
import { AccountModule } from './modules/account/AccountModule';
import { AuthModal } from './modules/auth/AuthModal';
import { useAuth } from './hooks/useAuth';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { user, isAuthenticated, logout, refreshUser, updateUser } = useAuth();

  useEffect(() => {
    document.documentElement.dataset.theme = user?.settings?.darkMode ? 'dark' : 'light';
  }, [user?.settings?.darkMode]);

  const handleSessionExpired = useCallback(() => {
    void logout();
    setIsAuthModalOpen(true);
  }, [logout]);

  return (
    <>
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      >
        {activeTab === 'dashboard' && (
          <DashboardModule
            user={user}
            isAuthenticated={isAuthenticated}
            onNavigate={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSessionExpired={handleSessionExpired}
          />
        )}
        {activeTab === 'medicines' && <MedicineStoreModule />}
        {activeTab === 'pharmacies' && <PharmacyLocatorModule />}
        {activeTab === 'reminders' && (
          <RemindersModule
            user={user}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
        {activeTab === 'account' && (
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
