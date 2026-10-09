-- ==============================================================================
-- Flyway Migration V7__clean_and_reset_seed_data.sql
-- MediFinder / MediCare - Clean Database Test Records & Reset Baseline Data
-- ==============================================================================

-- 1. Remove Any Test / Temporary Registered Users (Keep Demo Users 1, 2, 3)
DELETE FROM users WHERE id > 3 OR username NOT IN ('ratn_lead', 'demo_user', 'rahul_sharma');

-- 2. Ensure Core Demo Users Exist with Standard Demo Password (Password@123)
INSERT INTO users (id, username, email, password_hash, role, is_active, created_at, updated_at)
VALUES 
(1, 'ratn_lead', 'ratn@medicare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', TRUE, NOW(), NOW()),
(2, 'demo_user', 'user@medicare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER', TRUE, NOW(), NOW()),
(3, 'rahul_sharma', 'rahul@medicare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    is_active = TRUE,
    updated_at = NOW();

-- 3. Ensure Core Demo User Profiles
INSERT INTO user_profiles (id, user_id, full_name, phone_number, date_of_birth, gender, blood_group, emergency_contact, address, city, state, postal_code, created_at, updated_at)
VALUES
(1, 1, 'Ratn Sharma (Backend Lead)', '+91 9876543210', '1998-05-15', 'Male', 'O+', '+91 9876543211', '101 Tech Residency, Whitefield', 'Bengaluru', 'Karnataka', '560066', NOW(), NOW()),
(2, 2, 'Jane Customer (Demo)', '+91 9123456780', '1995-08-20', 'Female', 'A+', '+91 9123456781', '402 Green Meadows, Indiranagar', 'Bengaluru', 'Karnataka', '560038', NOW(), NOW()),
(3, 3, 'Rahul Sharma (Patient Care)', '+91 9988776655', '1992-11-10', 'Male', 'B+', '+91 9988776654', '12 Sector 14, Gurugram', 'Gurugram', 'Haryana', '122001', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    full_name = VALUES(full_name),
    phone_number = VALUES(phone_number),
    city = VALUES(city),
    state = VALUES(state),
    updated_at = NOW();

-- 4. Ensure Core User Settings
INSERT INTO user_settings (id, user_id, email_notifications_enabled, sms_notifications_enabled, browser_notifications_enabled, in_app_notifications_enabled, dark_mode, reminder_sound, created_at, updated_at)
VALUES
(1, 1, TRUE, FALSE, TRUE, TRUE, TRUE, 'chime', NOW(), NOW()),
(2, 2, TRUE, FALSE, TRUE, TRUE, FALSE, 'default', NOW(), NOW()),
(3, 3, TRUE, TRUE, TRUE, TRUE, FALSE, 'gentle_bell', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    email_notifications_enabled = VALUES(email_notifications_enabled),
    updated_at = NOW();

-- 5. Clean / Reset Demo Reminders for User 2 (demo_user) and User 3 (rahul_sharma)
DELETE FROM dose_logs WHERE user_id NOT IN (2, 3);
DELETE FROM reminders WHERE user_id NOT IN (2, 3);

INSERT INTO reminders (id, user_id, medicine_id, custom_medicine_name, dosage, unit, frequency, time_of_day, start_date, end_date, instructions, is_active, created_at, updated_at)
VALUES
(1, 2, 1, 'Dolo 650 Tablet', '1 tablet', 'tablet', 'TWICE_DAILY', '09:00, 21:00', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), 'Take after meals for fever', TRUE, NOW(), NOW()),
(2, 2, 3, 'Pan 40 Tablet', '1 tablet', 'tablet', 'ONCE_DAILY', '07:30', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY), 'Take before breakfast with water', TRUE, NOW(), NOW()),
(3, 3, 4, 'Telma 40 Tablet', '1 tablet', 'tablet', 'ONCE_DAILY', '08:00', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 90 DAY), 'Take every morning for blood pressure', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    instructions = VALUES(instructions),
    is_active = TRUE,
    updated_at = NOW();
