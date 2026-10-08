// ==============================================================================
// MediFinder / MediCare - Medicine Store & Catalogue Module
// Primary Owner: Vansh (Member 2) - M3 Catalogue & Search, M4 Price Provenance
// Backend Integration: /api/medicines, /api/medicines/{id}, /api/medicines/{id}/offers
// ==============================================================================

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Medicine, MedicineDetail, RetailerOffer } from '../../types';
import { medicineService } from '../../services/medicineService';
import { MEDICINE_CATEGORIES } from '../../utils/constants';

const POPULAR_SEARCH_TAGS = [
  'Paracetamol',
  'Amoxicillin',
  'Pantoprazole',
  'Metformin',
  'Telmisartan',
  'Cetirizine',
  'Azithromycin',
  'Vitamin C'
];

export const MedicineStoreModule: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDetail | null>(null);
  const [selectedOffers, setSelectedOffers] = useState<RetailerOffer[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter and Query States
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [dosageForm, setDosageForm] = useState('All Forms');
  const [dosageFormsList, setDosageFormsList] = useState<string[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(MEDICINE_CATEGORIES);
  const [requiresPrescription, setRequiresPrescription] = useState<boolean | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [pageSize, setPageSize] = useState<number>(9);

  // Pagination & Status States
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);

    return () => clearTimeout(handler);
  }, [query]);

  // Load initial metadata (Categories & Dosage Forms)
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, forms, featured] = await Promise.all([
          medicineService.getCategories().catch(() => []),
          medicineService.getDosageForms().catch(() => []),
          medicineService.getFeaturedMedicines().catch(() => [])
        ]);
        if (cats && cats.length > 0) {
          setCategoriesList(['All Categories', ...cats]);
        }
        if (forms && forms.length > 0) {
          setDosageFormsList(['All Forms', ...forms]);
        }
        if (featured && featured.length > 0) {
          setFeaturedMedicines(featured);
        }
      } catch (err) {
        console.warn('Could not load catalogue metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch medicines from backend
  const fetchMedicines = useCallback(async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const minP = minPrice.trim() !== '' ? Number(minPrice) : undefined;
      const maxP = maxPrice.trim() !== '' ? Number(maxPrice) : undefined;

      const data = await medicineService.getMedicines({
        query: debouncedQuery.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        dosageForm: dosageForm !== 'All Forms' ? dosageForm : undefined,
        requiresPrescription: requiresPrescription,
        minPrice: minP,
        maxPrice: maxP,
        sortBy: sortBy,
        sortDirection: sortDirection,
        page: pageNumber,
        size: pageSize
      });
      setMedicines(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setPage(data.pageNumber || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch medicine catalogue. Please check your connection.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, category, dosageForm, requiresPrescription, minPrice, maxPrice, sortBy, sortDirection, pageSize]);

  // Refetch when filters or debounced query changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchMedicines(0);
    } else {
      fetchMedicines(0);
    }
  }, [debouncedQuery, category, dosageForm, requiresPrescription, sortBy, sortDirection, pageSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
    fetchMedicines(0);
  };

  const handleClearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    setCategory('All Categories');
    setDosageForm('All Forms');
    setRequiresPrescription(undefined);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortDirection('ASC');
  };

  const handleSelectMedicine = async (med: Medicine) => {
    setLoadingDetail(true);
    try {
      const [detail, offers] = await Promise.all([
        medicineService.getMedicineById(med.id),
        medicineService.getMedicineOffers(med.id).catch(() => [])
      ]);
      setSelectedMedicine(detail);
      setSelectedOffers(offers);
    } catch (err: any) {
      console.error('Failed to load medicine details', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenFullModal = (med: MedicineDetail) => {
    setSelectedMedicine(med);
    setIsDetailModalOpen(true);
  };

  const hasActiveFilters = Boolean(
    query ||
    category !== 'All Categories' ||
    dosageForm !== 'All Forms' ||
    requiresPrescription !== undefined ||
    minPrice !== '' ||
    maxPrice !== ''
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header & Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>💊</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Medicine Catalogue & Discovery
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Search trusted pharmaceutical medicines, verify salt formulations, and compare prices across top licensed online pharmacies.
        </p>
      </div>

      {/* Featured / Quick Highlights Banner (when not actively searching) */}
      {!debouncedQuery && category === 'All Categories' && featuredMedicines.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(37, 99, 235, 0.06) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🌟 Commonly Searched Medications
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified formulations</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {featuredMedicines.slice(0, 6).map(feat => (
              <button
                key={feat.id}
                onClick={() => handleSelectMedicine(feat)}
                style={{
                  flex: '0 0 auto',
                  background: 'var(--card-bg, #ffffff)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '0.5rem 0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{feat.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{feat.genericName}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success, #16a34a)', marginTop: '0.25rem' }}>
                  ₹{(feat.lowestPrice || feat.mrp).toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar & Primary Controls */}
      <Card style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 350px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by brand name (e.g. Dolo, Augmentin), generic salt, composition..."
              />
              <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                🔍
              </span>
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setDebouncedQuery(''); }}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '1rem'
                  }}
                  title="Clear query"
                >
                  ✕
                </button>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ minWidth: '100px' }}>
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Quick Search Suggestion Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Popular:</span>
            {POPULAR_SEARCH_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => { setQuery(tag); setDebouncedQuery(tag); }}
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  background: (debouncedQuery || query).toLowerCase() === tag.toLowerCase() ? 'var(--primary)' : 'var(--border-light, #f1f5f9)',
                  color: (debouncedQuery || query).toLowerCase() === tag.toLowerCase() ? '#ffffff' : 'var(--text-main)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</label>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '180px', fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {dosageFormsList.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Form:</label>
                <select
                  className="form-select"
                  style={{ width: 'auto', minWidth: '130px', fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                  value={dosageForm}
                  onChange={(e) => setDosageForm(e.target.value)}
                >
                  {dosageFormsList.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort:</label>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '140px', fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split('-');
                  setSortBy(sb);
                  setSortDirection(sd as 'ASC' | 'DESC');
                }}
              >
                <option value="name-ASC">Name (A → Z)</option>
                <option value="name-DESC">Name (Z → A)</option>
                <option value="price-ASC">Price: Low to High</option>
                <option value="price-DESC">Price: High to Low</option>
              </select>
            </div>

            {/* Price Bounds */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>₹:</span>
              <input
                type="number"
                placeholder="Min"
                className="form-input"
                style={{ width: '70px', fontSize: '0.8125rem', padding: '0.375rem 0.5rem' }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                className="form-input"
                style={{ width: '70px', fontSize: '0.8125rem', padding: '0.375rem 0.5rem' }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fetchMedicines(0)}
                style={{ padding: '0.375rem 0.5rem', fontSize: '0.75rem' }}
              >
                Apply
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <label style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={requiresPrescription === false}
                  onChange={(e) => setRequiresPrescription(e.target.checked ? false : undefined)}
                />
                OTC Only
              </label>
            </div>
          </div>
        </form>
      </Card>

      {/* Main Grid: Catalogue Cards & Sidebar Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMedicine ? '1fr 440px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left / Main Column: Medicine Cards */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {loading ? 'Searching catalogue...' : `Showing ${medicines.length} of ${totalElements} medicines`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {category !== 'All Categories' && (
                <span className="badge badge-primary">{category}</span>
              )}
              <select
                className="form-select"
                style={{ width: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={9}>9 / page</option>
                <option value={18}>18 / page</option>
                <option value={27}>27 / page</option>
              </select>
            </div>
          </div>

          {/* Loading Skeleton Placeholders */}
          {loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg, 10px)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--card-bg, #ffffff)',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: 0.6
                  }}
                >
                  <div>
                    <div style={{ height: '18px', width: '40%', background: 'var(--border-light)', borderRadius: '4px', marginBottom: '0.75rem' }} />
                    <div style={{ height: '20px', width: '75%', background: 'var(--border-light)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                    <div style={{ height: '14px', width: '90%', background: 'var(--border-light)', borderRadius: '4px' }} />
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ height: '24px', width: '30%', background: 'var(--border-light)', borderRadius: '4px' }} />
                    <div style={{ height: '18px', width: '25%', background: 'var(--border-light)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State with Retry Button */}
          {!loading && error && (
            <Card>
              <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--danger, #ef4444)', marginBottom: '0.5rem' }}>
                  Unable to Load Medicines
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{error}</p>
                <button className="btn btn-primary" onClick={() => fetchMedicines(page)}>
                  🔄 Retry Request
                </button>
              </div>
            </Card>
          )}

          {/* Empty State with Suggestions */}
          {!loading && !error && medicines.length === 0 && (
            <Card>
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  No matching medicines found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '460px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
                  We couldn't find any medications matching "<strong>{debouncedQuery || query}</strong>" with the current filter combination.
                  Try searching for generic salt names (like <em>Paracetamol</em>, <em>Amoxicillin</em>) or clearing some filters.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try searching:</span>
                    {['Paracetamol', 'Pantoprazole', 'Telmisartan'].map(sugg => (
                      <button
                        key={sugg}
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setQuery(sugg); setDebouncedQuery(sugg); }}
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>

                  <button className="btn btn-primary" onClick={handleClearSearch} style={{ marginTop: '0.5rem' }}>
                    Clear All Filters & Show All
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Medicine Card Grid */}
          {!loading && !error && medicines.length > 0 && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                {medicines.map(med => {
                  const isSelected = selectedMedicine?.id === med.id;
                  const discountPercent = med.lowestPrice && med.mrp > med.lowestPrice
                    ? Math.round(((med.mrp - med.lowestPrice) / med.mrp) * 100)
                    : 0;

                  return (
                    <div
                      key={med.id}
                      className="card"
                      onClick={() => handleSelectMedicine(med)}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg, 10px)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(15, 118, 110, 0.03)' : 'var(--card-bg, #ffffff)',
                        boxShadow: isSelected ? '0 0 0 3px rgba(15, 118, 110, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div>
                        {/* Top Meta Badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>{med.category}</span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {med.dosageForm && (
                              <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>{med.dosageForm}</span>
                            )}
                            {med.requiresPrescription ? (
                              <span className="badge badge-warning" title="Prescription Required (Rx)" style={{ fontSize: '0.6875rem', fontWeight: 800 }}>Rx</span>
                            ) : (
                              <span className="badge badge-success" title="Over The Counter (OTC)" style={{ fontSize: '0.6875rem' }}>OTC</span>
                            )}
                          </div>
                        </div>

                        {/* Medicine Name & Brand */}
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                          {med.name}
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                          {med.genericName} {med.strength ? `• ${med.strength}` : ''}
                        </p>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.875rem' }}>
                          By {med.manufacturerName || 'Verified Pharmaceutical'} • {med.packSize || 'Standard Pack'}
                        </div>
                      </div>

                      {/* Price Section */}
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              MRP <span style={{ textDecoration: med.lowestPrice && med.lowestPrice < med.mrp ? 'line-through' : 'none' }}>₹{med.mrp.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success, #16a34a)' }}>
                                ₹{(med.lowestPrice || med.mrp).toFixed(2)}
                              </span>
                              {discountPercent > 0 && (
                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(15, 118, 110, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
                                  {discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {isSelected ? 'Viewing Details ✓' : 'View Offers →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 0}
                    onClick={() => fetchMedicines(page - 1)}
                  >
                    ← Previous
                  </button>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => fetchMedicines(page + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Selected Medicine Details & Retailer Price Provenance */}
        {selectedMedicine && (
          <div style={{ position: 'sticky', top: '1rem' }}>
            <Card
              title={selectedMedicine.name}
              subtitle={selectedMedicine.genericName}
              headerAction={
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleOpenFullModal(selectedMedicine)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem' }}
                    title="Expand full clinical card"
                  >
                    🔍 Full Modal
                  </button>
                  <button
                    onClick={() => setSelectedMedicine(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      color: 'var(--text-muted)',
                      padding: '0.25rem'
                    }}
                    title="Close sidebar"
                  >
                    ✕
                  </button>
                </div>
              }
            >
              {loadingDetail ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading details...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{selectedMedicine.category}</span>
                    <span className="badge badge-secondary">{selectedMedicine.dosageForm}</span>
                    {selectedMedicine.requiresPrescription ? (
                      <span className="badge badge-warning">Prescription Required (Rx)</span>
                    ) : (
                      <span className="badge badge-success">Over The Counter (OTC)</span>
                    )}
                  </div>

                  {/* Manufacturer & Formulation */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Manufacturer & Composition
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                      {selectedMedicine.manufacturer?.name || 'Verified Manufacturer'}
                      {selectedMedicine.manufacturer?.isVerified && (
                        <span style={{ color: 'var(--primary)', marginLeft: '0.25rem' }}>✓ Verified</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                      {selectedMedicine.composition || `${selectedMedicine.genericName} (${selectedMedicine.strength})`}
                    </div>
                  </div>

                  {/* Indications / Clinical Usage */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Indications & Therapeutic Use
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {selectedMedicine.indications || 'Take as advised by your medical practitioner.'}
                    </div>
                  </div>

                  {/* Precautions & Storage */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Precautions & Storage
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {selectedMedicine.precautions}
                    </div>
                    {selectedMedicine.storageInstructions && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        📦 {selectedMedicine.storageInstructions}
                      </div>
                    )}
                  </div>

                  {/* Verified Retailer Quotes & Offers */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        🛒 Verified Online Pharmacy Prices
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>MRP ₹{selectedMedicine.mrp.toFixed(2)}</span>
                    </div>

                    {selectedOffers.length === 0 ? (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.75rem', background: 'var(--border-light)', borderRadius: '6px', textAlign: 'center' }}>
                        No direct partner offers currently indexed for this specific medicine.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {selectedOffers.map(offer => {
                          const savings = selectedMedicine.mrp - offer.sellingPrice;
                          return (
                            <div
                              key={offer.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md, 8px)',
                                background: 'var(--border-light, #f8fafc)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                  {offer.retailerName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  ⭐ {offer.retailerRating} • {offer.deliveryEstimateDays} day delivery
                                </div>
                                {savings > 0 && (
                                  <div style={{ fontSize: '0.6875rem', color: 'var(--success, #16a34a)', fontWeight: 600, marginTop: '0.125rem' }}>
                                    Save ₹{savings.toFixed(2)} ({offer.discountPercent}% off)
                                  </div>
                                )}
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: 'var(--success, #16a34a)', fontSize: '1.0625rem' }}>
                                  ₹{offer.sellingPrice.toFixed(2)}
                                </div>
                                <a
                                  href={offer.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary btn-sm"
                                  style={{ marginTop: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}
                                >
                                  Visit Retailer ↗
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Full Screen / Detailed Medicine Modal */}
      {isDetailModalOpen && selectedMedicine && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            borderRadius: 'var(--radius-xl, 16px)',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{selectedMedicine.category}</span>
                  <span className="badge badge-secondary">{selectedMedicine.dosageForm}</span>
                  {selectedMedicine.requiresPrescription && (
                    <span className="badge badge-warning">Prescription Required (Rx)</span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                  {selectedMedicine.name}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', margin: 0 }}>
                  {selectedMedicine.genericName} • {selectedMedicine.strength}
                </p>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                style={{
                  background: 'var(--border-light)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.125rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--border-light)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Composition & Manufacturer</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {selectedMedicine.composition || selectedMedicine.genericName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Manufactured by: <strong>{selectedMedicine.manufacturer?.name || 'Verified Lab'}</strong> ({selectedMedicine.manufacturer?.country || 'India'})
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Indications</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {selectedMedicine.indications || 'Take as indicated by licensed health professionals.'}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precautions & Warnings</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {selectedMedicine.precautions || 'Do not exceed the stated daily dosage.'}
                </p>
              </div>

              {/* Retailer Comparison Section */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Verified Retailer Quotes Comparison
                </h3>
                {selectedOffers.map(offer => (
                  <div
                    key={offer.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      marginBottom: '0.5rem',
                      background: 'var(--card-bg)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{offer.retailerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Delivery in ~{offer.deliveryEstimateDays} business days
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.125rem' }}>
                        ₹{offer.sellingPrice.toFixed(2)}
                      </div>
                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '0.25rem', fontSize: '0.6875rem' }}
                      >
                        Buy on Store ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
