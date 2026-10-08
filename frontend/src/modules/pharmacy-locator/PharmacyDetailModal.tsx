// ==============================================================================
// MediFinder - Pharmacy Details Modal / Drawer Component
// Author: Sumit (Member 3 - Pharmacy Locator & Maps Lead)
// ==============================================================================

import React from 'react';
import { Pharmacy } from '../../types';
import { Card } from '../../components/common/Card';

interface PharmacyDetailModalProps {
  pharmacy: Pharmacy | null;
  onClose: () => void;
  onNavigateGoogleMaps: (pharmacy: Pharmacy) => void;
}

export const PharmacyDetailModal: React.FC<PharmacyDetailModalProps> = ({
  pharmacy,
  onClose,
  onNavigateGoogleMaps,
}) => {
  if (!pharmacy) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: '1.5rem',
      }}
    >
      <Card
        title={pharmacy.name}
        subtitle={`License: ${pharmacy.licenseNumber || 'Certified Medical Store'}`}
        headerAction={
          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: 'var(--text-muted)',
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Status Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {pharmacy.is24Hours ? (
              <span className="badge badge-success" style={{ fontWeight: 700 }}>
                ✓ 24x7 Emergency Service
              </span>
            ) : pharmacy.openNow ? (
              <span className="badge badge-success">● Open Now</span>
            ) : (
              <span className="badge badge-secondary">Closed Currently</span>
            )}

            {pharmacy.verified && (
              <span className="badge badge-primary">✓ State Health Dept Verified</span>
            )}

            {pharmacy.distanceInKm !== undefined && (
              <span className="badge badge-accent">
                📍 {pharmacy.distanceInKm.toFixed(1)} km away
              </span>
            )}
          </div>

          {/* Operating Hours */}
          <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Operating Schedule
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {pharmacy.formattedHours || (pharmacy.is24Hours ? '24 Hours Emergency Service' : `${pharmacy.openingTime || '08:00'} to ${pharmacy.closingTime || '22:00'}`)}
            </div>
          </div>

          {/* Address */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Store Location & Address
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              {pharmacy.address}<br />
              {pharmacy.city}, {pharmacy.state} - {pharmacy.postalCode}
            </div>
          </div>

          {/* Direct Phone & Email */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Direct Pharmacy Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem' }}>
              <a
                href={`tel:${pharmacy.contactNumber}`}
                style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                📞 {pharmacy.contactNumber}
              </a>
              {pharmacy.email && (
                <a
                  href={`mailto:${pharmacy.email}`}
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  ✉️ {pharmacy.email}
                </a>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
            <span>Latitude: {pharmacy.latitude}</span>
            <span>Longitude: {pharmacy.longitude}</span>
          </div>

          {/* Action button */}
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => onNavigateGoogleMaps(pharmacy)}
            style={{ width: '100%', gap: '0.5rem', fontWeight: 700 }}
          >
            🧭 Open in Google Maps
          </button>
        </div>
      </Card>
    </div>
  );
};