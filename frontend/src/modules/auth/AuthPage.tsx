/**
 * MediCare / MediFinder Healthcare OS - Production Login & Authentication
 * Design: Two-column layout inspired by reference visual with MediCare emerald/mint palette.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { LegalModal } from './LegalModal';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Registration Specific States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Feedback & Status
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [googleOauthNotice, setGoogleOauthNotice] = useState<string | null>(null);

  const { login } = useAuth();

  // Load Remember Me username on initial mount if saved
  useEffect(() => {
    const savedUser = localStorage.getItem('medicare_remembered_user');
    if (savedUser) {
      setEmailOrUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('Profile image must be less than 20MB');
      return;
    }

    setAvatarUploading(true);
    setError(null);
    try {
      const url = await authService.uploadAvatar(file);
      setAvatarUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload profile picture to AWS S3');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Initialize Google Identity Services if Client ID is configured
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: any) => {
              try {
                setLoading(true);
                setError(null);
                const parts = response.credential.split('.');
                const payload = JSON.parse(atob(parts[1]));
                await authService.googleLogin({
                  idToken: response.credential,
                  email: payload.email,
                  name: payload.name,
                  avatarUrl: payload.picture,
                });
                if (onSuccess) {
                  onSuccess();
                }
              } catch (err: any) {
                setError(err.message || 'Google authentication failed');
              } finally {
                setLoading(false);
              }
            },
          });
        }
      } catch (e) {
        console.warn('Google Identity initialization error', e);
      }
    };
    document.head.appendChild(script);
  }, [onSuccess]);

  const handleGoogleSignIn = () => {
    setError(null);
    setSuccessMessage(null);
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      setGoogleOauthNotice(
        'Google OAuth requires adding VITE_GOOGLE_CLIENT_ID to your frontend/.env file. Follow the Google Cloud Console guide to create your OAuth Client ID.'
      );
      return;
    }

    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    } else {
      setError('Google Sign-In service is loading. Please try again in a moment.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setGoogleOauthNotice(null);
    setLoading(true);

    try {
      if (isRegister) {
        // Register new medical user / patient with S3 avatar
        const cleanUser = username.trim();
        const cleanEmail = email.trim();
        const cleanName = fullName.trim() || cleanUser;

        if (!cleanName) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        if (!cleanUser || cleanUser.length < 3) {
          setError('Username / Patient ID must be at least 3 characters long.');
          setLoading(false);
          return;
        }

        if (cleanUser.length > 50) {
          setError('Username / Patient ID must be less than 50 characters.');
          setLoading(false);
          return;
        }

        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          setError('Please enter a valid email address.');
          setLoading(false);
          return;
        }

        if (!password || password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        await authService.registerOnly({
          username: cleanUser,
          email: cleanEmail,
          password,
          fullName: cleanName,
          phoneNumber: phoneNumber.trim() || undefined,
          avatarUrl: avatarUrl || undefined,
        });

        // Redirect back to Login view with prefilled User ID and green success banner
        setIsRegister(false);
        setEmailOrUsername(cleanUser);
        setPassword('');
        setFullName('');
        setUsername('');
        setEmail('');
        setPhoneNumber('');
        setAvatarUrl('');
        setSuccessMessage(`Account for "${cleanUser}" created successfully! Please enter your password to sign in.`);
      } else {
        // Sign in
        const cleanIdentifier = emailOrUsername.trim();

        // Remember Me preference handling
        if (rememberMe) {
          localStorage.setItem('medicare_remembered_user', cleanIdentifier);
        } else {
          localStorage.removeItem('medicare_remembered_user');
        }

        try {
          await login({
            emailOrUsername: cleanIdentifier === 'admin' ? 'ratn_lead' : cleanIdentifier,
            password: password,
          });
        } catch (loginErr: any) {
          if (cleanIdentifier === 'demo_user' || cleanIdentifier === 'alex_morgan') {
            try {
              await login({ emailOrUsername: 'user@medicare.demo', password });
            } catch {
              throw loginErr;
            }
          } else {
            throw loginErr;
          }
        }

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      const msg = err.message || (isRegister ? 'Registration could not be completed. Please verify the information entered.' : 'Invalid credentials. Please verify your email/username and password.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Main Login Container Card */}
      <div className="auth-card-container">

        {/* Left Form Column */}
        <div className="auth-form-column">

          {/* Brand Header */}
          <div className="auth-brand-header">
            <div className="auth-brand-icon-wrapper">
              <img src="/images/logo.png" alt="MediCare Logo" className="auth-brand-logo-img" />
            </div>
            <div className="auth-brand-titles">
              <span className="auth-brand-title">Medi<span className="brand-accent-green">Finder</span></span>
              <span className="auth-brand-sub">HEALTHCARE OS</span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="auth-header-text">
            <h1 className="auth-main-heading">
              {isRegister ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="auth-supporting-text">
              {isRegister
                ? 'Join MediCare to manage your prescriptions, track doses and find nearby pharmacies.'
                : 'Sign in to manage your medicines, reminders and healthcare information.'}
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="auth-alert auth-alert-success" role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Notice Banner */}
          {googleOauthNotice && (
            <div className="auth-alert auth-alert-info" role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="auth-alert-info-content">
                <strong>Google Authentication Setup</strong>
                <p>{googleOauthNotice}</p>
              </div>
              <button
                type="button"
                className="auth-alert-close"
                onClick={() => setGoogleOauthNotice(null)}
                aria-label="Dismiss notice"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-main-form" noValidate>
            {isRegister ? (
              <>
                {/* S3 Avatar Photo Uploader */}
                <div className="auth-s3-avatar-section">
                  <div className="auth-s3-avatar-preview">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile preview" className="auth-s3-avatar-img" />
                    ) : (
                      <div className="auth-s3-avatar-placeholder">
                        {avatarUploading ? '...' : (fullName ? fullName[0].toUpperCase() : '👤')}
                      </div>
                    )}
                  </div>
                  <div className="auth-s3-avatar-controls">
                    <label className="btn-s3-upload-label">
                      {avatarUploading ? 'Uploading to S3...' : (avatarUrl ? 'Change Profile Photo' : 'Upload Profile Photo (Optional)')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        onChange={handleAvatarFileChange}
                        disabled={avatarUploading}
                      />
                    </label>
                    <span className="auth-s3-hint">JPG, PNG or WebP up to 20MB</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-fullname">Full Name *</label>
                  <input
                    id="register-fullname"
                    type="text"
                    className="form-input form-input-light"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="register-username">Username / Patient ID *</label>
                    <span style={{ fontSize: '0.75rem', color: username.length > 0 && username.length < 3 ? '#EF4444' : 'var(--text-muted)' }}>
                      Min 3 chars
                    </span>
                  </div>
                  <input
                    id="register-username"
                    type="text"
                    className="form-input form-input-light"
                    required
                    minLength={3}
                    placeholder="e.g. bittu21"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-email">Email Address *</label>
                  <input
                    id="register-email"
                    type="email"
                    className="form-input form-input-light"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="register-password">Password *</label>
                    <span style={{ fontSize: '0.75rem', color: password.length > 0 && password.length < 6 ? '#EF4444' : 'var(--text-muted)' }}>
                      Min 6 chars
                    </span>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input form-input-light password-input"
                      required
                      minLength={6}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-phone">Phone Number</label>
                  <input
                    id="register-phone"
                    type="tel"
                    className="form-input form-input-light"
                    placeholder="+91 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-auth-primary"
                  disabled={loading || avatarUploading}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </>
            ) : (
              <>
                {/* Email Address / Username Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email address or Username</label>
                  <input
                    id="login-email"
                    type="text"
                    className="form-input form-input-light"
                    required
                    placeholder="name@example.com or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => setIsForgotModalOpen(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input form-input-light password-input"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="form-checkbox-row">
                  <label className="checkbox-custom-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-custom-input"
                    />
                    <span className="checkbox-custom-box"></span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="btn-auth-primary"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

                {/* Divider */}
                <div className="auth-divider">
                  <span className="auth-divider-line"></span>
                  <span className="auth-divider-text">Or continue with</span>
                  <span className="auth-divider-line"></span>
                </div>

                {/* Google Sign-in Action */}
                <button
                  type="button"
                  className="btn-auth-google"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="google-icon-svg" width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </>
            )}
          </form>

          {/* Account Creation / Sign-in Toggle */}
          <div className="auth-switch-row">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => { setIsRegister(false); setError(null); setSuccessMessage(null); }}
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => { setIsRegister(true); setError(null); setSuccessMessage(null); }}
                >
                  Create an account
                </button>
              </span>
            )}
          </div>

          {/* Legal / Privacy Footer */}
          <div className="auth-footer-legal">
            <button
              type="button"
              className="auth-legal-link"
              onClick={() => setLegalModalType('privacy')}
            >
              Privacy Policy
            </button>
            <span className="auth-legal-dot">•</span>
            <button
              type="button"
              className="auth-legal-link"
              onClick={() => setLegalModalType('terms')}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Right Visual Hero Column */}
        <div className="auth-visual-column">
          <div className="auth-visual-inner">
            <div className="auth-visual-img-wrapper">
              <img
                src="/images/Login.png"
                alt="MediCare Smart Dispenser"
                className="auth-visual-img"
              />
            </div>

            {/* Feature Highlight Card */}
            <div className="auth-feature-card">
              <div className="auth-feature-header">
                <div className="auth-feature-icon-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Smart Medication Adherence</span>
                </div>
              </div>
              <h3 className="auth-feature-title">Connected Healthcare OS</h3>
              <p className="auth-feature-description">
                Personalized dosage alerts, verified pharmacy price comparisons, and digital electronic health records encrypted end-to-end.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={emailOrUsername}
      />

      {/* Legal & Privacy Policy Modal */}
      <LegalModal
        isOpen={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || 'privacy'}
      />
    </div>
  );
};
