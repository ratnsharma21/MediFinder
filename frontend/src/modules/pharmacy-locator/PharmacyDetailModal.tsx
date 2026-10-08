// ==============================================================================
// MediFinder - Pharmacy Details Modal / Drawer Component
// Author: Sumit (Member 3 - Pharmacy Locator & Maps Lead)
// Feature: feature/pharmacy-locator
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Status Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {pharmacy.is24Hours ? (
              <span className="badge badge-success" style={{ fontWeight: 700 }}>
                24x7 Emergency Service
              </span>
            ) : pharmacy.openNow ? (
              <span className="badge badge-success">Open Now</span>
            ) : (
              <span className="badge badge-secondary">Closed Currently</span>
            )}

            {pharmacy.verified && (
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                State Health Dept Verified
              </span>
            )}

            {pharmacy.distanceInKm !== undefined && (
              <span className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                {pharmacy.distanceInKm.toFixed(1)} km away
              </span>
            )}
          </div>

          {/* Operating Hours */}
          <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Operating Schedule
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {pharmacy.formattedHours || (pharmacy.is24Hours ? '24 Hours Emergency Service' : `${pharmacy.openingTime || '08:00'} to ${pharmacy.closingTime || '22:00'}`)}
            </div>
          </div>

          {/* Address */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {pharmacy.contactNumber}
              </a>
              {pharmacy.email && (
                <a
                  href={`mailto:${pharmacy.email}`}
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {pharmacy.email}
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
            style={{ width: '100%', gap: '0.5rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Open in Google Maps
          </button>
        </div>
      </Card>
    </div>
  );
};