import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)',
      padding: '2.5rem 0',
      color: 'var(--text-muted)',
      fontSize: '0.875rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            MediFinder Platform
          </div>
          <div>Customer-focused medicine discovery, pharmacy locator & adherence reminders</div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/swagger-ui.html" target="_blank" rel="noopener noreferrer">Swagger API Docs</a>
          <a href="/v3/api-docs" target="_blank" rel="noopener noreferrer">OpenAPI JSON</a>
          <span>Spring Boot 3.3 + MySQL 8.0</span>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', width: '100%', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <strong>Medical Disclaimer:</strong> MediFinder does not dispense prescription drugs without valid physician prescription verification. Pharmacy listings and prices do not guarantee real-time store stock.
        </div>
      </div>
    </footer>
  );
};
