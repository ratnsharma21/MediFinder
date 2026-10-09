import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/api';
import { User, UserProfile, UserSettings } from '../../types';

interface AccountModuleProps {
  user: User | null;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onSessionExpired: () => void;
  onAccountUpdated: (changes: Partial<Pick<User, 'profile' | 'settings'>>) => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

const emptyProfile: UserProfile = {};

export const AccountModule: React.FC<AccountModuleProps> = ({
  user,
  isAuthenticated,
  onOpenAuth,
  onSessionExpired,
  onAccountUpdated,
  onLogout,
  onNavigate,
}) => {
  const [section, setSection] = useState<'profile' | 'settings'>('profile');
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(isAuthenticated);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let current = true;
    if (!isAuthenticated) {
      setLoading(false);
      return () => { current = false; };
    }

    setLoading(true);
    setError(null);
    Promise.all([authService.getUserProfile(), authService.getUserSettings()])
      .then(([userProfile, userSettings]) => {
        if (!current) return;
        setProfile(userProfile);
        setSettings(userSettings);
      })
      .catch((requestError: unknown) => {
        if (!current) return;
        if (requestError instanceof ApiError && requestError.status === 401) {
          setError('Your session expired. Sign in again to manage your account.');
          onSessionExpired();
        } else {
          setError(requestError instanceof Error ? requestError.message : 'Account information could not be loaded.');
        }
      })
      .finally(() => { if (current) setLoading(false); });

    return () => { current = false; };
  }, [isAuthenticated, onSessionExpired, reloadKey]);

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const phoneNumber = profile.phoneNumber?.trim();
    if (phoneNumber && !/^\+?[0-9][0-9\s().-]{6,18}$/.test(phoneNumber)) {
      setError('Enter a valid phone number with 7 to 19 digits.');
      return;
    }
    const postalCode = profile.postalCode?.trim();
    if (postalCode && !/^[A-Za-z0-9][A-Za-z0-9 -]{2,19}$/.test(postalCode)) {
      setError('Enter a valid postal code with 3 to 20 letters, numbers, spaces, or hyphens.');
      return;
    }
    const dateOfBirth = profile.dateOfBirth;
    const currentDate = new Date();
    const localToday = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    if (dateOfBirth && dateOfBirth >= localToday) {
      setError('Date of birth must be in the past.');
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await authService.updateProfile({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        emergencyContact: profile.emergencyContact,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        postalCode: profile.postalCode,
      });
      setProfile(updatedProfile);
      onAccountUpdated({ profile: updatedProfile });
      setNotice('Profile changes saved.');
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setError('Your session expired. Sign in again to save profile changes.');
        onSessionExpired();
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Profile changes could not be saved.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) return;
    setError(null);
    setNotice(null);
    setSaving(true);
    try {
      const updatedSettings = await authService.updateSettings({
        emailNotificationsEnabled: settings.emailNotificationsEnabled,
        smsNotificationsEnabled: settings.smsNotificationsEnabled,
        browserNotificationsEnabled: settings.browserNotificationsEnabled,
        inAppNotificationsEnabled: settings.inAppNotificationsEnabled,
        darkMode: settings.darkMode,
        reminderSound: settings.reminderSound,
      });
      setSettings(updatedSettings);
      onAccountUpdated({ settings: updatedSettings });
      setNotice('Settings saved to your account.');
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setError('Your session expired. Sign in again to save settings.');
        onSessionExpired();
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Settings could not be saved.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="account-gate">
        <p className="account-eyebrow">MediFinder account</p>
        <h1>Profile & settings</h1>
        <p>Sign in to view and update your account details and preferences.</p>
        <button className="btn btn-primary" onClick={onOpenAuth}>Sign in or create an account</button>
      </section>
    );
  }

  if (loading) {
    return <div className="account-status" role="status">Loading your account...</div>;
  }

  if (error && !settings) {
    return (
      <section className="account-panel">
        <div className="account-error" role="alert">{error}</div>
        <button className="btn btn-secondary" onClick={() => setReloadKey(value => value + 1)}>Retry</button>
      </section>
    );
  }

  const setProfileField = (field: keyof UserProfile, value: string) => {
    setProfile(previous => ({ ...previous, [field]: value }));
    setNotice(null);
  };

  const setPreference = (field: keyof UserSettings, value: boolean) => {
    setSettings(previous => previous ? { ...previous, [field]: value } : previous);
    setNotice(null);
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDateOfBirth = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  return (
    <div className="account-page">
      <header className="account-header">
        <div>
          <p className="account-eyebrow">Your account</p>
          <h1>Profile & settings</h1>
          <p>Keep your contact information and care preferences current.</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => { onLogout(); onNavigate('dashboard'); }}
          type="button"
        >
          Sign out
        </button>
      </header>

      <div className="account-layout">
        <aside className="account-rail" aria-label="Account sections">
          <div className="account-identity">
            <span className="account-avatar" aria-hidden="true">{(user?.profile?.fullName || user?.username || 'U').slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user?.profile?.fullName || user?.username}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <div className="account-tabs" role="tablist" aria-label="Profile and settings">
            <button
              type="button"
              role="tab"
              id="account-profile-tab"
              aria-controls="account-panel"
              aria-selected={section === 'profile'}
              className={section === 'profile' ? 'account-tab active' : 'account-tab'}
              onClick={() => { setSection('profile'); setError(null); setNotice(null); }}
            >
              Profile details
            </button>
            <button
              type="button"
              role="tab"
              id="account-settings-tab"
              aria-controls="account-panel"
              aria-selected={section === 'settings'}
              className={section === 'settings' ? 'account-tab active' : 'account-tab'}
              onClick={() => { setSection('settings'); setError(null); setNotice(null); }}
            >
              Preferences
            </button>
          </div>
        </aside>

        <section
          className="account-content"
          id="account-panel"
          role="tabpanel"
          aria-labelledby={section === 'profile' ? 'account-profile-tab' : 'account-settings-tab'}
        >
          {error && <div className="account-error" role="alert">{error}</div>}
          {notice && <div className="account-notice" role="status">{notice}</div>}

          {section === 'profile' ? (
            <form onSubmit={handleProfileSave} noValidate>
              <div className="account-section-heading">
                <div>
                  <h2>Personal information</h2>
                  <p>Account credentials are read-only here.</p>
                </div>
              </div>

              <div className="account-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="account-username">Username</label>
                  <input className="form-input" id="account-username" value={user?.username || ''} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-email">Email address</label>
                  <input className="form-input" id="account-email" type="email" value={user?.email || ''} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-full-name">Full name</label>
                  <input
                    className="form-input"
                    id="account-full-name"
                    maxLength={100}
                    value={profile.fullName || ''}
                    onChange={event => setProfileField('fullName', event.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-phone">Phone number</label>
                  <input
                    className="form-input"
                    id="account-phone"
                    type="tel"
                    inputMode="tel"
                    pattern="\\+?[0-9][0-9\\s().-]{6,18}"
                    title="Enter a phone number with 7 to 19 digits."
                    maxLength={20}
                    value={profile.phoneNumber || ''}
                    onChange={event => setProfileField('phoneNumber', event.target.value)}
                    autoComplete="tel"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-dob">Date of birth</label>
                  <input
                    className="form-input"
                    id="account-dob"
                    type="date"
                    max={maxDateOfBirth}
                    value={profile.dateOfBirth || ''}
                    onChange={event => setProfileField('dateOfBirth', event.target.value)}
                    autoComplete="bday"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-gender">Gender</label>
                  <select className="form-select" id="account-gender" value={profile.gender || ''} onChange={event => setProfileField('gender', event.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-blood-group">Blood group</label>
                  <select className="form-select" id="account-blood-group" value={profile.bloodGroup || ''} onChange={event => setProfileField('bloodGroup', event.target.value)}>
                    <option value="">Not provided</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => <option value={group} key={group}>{group}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-emergency">Emergency contact</label>
                  <input className="form-input" id="account-emergency" maxLength={100} value={profile.emergencyContact || ''} onChange={event => setProfileField('emergencyContact', event.target.value)} />
                </div>
                <div className="form-group account-form-wide">
                  <label className="form-label" htmlFor="account-address">Street address</label>
                  <input className="form-input" id="account-address" maxLength={255} value={profile.address || ''} onChange={event => setProfileField('address', event.target.value)} autoComplete="street-address" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-city">City</label>
                  <input className="form-input" id="account-city" maxLength={100} value={profile.city || ''} onChange={event => setProfileField('city', event.target.value)} autoComplete="address-level2" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-state">State / region</label>
                  <input className="form-input" id="account-state" maxLength={100} value={profile.state || ''} onChange={event => setProfileField('state', event.target.value)} autoComplete="address-level1" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="account-postal">Postal code</label>
                  <input
                    className="form-input"
                    id="account-postal"
                    pattern="[A-Za-z0-9][A-Za-z0-9 -]{2,19}"
                    title="Enter a postal code with 3 to 20 letters, numbers, spaces, or hyphens."
                    maxLength={20}
                    value={profile.postalCode || ''}
                    onChange={event => setProfileField('postalCode', event.target.value)}
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              <div className="account-form-actions">
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSettingsSave}>
              <div className="account-section-heading">
                <div>
                  <h2>Preferences</h2>
                  <p>Saved to your account. Notification channel delivery is not enabled by these preferences.</p>
                </div>
              </div>

              {settings ? (
                <div className="account-preferences">
                  <label className="preference-row" htmlFor="pref-email">
                    <span><strong>Email notifications</strong><small>Receive account and care updates by email.</small></span>
                    <input id="pref-email" type="checkbox" checked={settings.emailNotificationsEnabled} onChange={event => setPreference('emailNotificationsEnabled', event.target.checked)} />
                  </label>
                  <label className="preference-row" htmlFor="pref-sms">
                    <span><strong>SMS notifications</strong><small>Allow text-message notification preferences.</small></span>
                    <input id="pref-sms" type="checkbox" checked={settings.smsNotificationsEnabled} onChange={event => setPreference('smsNotificationsEnabled', event.target.checked)} />
                  </label>
                  <label className="preference-row" htmlFor="pref-browser">
                    <span><strong>Browser notifications</strong><small>Set your preference for browser-based alerts.</small></span>
                    <input id="pref-browser" type="checkbox" checked={settings.browserNotificationsEnabled} onChange={event => setPreference('browserNotificationsEnabled', event.target.checked)} />
                  </label>
                  <label className="preference-row" htmlFor="pref-in-app">
                    <span><strong>In-app notifications</strong><small>Show notifications within MediFinder.</small></span>
                    <input id="pref-in-app" type="checkbox" checked={settings.inAppNotificationsEnabled} onChange={event => setPreference('inAppNotificationsEnabled', event.target.checked)} />
                  </label>
                  <label className="preference-row" htmlFor="pref-dark-mode">
                    <span><strong>Dark appearance</strong><small>Apply a darker interface on this account.</small></span>
                    <input id="pref-dark-mode" type="checkbox" checked={settings.darkMode} onChange={event => setPreference('darkMode', event.target.checked)} />
                  </label>
                </div>
              ) : (
                <div className="account-error" role="alert">Settings could not be loaded. Retry to continue.</div>
              )}

              <div className="account-form-actions">
                <button className="btn btn-primary" type="submit" disabled={saving || !settings}>{saving ? 'Saving...' : 'Save preferences'}</button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
