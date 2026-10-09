/**
 * MediFinder / MediCare - Legal Terms & Privacy Policy Modal Component
 */

import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card auth-modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {type === 'privacy' ? 'Privacy Policy & Data Protection' : 'Terms & Conditions of Service'}
          </h2>
          <p className="auth-modal-subtitle">
            MediCare / MediFinder Healthcare Operating System &amp; Patient Portal
          </p>
        </div>

        <div className="auth-modal-legal-content">
          {type === 'privacy' ? (
            <>
              <h3>1. Patient Health Information Security</h3>
              <p>
                MediCare is dedicated to safeguarding protected health information (PHI). All electronic health records, prescription archives, dosage logs, and medication reminder schedules are encrypted at rest using industry-standard 256-bit encryption and in transit via TLS/SSL.
              </p>

              <h3>2. Data Collection and Usage</h3>
              <p>
                We collect personal health identifiers (including full name, contact details, blood group, allergies, and dose schedules) strictly to facilitate personalized medication adherence, pharmacy discovery, and prescription management.
              </p>

              <h3>3. Third-Party Services and S3 Media Storage</h3>
              <p>
                User profile avatars and clinical documents uploaded to MediCare are securely stored in private cloud buckets (AWS S3) with role-based authenticated access. We do not sell or monetize personal medical data.
              </p>

              <h3>4. User Rights and Data Portability</h3>
              <p>
                Patients maintain full rights to review, modify, export, or request deletion of their medical profiles and reminder histories at any time through their account settings.
              </p>
            </>
          ) : (
            <>
              <h3>1. Terms of Acceptance</h3>
              <p>
                By signing in to or registering an account on MediCare / MediFinder, you agree to comply with these terms, clinical safety guidelines, and relevant healthcare privacy regulations.
              </p>

              <h3>2. Medical Information Disclaimer</h3>
              <p>
                MediCare provides digital medication scheduling, pharmacy discovery, and adherence tracking tools. Content provided within this portal does not constitute emergency medical advice. Always consult a licensed medical professional for clinical emergencies and severe drug interactions.
              </p>

              <h3>3. Account Responsibility &amp; Confidentiality</h3>
              <p>
                Users are responsible for maintaining the confidentiality of their login credentials. Any unauthorized access should be reported immediately to system administrators.
              </p>

              <h3>4. Service Availability</h3>
              <p>
                We strive for continuous service availability for dose alarm notifications and pharmacy lookup services, supported by redundant infrastructure and localized offline caching.
              </p>
            </>
          )}
        </div>

        <div className="auth-modal-footer-actions">
          <button
            type="button"
            className="btn-auth-primary"
            onClick={onClose}
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
