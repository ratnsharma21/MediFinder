-- ==============================================================================
-- Flyway Migration V6__add_avatar_url_to_user_profiles.sql
-- Add avatar_url column to user_profiles for S3 profile photos
-- ==============================================================================

ALTER TABLE user_profiles
ADD COLUMN avatar_url VARCHAR(500) NULL AFTER phone_number;
