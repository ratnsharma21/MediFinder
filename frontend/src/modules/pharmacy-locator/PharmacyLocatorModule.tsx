// ==============================================================================
// MediFinder / MediCare - Pharmacy Locator Module
// Primary Owner: Member 3 (Sumit) - feature/pharmacy-locator
// Backend Integration: /api/pharmacies, /api/pharmacies/nearby, /api/pharmacies/{id}
// ==============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Pharmacy } from '../../types';
import { pharmacyService } from '../../services/pharmacyService';
import { PharmacyCard } from './PharmacyCard';
import { PharmacyDetailModal } from './PharmacyDetailModal';
import { PharmacyMap } from './PharmacyMap';

type ViewMode = 'split' | 'list' | 'map';

export const PharmacyLocatorModule: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [is24HoursOnly, setIs24HoursOnly] = useState(false);
  const [radiusInKm, setRadiusInKm] = useState(10.0);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [loading, setLoading] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
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
      setPermissionDenied(false);
      return;
    }

    setLocatingUser(true);
    setErrorMessage(null);
    setPermissionDenied(false);
    setLocationStatus('Requesting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
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
            setPermissionDenied(true);
            setErrorMessage('Location permission was denied. You can still search manually by typing your city or selecting a preset below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage('Location information is currently unavailable. Please check your GPS signal or internet connection.');
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

  const handleCityPreset = (presetCity: string) => {
    setCity(presetCity);
    setSearchQuery('');
    setPostalCode('');
    setErrorMessage(null);
    setPermissionDenied(false);
  };

  const handleOpenGoogleMaps = (pharmacy: Pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    const element = document.getElementById(`pharmacy-card-${pharmacy.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Informational Stock Disclaimer per Requirements */}
      <aside aria-label="Disclaimer" className="stock-disclaimer-banner" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1.25rem',
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        color: '#92400e',
        fontSize: '0.875rem'
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {loading ? 'Searching...' : 'Filter'}
          </button>

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="btn btn-primary"
            disabled={locatingUser}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            {locatingUser ? 'Locating...' : 'Near Me (GPS)'}
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

        {/* Location Presets & Quick Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Locations:</span>
          {['Bengaluru', 'Gurugram'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleCityPreset(preset)}
              style={{
                background: city === preset ? 'var(--primary-light)' : '#ffffff',
                color: city === preset ? 'var(--primary)' : 'var(--text-muted)',
                border: city === preset ? '1px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              {preset}
            </button>
          ))}
          {(city || searchQuery || postalCode || is24HoursOnly) && (
            <button
              type="button"
              onClick={() => {
                setCity('');
                setSearchQuery('');
                setPostalCode('');
                setIs24HoursOnly(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginLeft: '0.25rem'
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Location Status Notice */}
        {locationStatus && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="pulse-indicator"></span>
            {locationStatus}
          </div>
        )}
      </header>

      {/* Permission Denied Recovery Banner */}
      {permissionDenied && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <strong>Location Access Disabled</strong>
            </div>
            <button
              type="button"
              onClick={() => setPermissionDenied(false)}
              style={{ background: 'none', border: 'none', color: '#1e40af', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '0.8125rem', margin: 0, lineHeight: 1.4 }}>
            Browser geolocation permission is blocked. Select a city preset below to instantly explore verified pharmacies in that region:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleCityPreset('Bengaluru')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              Search Bengaluru
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleCityPreset('Gurugram')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              Search Gurugram
            </button>
          </div>
        </div>
      )}

      {/* Error Alert Banner (if not permission denied) */}
      {errorMessage && !permissionDenied && (
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

      {/* View Switcher Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{pharmacies.length}</strong> licensed medical stores {userLocation ? 'near your location' : ''}
        </div>

        <div style={{ display: 'inline-flex', gap: '0.375rem', background: 'var(--border-light)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            🔲 Split Map & List
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map Only
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List Only
          </button>
        </div>
      </div>

      {/* Interactive Map Component (rendered in split or map mode) */}
      {viewMode !== 'list' && (
        <PharmacyMap
          pharmacies={pharmacies}
          selectedPharmacy={selectedPharmacy}
          userLocation={userLocation}
          onSelectPharmacy={handleSelectPharmacy}
          onOpenDirections={handleOpenGoogleMaps}
        />
      )}

      {/* Content Layout */}
      {viewMode !== 'map' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedPharmacy ? '1fr 380px' : '1fr', gap: '2rem' }}>
          {/* Pharmacy Card Grid */}
          <div>
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
                    onSelect={handleSelectPharmacy}
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
      )}
    </div>
  );
};