-- ==============================================================================
-- MediFinder Database Migration V3
-- Feature: Pharmacy Locator & Search Performance Indexes
-- Author: Sumit (Member 3 - Pharmacy Locator & Maps Lead)
-- ==============================================================================

-- 1. Index on pharmacy name for store title auto-completion and substring search
CREATE INDEX idx_pharmacies_name ON pharmacies (name);

-- 2. Index on verified status to quickly filter legitimate registered medical stores
CREATE INDEX idx_pharmacies_verified ON pharmacies (is_verified);

-- 3. Composite index for combined city and 24x7 emergency store lookups
CREATE INDEX idx_pharmacies_city_24h ON pharmacies (city, is_24_hours);
