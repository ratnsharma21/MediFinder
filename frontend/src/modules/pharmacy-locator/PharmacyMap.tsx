/**
 * Interactive SVG Vector Map Component for Pharmacy Geolocation
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Pharmacy } from '../../types';

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  userLocation: { latitude: number; longitude: number } | null;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  onOpenDirections: (pharmacy: Pharmacy) => void;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMapCallback?: () => void;
  }
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({
  pharmacies,
  selectedPharmacy,
  userLocation,
  onSelectPharmacy,
  onOpenDirections,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPharmacy, setHoveredPharmacy] = useState<Pharmacy | null>(null);
  const [showSatelliteMode, setShowSatelliteMode] = useState<boolean>(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState<boolean>(false);

  const googleMapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Dynamically load Google Maps script if API key is provided
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      setUseGoogleMaps(true);
      return;
    }

    const scriptId = 'google-maps-api-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleMapsLoaded(true);
        setUseGoogleMaps(true);
      };
      script.onerror = () => {
        console.warn('Google Maps script failed to load. Falling back to built-in vector map.');
        setGoogleMapsLoaded(false);
        setUseGoogleMaps(false);
      };
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // Initialize and synchronize Google Maps instance
  useEffect(() => {
    if (!useGoogleMaps || !googleMapsLoaded || !googleMapRef.current || !window.google) return;

    const centerLat = userLocation?.latitude || (pharmacies.length > 0 ? Number(pharmacies[0].latitude) : 26.9124);
    const centerLng = userLocation?.longitude || (pharmacies.length > 0 ? Number(pharmacies[0].longitude) : 75.7873);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(googleMapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 12,
        mapTypeId: showSatelliteMode ? 'hybrid' : 'roadmap',
        fullscreenControl: false,
        streetViewControl: false,
      });
      infoWindowRef.current = new window.google.maps.InfoWindow();
    } else {
      mapInstanceRef.current.setMapTypeId(showSatelliteMode ? 'hybrid' : 'roadmap');
    }

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add user GPS marker
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: mapInstanceRef.current,
        title: 'You Are Here',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#8b5cf6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });
      markersRef.current.push(userMarker);
    }

    // Add pharmacy markers
    pharmacies.forEach((pharmacy) => {
      const isSelected = selectedPharmacy?.id === pharmacy.id;
      const marker = new window.google.maps.Marker({
        position: { lat: Number(pharmacy.latitude), lng: Number(pharmacy.longitude) },
        map: mapInstanceRef.current,
        title: pharmacy.name,
        icon: {
          path: 'M 0 12 C -8 0 -12 -6 -12 -12 A 12 12 0 1 1 12 -12 C 12 -6 8 0 0 12 Z',
          scale: 1.4,
          fillColor: isSelected ? '#f59e0b' : (pharmacy.is24Hours ? '#10b981' : '#0284c7'),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        onSelectPharmacy(pharmacy);
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="font-family: inherit; padding: 4px; max-width: 200px;">
              <strong style="font-size: 13px; color: #0f172a;">${pharmacy.name}</strong>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${pharmacy.address}</div>
              <div style="font-size: 11px; font-weight: 700; color: #0284c7; margin-top: 4px;">${pharmacy.contactNumber}</div>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Pan to selected pharmacy if set
    if (selectedPharmacy && mapInstanceRef.current) {
      mapInstanceRef.current.panTo({
        lat: Number(selectedPharmacy.latitude),
        lng: Number(selectedPharmacy.longitude),
      });
    }
  }, [useGoogleMaps, googleMapsLoaded, pharmacies, selectedPharmacy, userLocation, showSatelliteMode, onSelectPharmacy]);

  // Compute map bounding box and centers for Vector fallback
  const mapBounds = useMemo(() => {
    if (pharmacies.length === 0 && !userLocation) {
      return { minLat: 26.75, maxLat: 27.05, minLng: 75.65, maxLng: 75.95, centerLat: 26.9124, centerLng: 75.7873 };
    }

    const lats = pharmacies.map((p) => Number(p.latitude));
    const lngs = pharmacies.map((p) => Number(p.longitude));
    if (userLocation) {
      lats.push(userLocation.latitude);
      lngs.push(userLocation.longitude);
    }

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latMargin = Math.max((maxLat - minLat) * 0.15, 0.02);
    const lngMargin = Math.max((maxLng - minLng) * 0.15, 0.02);

    return {
      minLat: minLat - latMargin,
      maxLat: maxLat + latMargin,
      minLng: minLng - lngMargin,
      maxLng: maxLng + lngMargin,
      centerLat: (minLat + maxLat) / 2,
      centerLng: (minLng + maxLng) / 2,
    };
  }, [pharmacies, userLocation]);

  // Coordinate projection from GPS to SVG viewport (800 x 480)
  const projectCoordinates = (lat: number, lng: number) => {
    const width = 800;
    const height = 480;

    const latSpan = Math.max(mapBounds.maxLat - mapBounds.minLat, 0.001);
    const lngSpan = Math.max(mapBounds.maxLng - mapBounds.minLng, 0.001);

    const normalizedX = (lng - mapBounds.minLng) / lngSpan;
    const normalizedY = (mapBounds.maxLat - lat) / latSpan;

    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX + (normalizedX * width - centerX) * zoomLevel;
    const y = centerY + (normalizedY * height - centerY) * zoomLevel;

    return { x, y };
  };

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '1.5rem',
        position: 'relative',
      }}
    >
      {/* Map Control Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.875rem 1.25rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 750, color: 'var(--text-main)', margin: 0 }}>
              Live Pharmacy Geolocation Map
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {pharmacies.length} medical stores mapped in current viewport
            </div>
          </div>
        </div>

        {/* Action Controls & Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Legend Badges */}
          <div style={{ display: 'flex', gap: '0.375rem', fontSize: '0.6875rem', alignItems: 'center', marginRight: '0.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#065f46', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> 24x7 Open
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#0369a1', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }}></span> Regular
            </span>
            {userLocation && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#7c3aed', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }}></span> Your GPS
              </span>
            )}
          </div>

          {/* Provider toggle if Google Maps is available */}
          {googleMapsLoaded && (
            <button
              type="button"
              className="view-toggle-btn"
              onClick={() => setUseGoogleMaps(!useGoogleMaps)}
              title="Toggle Google Maps or Vector Radar View"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              {useGoogleMaps ? 'Switch to Vector Map' : 'Switch to Google Maps'}
            </button>
          )}

          {/* Map style toggle */}
          <button
            type="button"
            className="view-toggle-btn"
            onClick={() => setShowSatelliteMode(!showSatelliteMode)}
            title="Toggle Map Style"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          >
            {showSatelliteMode ? 'Standard' : 'Satellite'}
          </button>

          {/* Zoom In / Out Buttons for Vector Map */}
          {!useGoogleMaps && (
            <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.35, 3.0))}
                title="Zoom in"
                style={{
                  background: '#ffffff',
                  border: 'none',
                  padding: '0.3rem 0.55rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  borderRight: '1px solid var(--border)',
                }}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.35, 0.7))}
                title="Zoom out"
                style={{
                  background: '#ffffff',
                  border: 'none',
                  padding: '0.3rem 0.55rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  borderRight: '1px solid var(--border)',
                }}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                title="Reset zoom"
                style={{
                  background: '#ffffff',
                  border: 'none',
                  padding: '0.3rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          background: showSatelliteMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)',
          overflow: 'hidden',
          cursor: useGoogleMaps ? 'default' : 'grab',
          userSelect: 'none',
        }}
      >
        {/* Google Maps Container */}
        {useGoogleMaps && (
          <div ref={googleMapRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* High-Fidelity SVG Vector Map Fallback */}
        {!useGoogleMaps && (
          <svg
            viewBox="0 0 800 480"
            style={{ width: '100%', height: '100%', display: 'block' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Grid Pattern */}
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={showSatelliteMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(2, 132, 199, 0.07)'}
                  strokeWidth="1"
                />
              </pattern>
              {/* Active Pin Pulse Animation */}
              <radialGradient id="user-location-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background grid representing geographical grid */}
            <rect width="800" height="480" fill="url(#map-grid)" />

            {/* Simulated transit corridors & arterial roadways */}
            <g stroke={showSatelliteMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)'} strokeWidth="3" fill="none">
              <path d="M 50 120 Q 250 80 500 160 T 780 180" />
              <path d="M 80 400 Q 320 300 420 220 T 720 100" />
              <path d="M 280 20 Q 350 200 460 460" />
              <path d="M 600 40 Q 560 220 620 440" />
            </g>

            {/* User Location Radar Marker if available */}
            {userLocation && (() => {
              const pos = projectCoordinates(userLocation.latitude, userLocation.longitude);
              return (
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle r="28" fill="url(#user-location-glow)">
                    <animate attributeName="r" values="16;34;16" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="7" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
                  <text y="-14" textAnchor="middle" fill={showSatelliteMode ? '#c4b5fd' : '#6d28d9'} fontSize="11" fontWeight="700">
                    You Are Here
                  </text>
                </g>
              );
            })()}

            {/* Pharmacy Pins */}
            {pharmacies.map((pharmacy) => {
              const isSelected = selectedPharmacy?.id === pharmacy.id;
              const isHovered = hoveredPharmacy?.id === pharmacy.id;
              const pos = projectCoordinates(Number(pharmacy.latitude), Number(pharmacy.longitude));
              const pinColor = pharmacy.is24Hours ? '#10b981' : '#0284c7';

              return (
                <g
                  key={pharmacy.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => onSelectPharmacy(pharmacy)}
                  onMouseEnter={() => setHoveredPharmacy(pharmacy)}
                  onMouseLeave={() => setHoveredPharmacy(null)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                >
                  {/* Active marker glow */}
                  {(isSelected || isHovered) && (
                    <circle
                      r="22"
                      fill={pharmacy.is24Hours ? 'rgba(16, 185, 129, 0.25)' : 'rgba(2, 132, 199, 0.25)'}
                    >
                      <animate attributeName="r" values="18;24;18" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Drop shadow */}
                  <ellipse cx="0" cy="14" rx="8" ry="3" fill="rgba(0, 0, 0, 0.2)" />

                  {/* Map Pin Shape */}
                  <path
                    d="M 0 12 C -8 0 -12 -6 -12 -12 A 12 12 0 1 1 12 -12 C 12 -6 8 0 0 12 Z"
                    fill={isSelected ? '#f59e0b' : pinColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))"
                  />

                  {/* Medical Cross Icon inside pin */}
                  <path
                    d="M -2 -15 H 2 V -11 H 6 V -7 H 2 V -3 H -2 V -7 H -6 V -11 H -2 Z"
                    fill="#ffffff"
                  />

                  {/* Pin Store Name Label */}
                  <text
                    x="0"
                    y="26"
                    textAnchor="middle"
                    fill={showSatelliteMode ? '#ffffff' : '#0f172a'}
                    fontSize="10"
                    fontWeight="700"
                    style={{
                      textShadow: showSatelliteMode
                        ? '0 1px 3px rgba(0,0,0,0.8)'
                        : '0 1px 2px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.9)',
                    }}
                  >
                    {pharmacy.name.length > 22 ? `${pharmacy.name.substring(0, 20)}...` : pharmacy.name}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover / Active Marker Popup Card for Vector Map */}
        {!useGoogleMaps && (hoveredPharmacy || selectedPharmacy) && (() => {
          const activeItem = hoveredPharmacy || selectedPharmacy;
          if (!activeItem) return null;
          const pos = projectCoordinates(Number(activeItem.latitude), Number(activeItem.longitude));

          const left = Math.min(Math.max(pos.x, 140), 660);
          const top = Math.max(pos.y - 120, 20);

          return (
            <div
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                transform: 'translate(-50%, -100%)',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border)',
                minWidth: '220px',
                maxWidth: '280px',
                pointerEvents: 'auto',
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {activeItem.name}
                </span>
                {activeItem.distanceInKm !== undefined && (
                  <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                    {activeItem.distanceInKm.toFixed(1)} km
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {activeItem.address}, {activeItem.city}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                <a
                  href={`tel:${activeItem.contactNumber}`}
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Call Store
                </a>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenDirections(activeItem)}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                  📍 Directions
                </button>
              </div>
            </div>
          );
        })()}

        {/* Map Status Notice */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.6rem',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          <span>Map Engine:</span>
          {useGoogleMaps ? (
            <span style={{ color: '#10b981', fontWeight: 600 }}>Google Maps</span>
          ) : apiKey ? (
            <span style={{ color: '#0284c7', fontWeight: 600 }}>Vector Radar (API Ready)</span>
          ) : (
            <span style={{ color: 'var(--text-light)' }}>Vector Radar (Built-in GPS)</span>
          )}
        </div>
      </div>
    </div>
  );
};