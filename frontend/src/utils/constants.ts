/**
 * MediFinder Application Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const TOKEN_STORAGE_KEY = 'medifinder_auth_token';
export const USER_STORAGE_KEY = 'medifinder_user_data';

export const MEDICINE_CATEGORIES = [
  'All Categories',
  'Analgesic & Antipyretic',
  'Antibiotic',
  'Antacid & Gastrointestinal',
  'Cardiological / Antihypertensive',
  'Antidiabetic',
  'Antiallergic',
  'Supplements & Vitamins',
  'Analgesic & Anti-inflammatory'
];

export const FREQUENCY_OPTIONS = [
  { label: 'Once Daily', value: 'ONCE_DAILY' },
  { label: 'Twice Daily', value: 'TWICE_DAILY' },
  { label: 'Thrice Daily', value: 'THRICE_DAILY' },
  { label: 'Four Times Daily', value: 'FOUR_TIMES_DAILY' },
  { label: 'Every 8 Hours', value: 'EVERY_8_HOURS' },
  { label: 'As Needed (SOS)', value: 'AS_NEEDED' }
];

export const DOSAGE_UNITS = [
  'tablet',
  'capsule',
  'ml',
  'drops',
  'puff',
  'injection',
  'application'
];
