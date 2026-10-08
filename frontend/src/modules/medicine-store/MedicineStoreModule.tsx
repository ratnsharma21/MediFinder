// ==============================================================================
// MediFinder / MediCare - Medicine Store & Catalogue Module
// Primary Owner: Member 2 (Vansh) - feature/medicine-catalogue, feature/medicine-search
// Backend Integration: /api/medicines, /api/medicines/{id}, /api/medicines/{id}/offers
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Medicine, MedicineDetail, RetailerOffer } from '../../types';
import { medicineService } from '../../services/medicineService';
import { MEDICINE_CATEGORIES } from '../../utils/constants';

export const MedicineStoreModule: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDetail | null>(null);
  const [selectedOffers, setSelectedOffers] = useState<RetailerOffer[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getMedicines({
        query: query.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        size: 12
      });
      setMedicines(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch medicines', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines();
  };

  const handleSelectMedicine = async (med: Medicine) => {
    try {
      const detail = await medicineService.getMedicineById(med.id);
      setSelectedMedicine(detail);
      const offers = await medicineService.getMedicineOffers(med.id);
      setSelectedOffers(offers);
    } catch (err) {
      console.error('Failed to load medicine details', err);
    }
  };

  return (
    <div>
      {/* Header & Search Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Medicine Discovery & Store
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Search trusted medicines, compare online pharmacy prices, and verify manufacturer formulations.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: '1 1 300px' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by medicine name, generic salt (e.g. Paracetamol), brand..."
          />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '200px' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {MEDICINE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMedicine ? '1fr 420px' : '1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {medicines.length} of {totalElements} medicines
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading medicine catalogue...
            </div>
          ) : medicines.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No medicines found matching your search criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-3">
              {medicines.map(med => (
                <div
                  key={med.id}
                  className="card"
                  onClick={() => handleSelectMedicine(med)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderColor: selectedMedicine?.id === med.id ? 'var(--primary)' : 'var(--border)',
                    boxShadow: selectedMedicine?.id === med.id ? '0 0 0 2px var(--primary-light)' : undefined
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{med.category}</span>
                      {med.requiresPrescription && (
                        <span className="badge badge-warning" title="Prescription Required (Rx)">Rx</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {med.name}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {med.genericName} {med.strength ? `• ${med.strength}` : ''}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                      By {med.manufacturerName || 'Verified Manufacturer'} • {med.packSize || 'Standard Pack'}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Best Online Price</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>
                        ₹{med.lowestPrice ? med.lowestPrice.toFixed(2) : med.mrp.toFixed(2)}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                      Compare Offers →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Medicine Detail Sidebar */}
        {selectedMedicine && (
          <div>
            <Card
              title={selectedMedicine.name}
              subtitle={selectedMedicine.genericName}
              headerAction={
                <button
                  onClick={() => setSelectedMedicine(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">{selectedMedicine.category}</span>
                  <span className="badge badge-secondary">{selectedMedicine.dosageForm}</span>
                  {selectedMedicine.requiresPrescription && (
                    <span className="badge badge-warning">Prescription Required (Rx)</span>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Formulation & Strength
                  </div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {selectedMedicine.composition || selectedMedicine.genericName} ({selectedMedicine.strength})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Indications / Usage
                  </div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: 'var(--text-main)' }}>
                    {selectedMedicine.indications || 'Used as prescribed by physician.'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Precautions & Storage
                  </div>
                  <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                    {selectedMedicine.precautions} | {selectedMedicine.storageInstructions}
                  </div>
                </div>

                {/* Verified Retailer Price Comparison */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                    🛒 Verified Online Retailer Quotes
                  </div>

                  {selectedOffers.length === 0 ? (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      No verified partner pricing offers indexed currently for this medicine.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedOffers.map(offer => (
                        <div
                          key={offer.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.625rem 0.875rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--border-light)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{offer.retailerName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              ⭐ {offer.retailerRating} • {offer.deliveryEstimateDays} day delivery
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1rem' }}>
                              ₹{offer.sellingPrice.toFixed(2)}
                            </div>
                            <a
                              href={offer.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm"
                              style={{ marginTop: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}
                            >
                              Buy on Retailer ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
