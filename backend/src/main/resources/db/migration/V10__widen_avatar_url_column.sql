-- ==============================================================================
-- Flyway Migration V10__widen_avatar_url_column.sql
-- Widen avatar_url column to LONGTEXT to support base64 data URI fallback
-- ==============================================================================

ALTER TABLE user_profiles
MODIFY COLUMN avatar_url LONGTEXT;
