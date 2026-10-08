// ==============================================================================
// MediFinder / MediCare - Pharmacy Locator & Map Integration Module
// Primary Owner: Member 3 (Sumit) - feature/pharmacy-locator, feature/maps-integration
// Backend Integration: /api/pharmacies, /api/pharmacies/nearby, /api/pharmacies/{id}
// ==============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Pharmacy } from '../../types';
import { pharmacyService } from '../../services/pharmacyService';
import { PharmacyCard } from './PharmacyCard';
import { PharmacyDetailModal } from './PharmacyDetailModal';

export const PharmacyLocatorModule: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [is24HoursOnly, setIs24HoursOnly] = useState(false);
  const [radiusInKm, setRadiusInKm] = useState(10.0);
  const [loading, setLoading] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const fetchPharmacies = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await pharmacyService.getPharmacies({
        query: searchQuery.trim() || undefined,
        city: city.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        is24Hours: is24HoursOnly ? true : undefined,
        size: 30
      });
      setPharmacies(res.content || []);
    } catch (err) {
      console.error('Failed to load pharmacies', err);
      setErrorMessage('Unable to connect to pharmacy directory. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, city, postalCode, is24HoursOnly]);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setLocatingUser(true);
    setErrorMessage(null);
    setLocationStatus('Requesting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLocationStatus(`Found location (${latitude.toFixed(3)}, ${longitude.toFixed(3)}). Searching nearby...`);
          const nearby = await pharmacyService.getNearbyPharmacies(latitude, longitude, radiusInKm);
          
          if (is24HoursOnly) {
            setPharmacies(nearby.filter(p => p.is24Hours));
          } else {
            setPharmacies(nearby);
          }
          setLocationStatus(null);
        } catch (err) {
          console.error('Failed to fetch nearby pharmacies', err);
          setErrorMessage('Could not locate nearby medical stores. Please try a manual city or PIN code search.');
          setLocationStatus(null);
        } finally {
          setLocatingUser(false);
        }
      },
      (error) => {
        setLocatingUser(false);
        setLocationStatus(null);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage('Location permission was denied. Please allow location access or search manually by city/PIN.');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage('Location information is currently unavailable. Please check your GPS signal.');
            break;
          case error.TIMEOUT:
            setErrorMessage('Location request timed out. Please try again.');
            break;
          default:
            setErrorMessage('An unexpected error occurred while retrieving location.');
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleOpenGoogleMaps = (pharmacy: Pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Informational Stock Disclaimer per Requirements */}
      <aside aria-label="Disclaimer" className="stock-disclaimer-banner">
        <span>⚠️</span>
        <div>
          <strong>Medicine Stock Disclaimer:</strong> MediFinder physical pharmacy listings and GPS maps do not guarantee live, real-time inventory. Please call the pharmacy counter directly to verify stock before traveling.
        </div>
      </aside>

      {/* Hero Header & Search Controls */}
      <header className="locator-hero">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Pharmacy Locator & Emergency Stores
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '640px' }}>
          Find licensed physical medical stores, 24x7 emergency counters, view operating hours, and navigate via GPS coordinates.
        </p>

        {/* Search Controls Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ minWidth: '220px', flex: '1 1 200px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search store name or address..."
          />
          <input
            type="text"
            className="form-input"
            style={{ width: '160px' }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Bengaluru)"
          />
          <input
            type="text"
            className="form-input"
            style={{ width: '120px' }}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="PIN Code"
          />

          <button
            type="button"
            onClick={fetchPharmacies}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Searching...' : '🔍 Filter'}
          </button>

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="btn btn-primary"
            disabled={locatingUser}
          >
            {locatingUser ? 'Locating...' : '📍 Near Me (GPS)'}
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', marginLeft: 'auto', userSelect: 'none', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <input
              type="checkbox"
              checked={is24HoursOnly}
              onChange={(e) => setIs24HoursOnly(e.target.checked)}
            />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>24x7 Emergency Only</span>
          </label>
        </div>

        {/* Location Status Notice */}
        {locationStatus && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
            ℹ️ {locationStatus}
          </div>
        )}
      </header>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            style={{ background: 'none', border: 'none', color: '#991b1b', fontWeight: 700, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPharmacy ? '1fr 380px' : '1fr', gap: '2rem' }}>
        {/* Pharmacy Card Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing <strong>{pharmacies.length}</strong> licensed medical stores
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card skeleton-box" style={{ height: '220px' }}></div>
              ))}
            </div>
          ) : pharmacies.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏥</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>No pharmacies found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  We couldn't find any medical stores matching your search filters. Try clearing your search parameters or expanding your radius.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setCity('');
                    setPostalCode('');
                    setIs24HoursOnly(false);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-3">
              {pharmacies.map((pharmacy) => (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  isSelected={selectedPharmacy?.id === pharmacy.id}
                  onSelect={(p) => setSelectedPharmacy(p)}
                  onViewDirections={handleOpenGoogleMaps}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pharmacy Details Drawer */}
        {selectedPharmacy && (
          <div>
            <PharmacyDetailModal
              pharmacy={selectedPharmacy}
              onClose={() => setSelectedPharmacy(null)}
              onNavigateGoogleMaps={handleOpenGoogleMaps}
            />
          </div>
        )}
      </div>
    </div>
  );
};