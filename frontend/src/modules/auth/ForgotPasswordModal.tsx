/**
 * MediFinder / MediCare - Password Recovery Modal Component
 */

import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = ''
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmailOrUsername('');
    onClose();
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-icon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="auth-modal-title">Reset your password</h2>
          <p className="auth-modal-subtitle">
            Enter the email address or username associated with your medical account and we'll help you regain access.
          </p>
        </div>

        {submitted ? (
          <div className="auth-modal-success-state">
            <div className="auth-modal-check-icon">✓</div>
            <h3>Password Reset Requested</h3>
            <p>
              If an account matches <strong>{emailOrUsername}</strong>, password reset instructions have been dispatched. For immediate clinical account unlocking, please contact your healthcare system administrator.
            </p>
            <button
              type="button"
              className="btn-auth-primary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              onClick={handleReset}
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email Address or Username</label>
              <input
                id="forgot-email"
                type="text"
                className="form-input form-input-light"
                required
                placeholder="e.g. name@example.com"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>

            <div className="auth-modal-footer-note">
              Default demo accounts: <code>ratn_lead</code>, <code>demo_user</code>, <code>rahul_sharma</code>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
