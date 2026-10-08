// ==============================================================================
// MediFinder / MediCare - Pharmacy Locator & Map Integration Module
// Primary Owner: Member 3 (Sumit) - feature/pharmacy-locator, feature/maps-integration
// Backend Integration: /api/pharmacies, /api/pharmacies/nearby, /api/pharmacies/{id}
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Pharmacy } from '../../types';
import { pharmacyService } from '../../services/pharmacyService';

export const PharmacyLocatorModule: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [is24HoursOnly, setIs24HoursOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const res = await pharmacyService.getPharmacies({
        city: city.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        is24Hours: is24HoursOnly ? true : undefined,
        size: 15
      });
      setPharmacies(res.content || []);
    } catch (err) {
      console.error('Failed to load pharmacies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [is24HoursOnly]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const nearby = await pharmacyService.getNearbyPharmacies(latitude, longitude, 15.0);
          setPharmacies(nearby);
        } catch (err) {
          console.error('Failed to fetch nearby pharmacies', err);
        } finally {
          setLocatingUser(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        // Fallback demo coordinates: Bengaluru Indiranagar (12.9716, 77.5946)
        pharmacyService.getNearbyPharmacies(12.9716, 77.5946, 15.0).then(setPharmacies);
        setLocatingUser(false);
      }
    );
  };

  return (
    <div>
      {/* Header & Geo Controls */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Pharmacy Locator & Emergency Stores
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Find licensed medical stores, 24x7 emergency counters, and contact pharmacists directly.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '200px' }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city (e.g. Bengaluru)"
          />
          <input
            type="text"
            className="form-input"
            style={{ width: '160px' }}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="PIN Code"
          />
          <button onClick={fetchPharmacies} className="btn btn-secondary">
            Filter
          </button>
          <button onClick={handleUseMyLocation} className="btn btn-primary" disabled={locatingUser}>
            {locatingUser ? 'Locating...' : '📍 Near Me (GPS)'}
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', marginLeft: 'auto' }}>
            <input
              type="checkbox"
              checked={is24HoursOnly}
              onChange={(e) => setIs24HoursOnly(e.target.checked)}
            />
            <span>24x7 Emergency Only</span>
          </label>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPharmacy ? '1fr 380px' : '1fr', gap: '2rem' }}>
        {/* Pharmacy Card Grid */}
        <div>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Locating medical stores...
            </div>
          ) : pharmacies.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No pharmacies found in this location.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-3">
              {pharmacies.map(pharmacy => (
                <div
                  key={pharmacy.id}
                  className="card"
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderColor: selectedPharmacy?.id === pharmacy.id ? 'var(--secondary)' : 'var(--border)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      {pharmacy.is24Hours ? (
                        <span className="badge badge-success">24x7 Open</span>
                      ) : (
                        <span className="badge badge-primary">{pharmacy.city}</span>
                      )}
                      {pharmacy.distanceInKm !== undefined && (
                        <span className="badge badge-secondary" style={{ fontWeight: 700 }}>
                          {pharmacy.distanceInKm.toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
                      {pharmacy.name}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      📍 {pharmacy.address}, {pharmacy.city} ({pharmacy.postalCode})
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      🕒 {pharmacy.is24Hours ? '24 Hours Emergency' : `${pharmacy.openingTime || '08:00'} - ${pharmacy.closingTime || '22:00'}`}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      📞 {pharmacy.contactNumber}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pharmacy Details Sidebar */}
        {selectedPharmacy && (
          <div>
            <Card
              title={selectedPharmacy.name}
              subtitle={`License: ${selectedPharmacy.licenseNumber || 'Verified Medical Store'}`}
              headerAction={
                <button
                  onClick={() => setSelectedPharmacy(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedPharmacy.is24Hours && <span className="badge badge-success">24x7 Emergency Service</span>}
                  {selectedPharmacy.verified && <span className="badge badge-primary">Government Verified</span>}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ADDRESS</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {selectedPharmacy.address}, {selectedPharmacy.city}, {selectedPharmacy.state} - {selectedPharmacy.postalCode}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DIRECT CONTACT</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
                    <a href={`tel:${selectedPharmacy.contactNumber}`}>{selectedPharmacy.contactNumber}</a>
                  </div>
                  {selectedPharmacy.email && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {selectedPharmacy.email}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>GPS COORDINATES</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Lat: {selectedPharmacy.latitude}, Long: {selectedPharmacy.longitude}
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${selectedPharmacy.latitude},${selectedPharmacy.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  🗺️ Navigate in Google Maps
                </a>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
