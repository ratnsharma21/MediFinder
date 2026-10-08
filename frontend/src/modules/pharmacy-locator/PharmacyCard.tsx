// ==============================================================================
// MediFinder - Pharmacy Card Component
// Author: Sumit (Member 3 - Pharmacy Locator & Maps Lead)
// ==============================================================================

import React from 'react';
import { Pharmacy } from '../../types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  isSelected: boolean;
  onSelect: (pharmacy: Pharmacy) => void;
  onViewDirections: (pharmacy: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  isSelected,
  onSelect,
  onViewDirections,
}) => {
  return (
    <div
      className={`pharmacy-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(pharmacy)}
      id={`pharmacy-card-${pharmacy.id}`}
      style={{
        minHeight: '230px',
      }}
    >
      <div>
        {/* Top Badges & Distance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {pharmacy.is24Hours ? (
              <span className="badge badge-success" style={{ fontWeight: 700 }}>
                <span className="pulse-indicator"></span> 24x7 Emergency
              </span>
            ) : pharmacy.openNow ? (
              <span className="badge badge-success">
                <span className="pulse-indicator"></span> Open Now
              </span>
            ) : (
              <span className="badge badge-secondary" style={{ color: 'var(--text-muted)' }}>
                Closed
              </span>
            )}

            {pharmacy.verified && (
              <span className="badge badge-primary" title="Government Licensed Pharmacy">
                ✓ Verified
              </span>
            )}
          </div>

          {pharmacy.distanceInKm !== undefined && (
            <span
              className="badge"
              style={{
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                color: 'var(--primary-hover)',
                fontWeight: 700,
                fontSize: '0.8125rem'
              }}
            >
              📍 {pharmacy.distanceInKm < 1 ? `${Math.round(pharmacy.distanceInKm * 1000)} m` : `${pharmacy.distanceInKm.toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Pharmacy Title & Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem' }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 750, color: 'var(--text-main)', lineHeight: 1.3 }}>
            {pharmacy.name}
          </h3>
          {pharmacy.rating && (
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap' }}>
              ★ {pharmacy.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Address */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
          {pharmacy.address}, {pharmacy.city} - {pharmacy.postalCode}
        </p>

        {/* Timing Information */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>🕒</span>
          <span>{pharmacy.formattedHours || (pharmacy.is24Hours ? 'Open 24 Hours Emergency' : `${pharmacy.openingTime || '08:00'} - ${pharmacy.closingTime || '22:00'}`)}</span>
        </div>
      </div>

      {/* Footer Contact & Actions */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <a
          href={`tel:${pharmacy.contactNumber}`}
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          title="Direct Phone Line"
        >
          📞 {pharmacy.contactNumber}
        </a>

        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDirections(pharmacy);
            }}
            title="Open directions in Google Maps"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            🧭 Directions
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pharmacy);
            }}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
};