/**
 * Electronic Health Records (EHR) & Prescriptions Vault Module
 */

import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { User } from '../../types';
import { getAvatarUrl } from '../../utils/imageUtils';
import { medicalRecordService, HealthRecord, PatientClinicalSummary } from '../../services/medicalRecordService';

interface MedicalRecordsModuleProps {
  user: User | null;
  onNavigate: (tab: string) => void;
}

export const MedicalRecordsModule: React.FC<MedicalRecordsModuleProps> = ({ user, onNavigate }) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditSummaryModal, setShowEditSummaryModal] = useState(false);

  // Editable Patient Clinical Summary
  const [clinicalSummary, setClinicalSummary] = useState<PatientClinicalSummary>(() => {
    return medicalRecordService.getPatientSummary(user?.id);
  });
  const [editConditions, setEditConditions] = useState(clinicalSummary.activeConditions);
  const [editPhysician, setEditPhysician] = useState(clinicalSummary.primaryPhysician);
  const [editAllergies, setEditAllergies] = useState(clinicalSummary.allergies);
  const [editBloodGroup, setEditBloodGroup] = useState(clinicalSummary.bloodGroup || 'O+ Positive');

  // Form states for new document
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Prescription' | 'Lab Report' | 'Cardiology' | 'Vaccination'>('Prescription');
  const [newDoctor, setNewDoctor] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (user?.id) {
      setRecords(medicalRecordService.getUserRecords(user.id));
      const summary = medicalRecordService.getPatientSummary(user.id);
      if (user.profile?.bloodGroup) {
        summary.bloodGroup = user.profile.bloodGroup;
      }
      setClinicalSummary(summary);
      setEditConditions(summary.activeConditions);
      setEditPhysician(summary.primaryPhysician);
      setEditAllergies(summary.allergies);
      setEditBloodGroup(summary.bloodGroup || 'O+ Positive');
    } else {
      setRecords([]);
    }
  }, [user?.id, user?.profile?.bloodGroup]);

  const patientName = user?.profile?.fullName || user?.username || 'Verified Patient';

  const filteredRecords = filter === 'All'
    ? records
    : records.filter(r => r.category === filter);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !user?.id) return;

    const saved = medicalRecordService.addRecord(user.id, {
      title: newTitle.trim(),
      category: newCategory,
      doctor: newDoctor.trim() || 'Consulting Specialist',
      hospital: 'Verified Healthcare Clinic',
      fileSize: '1.2 MB PDF',
      notes: newNotes.trim() || 'Record digitally archived by patient.'
    });

    setRecords([saved, ...records]);
    setNewTitle('');
    setNewDoctor('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientClinicalSummary = {
      activeConditions: editConditions.trim() || 'None',
      primaryPhysician: editPhysician.trim() || 'Unassigned',
      allergies: editAllergies.trim() || 'None',
      bloodGroup: editBloodGroup,
    };
    if (user?.id) {
      medicalRecordService.savePatientSummary(user.id, updated);
    }
    setClinicalSummary(updated);
    setShowEditSummaryModal(false);
  };

  return (
    <div className="module-page-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <div className="badge badge-success mb-1">Encrypted EHR System</div>
          <h1 className="module-title">Medical Records & Prescriptions</h1>
          <p className="module-subtitle">
            Secure digital vault for verified prescriptions, diagnostic lab reports, and doctor clinical summaries.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <span>+</span> Upload Health Document
          </button>
        </div>
      </div>

      {/* Patient Health Summary Card */}
      <div className="patient-summary-banner">
        <div className="summary-left">
          <div className="patient-avatar-lg">
            {user?.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt={patientName} className="patient-avatar-lg-img" />
            ) : (
              patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="summary-patient-name">{patientName}</h2>
            <div className="summary-patient-tags">
              <span className="badge badge-primary">ID: MC-PAT-9021</span>
              <span className="badge badge-slate">Blood: {clinicalSummary.bloodGroup || 'O+ Positive'}</span>
              <span className="badge badge-warning">Allergy: {clinicalSummary.allergies || 'Penicillin'}</span>
            </div>
          </div>
        </div>
        <div className="summary-stats-grid">
          <div className="stat-pill">
            <span className="stat-pill-label">Total Documents</span>
            <strong className="stat-pill-value">{records.length}</strong>
          </div>
          <div
            className="stat-pill stat-pill-interactive"
            onClick={() => setShowEditSummaryModal(true)}
            title="Click to edit Active Conditions"
          >
            <div className="stat-pill-header">
              <span className="stat-pill-label">Active Conditions</span>
              <span className="edit-pill-icon">✏️</span>
            </div>
            <strong className="stat-pill-value">{clinicalSummary.activeConditions}</strong>
          </div>
          <div
            className="stat-pill stat-pill-interactive"
            onClick={() => setShowEditSummaryModal(true)}
            title="Click to edit Primary Physician"
          >
            <div className="stat-pill-header">
              <span className="stat-pill-label">Primary Physician</span>
              <span className="edit-pill-icon">✏️</span>
            </div>
            <strong className="stat-pill-value">{clinicalSummary.primaryPhysician}</strong>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm summary-edit-btn"
            onClick={() => setShowEditSummaryModal(true)}
            title="Edit clinical vitals and physician"
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="records-filter-bar">
        {['All', 'Prescription', 'Lab Report', 'Cardiology', 'Vaccination'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat} {cat === 'All' ? `(${records.length})` : `(${records.filter(r => r.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Records Grid / Empty State */}
      {filteredRecords.length > 0 ? (
        <div className="records-list-grid">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <div className="record-card-content">
                <div className="record-header">
                  <div className="record-type-icon">
                    {record.category === 'Prescription' ? '💊' : record.category === 'Lab Report' ? '🧪' : '🩺'}
                  </div>
                  <div className="record-title-area">
                    <h3 className="record-title">{record.title}</h3>
                    <div className="record-meta">
                      <span>{record.doctor}</span> • <span>{record.hospital}</span> • <span>{record.date}</span>
                    </div>
                  </div>
                  <span className={`badge ${record.category === 'Prescription' ? 'badge-primary' : 'badge-secondary'}`}>
                    {record.category}
                  </span>
                </div>

                <div className="record-body">
                  <p className="record-notes">{record.notes}</p>
                </div>

                <div className="record-footer">
                  <span className="record-filesize">📎 {record.fileSize}</span>
                  <div className="record-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => alert(`Viewing document: "${record.title}". Verification signature: SHA-256 VALID.`)}
                    >
                      👁️ View Document
                    </button>
                    {record.category === 'Prescription' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onNavigate('medicines')}
                      >
                        🛒 Order Prescribed Refills
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748B' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📁</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
              No Medical Records Uploaded Yet
            </h2>
            <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Your electronic health records vault is empty. Upload prescriptions, lab reports, or cardiology summaries to keep them securely archived.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <span>+</span> Upload First Document
            </button>
          </div>
        </Card>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Medical Document</h3>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRecord} className="modal-form">
              <div className="form-group">
                <label>Document Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Thyroid Profile & Ultrasound"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Vaccination">Vaccination</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Consulting Doctor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. A. Sharma"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Clinical Summary / Key Findings</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Enter medical notes, dosage guidelines, or laboratory findings..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Health Vitals & Physician Modal */}
      {showEditSummaryModal && (
        <div className="modal-overlay" onClick={() => setShowEditSummaryModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Health Vitals & Physician</h3>
              <button type="button" className="btn-close" onClick={() => setShowEditSummaryModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveSummary} className="modal-form">
              <div className="form-group">
                <label>Active Medical Conditions *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hypertension, Diabetes, Asthma"
                  value={editConditions}
                  onChange={(e) => setEditConditions(e.target.value)}
                  required
                />
                <span className="form-hint" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                  Current ongoing health conditions or diagnoses.
                </span>
              </div>

              <div className="form-group">
                <label>Primary Physician / Doctor *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={editPhysician}
                  onChange={(e) => setEditPhysician(e.target.value)}
                  required
                />
                <span className="form-hint" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                  Your assigned general practitioner or consulting specialist.
                </span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Known Allergies</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Penicillin, Peanuts, None"
                    value={editAllergies}
                    onChange={(e) => setEditAllergies(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    className="form-input"
                    value={editBloodGroup}
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                  >
                    <option value="A+ Positive">A+ Positive</option>
                    <option value="A- Negative">A- Negative</option>
                    <option value="B+ Positive">B+ Positive</option>
                    <option value="B- Negative">B- Negative</option>
                    <option value="AB+ Positive">AB+ Positive</option>
                    <option value="AB- Negative">AB- Negative</option>
                    <option value="O+ Positive">O+ Positive</option>
                    <option value="O- Negative">O- Negative</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditSummaryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
