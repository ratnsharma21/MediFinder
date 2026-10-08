// ==============================================================================
// MediFinder / MediCare - Pharmacy Service
// Integration Contract for Member 3 (Sumit)
// Feature: feature/pharmacy-search
// ==============================================================================

import { request } from './api';
import { ApiResponse, PagedResponse, Pharmacy } from '../types';

export interface PharmacyQueryParams {
  query?: string;
  city?: string;
  postalCode?: string;
  is24Hours?: boolean;
  latitude?: number;
  longitude?: number;
  page?: number;
  size?: number;
}

export const pharmacyService = {
  async getPharmacies(params: PharmacyQueryParams = {}): Promise<PagedResponse<Pharmacy>> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.city) searchParams.append('city', params.city);
    if (params.postalCode) searchParams.append('postalCode', params.postalCode);
    if (params.is24Hours !== undefined) searchParams.append('is24Hours', String(params.is24Hours));
    if (params.latitude !== undefined) searchParams.append('latitude', String(params.latitude));
    if (params.longitude !== undefined) searchParams.append('longitude', String(params.longitude));
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size !== undefined) searchParams.append('size', String(params.size));

    const queryString = searchParams.toString();
    const endpoint = `/pharmacies${queryString ? `?${queryString}` : ''}`;
    const res = await request<ApiResponse<PagedResponse<Pharmacy>>>(endpoint);
    return res.data;
  },

  async getPharmacyById(id: number): Promise<Pharmacy> {
    const res = await request<ApiResponse<Pharmacy>>(`/pharmacies/${id}`);
    return res.data;
  },

  async getNearbyPharmacies(latitude: number, longitude: number, radiusInKm: number = 10.0): Promise<Pharmacy[]> {
    const searchParams = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radiusInKm: String(radiusInKm),
    });
    const res = await request<ApiResponse<Pharmacy[]>>(`/pharmacies/nearby?${searchParams.toString()}`);
    return res.data;
  }
};