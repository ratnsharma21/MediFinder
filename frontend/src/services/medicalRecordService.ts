/**
 * Electronic Health Records (EHR) & Clinical Documents Service
 * Manages user-isolated prescriptions, lab reports, and doctor consultations
 */

export interface HealthRecord {
  id: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Cardiology' | 'Vaccination';
  doctor: string;
  hospital: string;
  date: string;
  fileSize: string;
  notes: string;
}

export const medicalRecordService = {
  getUserRecords(userId?: number | null): HealthRecord[] {
    if (!userId) return [];
    try {
      const key = `medicare_ehr_u_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  },

  addRecord(userId: number, record: Omit<HealthRecord, 'id' | 'date'>): HealthRecord {
    const existing = this.getUserRecords(userId);
    const newRecord: HealthRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newRecord, ...existing];
    try {
      localStorage.setItem(`medicare_ehr_u_${userId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newRecord;
  },

  deleteRecord(userId: number, recordId: string): void {
    const existing = this.getUserRecords(userId);
    const updated = existing.filter(r => r.id !== recordId);
    try {
      localStorage.setItem(`medicare_ehr_u_${userId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  clearUserRecords(userId: number): void {
    localStorage.removeItem(`medicare_ehr_u_${userId}`);
  }
};
