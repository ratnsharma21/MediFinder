// ==============================================================================
// MediFinder / MediCare - Medicine Service
// Integration Contract for Member 2 (Vansh)
// ==============================================================================

import { request } from './api';
import { ApiResponse, PagedResponse, Medicine, MedicineDetail, RetailerOffer } from '../types';

export interface MedicineQueryParams {
  query?: string;
  category?: string;
  requiresPrescription?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export const medicineService = {
  async getMedicines(params: MedicineQueryParams = {}): Promise<PagedResponse<Medicine>> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.category && params.category !== 'All Categories') searchParams.append('category', params.category);
    if (params.requiresPrescription !== undefined) searchParams.append('requiresPrescription', String(params.requiresPrescription));
    if (params.minPrice !== undefined) searchParams.append('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', String(params.maxPrice));
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size !== undefined) searchParams.append('size', String(params.size));
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);

    const queryString = searchParams.toString();
    const endpoint = `/medicines${queryString ? `?${queryString}` : ''}`;
    const res = await request<ApiResponse<PagedResponse<Medicine>>>(endpoint);
    return res.data;
  },

  async getMedicineById(id: number): Promise<MedicineDetail> {
    const res = await request<ApiResponse<MedicineDetail>>(`/medicines/${id}`);
    return res.data;
  },

  async getMedicineOffers(id: number): Promise<RetailerOffer[]> {
    const res = await request<ApiResponse<RetailerOffer[]>>(`/medicines/${id}/offers`);
    return res.data;
  },

  async getCategories(): Promise<string[]> {
    const res = await request<ApiResponse<string[]>>('/medicines/categories');
    return res.data;
  },

  async getSavedMedicines(): Promise<any[]> {
    const res = await request<ApiResponse<any[]>>('/saved-medicines', { requiresAuth: true });
    return res.data;
  },

  async saveMedicine(medicineId: number, notes?: string): Promise<any> {
    const res = await request<ApiResponse<any>>(`/saved-medicines/${medicineId}`, {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify({ notes }),
    });
    return res.data;
  },

  async removeSavedMedicine(medicineId: number): Promise<void> {
    await request<ApiResponse<void>>(`/saved-medicines/${medicineId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  }
};
