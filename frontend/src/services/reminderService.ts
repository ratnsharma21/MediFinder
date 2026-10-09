// ==============================================================================
// MediFinder / MediCare - Reminder & Dose Log Service
// Integration Contract for Member 4 (Sameer)
// ==============================================================================

import { request } from './api';
import { ApiResponse, Reminder, DoseLog, DoseStatus } from '../types';

export interface CreateReminderPayload {
  medicineId?: number;
  customMedicineName: string;
  dosage: string;
  unit?: string;
  frequency: string;
  timeOfDay: string;
  startDate: string;
  endDate?: string | null;
  instructions?: string;
  active?: boolean;
}

export interface LogDosePayload {
  reminderId: number;
  scheduledTime: string;
  actualTime?: string;
  status: DoseStatus;
  notes?: string;
}

export const reminderService = {
  async getReminders(): Promise<Reminder[]> {
    const res = await request<ApiResponse<Reminder[]>>('/reminders', { requiresAuth: true });
    return res.data;
  },

  async getReminderById(id: number): Promise<Reminder> {
    const res = await request<ApiResponse<Reminder>>(`/reminders/${id}`, { requiresAuth: true });
    return res.data;
  },

  async createReminder(payload: CreateReminderPayload): Promise<Reminder> {
    const res = await request<ApiResponse<Reminder>>('/reminders', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateReminder(id: number, payload: Partial<CreateReminderPayload>): Promise<Reminder> {
    const res = await request<ApiResponse<Reminder>>(`/reminders/${id}`, {
      method: 'PATCH',
      requiresAuth: true,
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteReminder(id: number): Promise<void> {
    await request<ApiResponse<void>>(`/reminders/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  async getDoseLogs(reminderId?: number): Promise<DoseLog[]> {
    const query = reminderId !== undefined ? `?reminderId=${reminderId}` : '';
    const res = await request<ApiResponse<DoseLog[]>>(`/dose-logs${query}`, { requiresAuth: true });
    return res.data;
  },

  async logDose(payload: LogDosePayload): Promise<DoseLog> {
    const res = await request<ApiResponse<DoseLog>>('/dose-logs', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateDoseStatus(id: number, status: DoseStatus, notes?: string): Promise<DoseLog> {
    const res = await request<ApiResponse<DoseLog>>(`/dose-logs/${id}`, {
      method: 'PATCH',
      requiresAuth: true,
      body: JSON.stringify({ status, notes }),
    });
    return res.data;
  }
};
