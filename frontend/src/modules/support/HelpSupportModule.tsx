/**
 * Help, Emergency Care & Clinical Desk Support Module
 */

import React, { useState } from 'react';
import { Card } from '../../components/common/Card';

interface HelpSupportModuleProps {
  onNavigate: (tab: string) => void;
}

export const HelpSupportModule: React.FC<HelpSupportModuleProps> = ({ onNavigate }) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'How do Medicine Reminders and Desktop Alerts work?',
      a: 'When you create a reminder with specific dosage times (e.g. 09:00 AM), MediFinder triggers in-app alerts and browser notifications. You can log doses as "Taken" or "Skipped" directly from the dashboard or Reminders module.'
    },
    {
      q: 'How does Medication Refill Warning calculation work?',
      a: 'Whenever your active medicine stock drops below your configured threshold (e.g., fewer than 5 tablets remaining), MediFinder automatically raises a Refill Warning alert with a single-click "Reorder Now" shortcut.'
    },
    {
      q: 'How does the Pharmacy Locator find nearby chemists?',
      a: 'You can search by your PIN code or city, or click "Use current location". The locator queries verified licensed pharmacies, showing operating hours (including 24/7 availability), home delivery support, and distance.'
    },
    {
      q: 'Is my medical and prescription data secure?',
      a: 'Yes. All authentication and session data are protected with JWT tokens and BCrypt encryption. In Local Demo Mode, test data is sandboxed securely.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSent(true);
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="module-page-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Help, Support & Emergency Care</h1>
          <p className="module-subtitle">
            Find answers, contact patient assistance, or access verified emergency helpline numbers.
          </p>
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="emergency-care-banner">
        <div className="emergency-icon">🚨</div>
        <div className="emergency-content">
          <h3>Medical Emergency Support</h3>
          <p>
            If you or someone nearby is experiencing a life-threatening medical emergency, please call your local emergency medical service immediately.
          </p>
          <div className="emergency-badges">
            <span className="emergency-pill">🚑 National Ambulance: <strong>112 / 102</strong></span>
            <span className="emergency-pill">🧪 Poison Control: <strong>1800-116-117</strong></span>
            <span className="emergency-pill">💊 24x7 Pharma Help: <strong>1800-208-8888</strong></span>
          </div>
        </div>
      </div>

      {/* FAQ & Support Form Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* FAQs */}
        <div className="support-faq-section">
          <Card title="Frequently Asked Questions" subtitle="Quick guides on navigating MediFinder OS">
            <div className="faq-accordion">
              {FAQS.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">{expandedFaq === index ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contact Support Ticket */}
        <div className="support-form-section">
          <Card title="Contact Care Support" subtitle="Send an inquiry to the MediFinder clinical desk">
            {ticketSent ? (
              <div className="support-success-box">
                <div className="success-icon">✅</div>
                <h4>Inquiry Submitted</h4>
                <p>Support Ticket #TK-{Math.floor(100000 + Math.random() * 900000)} has been logged. Our care team will respond shortly.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm mt-3"
                  onClick={() => setTicketSent(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="support-form">
                <div className="form-group">
                  <label>Subject / Topic *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Question regarding prescription refill"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message Details *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Describe your question or issue in detail..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Submit Support Request
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
