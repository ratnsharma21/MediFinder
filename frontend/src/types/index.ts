// ==============================================================================
// MediFinder / MediCare - Shared Frontend TypeScript Interfaces
// Integration Contract for Members 1, 2, 3, 4, 5
// ==============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_PHARMACIST';
  active: boolean;
  profile?: UserProfile;
  settings?: UserSettings;
  createdAt: string;
}

export interface UserProfile {
  id?: number;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface UserSettings {
  id?: number;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
  darkMode: boolean;
  reminderSound: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface Manufacturer {
  id: number;
  name: string;
  country: string;
  website?: string;
  contactEmail?: string;
  verified: boolean;
}

export interface RetailerOffer {
  id: number;
  retailerId: number;
  retailerName: string;
  retailerLogoUrl?: string;
  retailerRating?: number;
  sellingPrice: number;
  discountPercent: number;
  productUrl: string;
  inStock: boolean;
  deliveryEstimateDays: number;
}

export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  brandName?: string;
  category: string;
  dosageForm: string;
  strength?: string;
  packSize?: string;
  requiresPrescription: boolean;
  mrp: number;
  manufacturerName?: string;
  imageUrl?: string;
  available: boolean;
  lowestPrice?: number;
}

export interface MedicineDetail extends Medicine {
  composition?: string;
  indications?: string;
  sideEffects?: string;
  precautions?: string;
  storageInstructions?: string;
  manufacturer?: Manufacturer;
  offers?: RetailerOffer[];
  updatedAt?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  licenseNumber?: string;
  contactNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  openingTime?: string;
  closingTime?: string;
  is24Hours: boolean;
  verified: boolean;
  rating?: number;
  distanceInKm?: number;
}

export interface Reminder {
  id: number;
  userId: number;
  medicineId?: number;
  customMedicineName: string;
  dosage: string;
  unit: string;
  frequency: string;
  timeOfDay: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type DoseStatus = 'TAKEN' | 'MISSED' | 'SKIPPED';

export interface DoseLog {
  id: number;
  reminderId: number;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  actualTime?: string;
  status: DoseStatus;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'REMINDER' | 'SYSTEM' | 'OFFER';
  channel: 'IN_APP' | 'BROWSER' | 'EMAIL' | 'SMS';
  read: boolean;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}
