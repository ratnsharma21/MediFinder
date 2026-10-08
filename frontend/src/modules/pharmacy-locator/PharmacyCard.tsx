// ==============================================================================
// MediFinder - Pharmacy Card Component
// Author: Sumit (Member 3 - Pharmacy Locator & Maps Lead)
// Feature: feature/pharmacy-locator
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
        boxShadow: isSelected ? '0 0 0 3px rgba(2, 132, 199, 0.15), var(--shadow-md)' : undefined,
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
              <span
                className="badge badge-primary"
                title="Government Licensed Pharmacy"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Verified
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
                fontSize: '0.8125rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              {pharmacy.distanceInKm < 1 ? `${Math.round(pharmacy.distanceInKm * 1000)} m` : `${pharmacy.distanceInKm.toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Pharmacy Title & Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 750, color: 'var(--text-main)', lineHeight: 1.3 }}>
            {pharmacy.name}
          </h3>
          {pharmacy.rating && (
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {pharmacy.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Address */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
          {pharmacy.address}, {pharmacy.city} - {pharmacy.postalCode}
        </p>

        {/* Timing Information */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{pharmacy.formattedHours || (pharmacy.is24Hours ? 'Open 24 Hours Emergency' : `${pharmacy.openingTime || '08:00'} - ${pharmacy.closingTime || '22:00'}`)}</span>
        </div>
      </div>

      {/* Footer Contact & Actions */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a
          href={`tel:${pharmacy.contactNumber}`}
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          title="Direct Phone Line"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {pharmacy.contactNumber}
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
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Directions
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
            Details &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};