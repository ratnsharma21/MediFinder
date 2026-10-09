-- ==============================================================================
-- MediFinder / MediCare - Initial Database Schema (V1)
-- Database Architecture & Schema Specification
-- Author: Ratn (Backend Lead & Database Architect)
-- Engine: MySQL 8.0+ / InnoDB
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_profiles_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    browser_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_sound VARCHAR(50) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_settings_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Manufacturers Table
CREATE TABLE IF NOT EXISTS manufacturers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    country VARCHAR(100) DEFAULT 'India',
    website VARCHAR(255),
    contact_email VARCHAR(100),
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_manufacturers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150) NOT NULL,
    brand_name VARCHAR(150),
    category VARCHAR(100) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    strength VARCHAR(50),
    pack_size VARCHAR(50),
    composition TEXT,
    indications TEXT,
    side_effects TEXT,
    precautions TEXT,
    storage_instructions VARCHAR(255),
    requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
    mrp DECIMAL(10, 2) NOT NULL,
    manufacturer_id BIGINT,
    image_url VARCHAR(500),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_medicine_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (id) ON DELETE SET NULL,
    INDEX idx_medicines_name (name),
    INDEX idx_medicines_generic (generic_name),
    INDEX idx_medicines_brand (brand_name),
    INDEX idx_medicines_category (category),
    INDEX idx_medicines_mrp (mrp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Retailers Table
CREATE TABLE IF NOT EXISTS retailers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    website_url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 4.50,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_retailers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Retailer Offers Table (Price Comparisons)
CREATE TABLE IF NOT EXISTS retailer_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id BIGINT NOT NULL,
    retailer_id BIGINT NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    product_url VARCHAR(500) NOT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    delivery_estimate_days INT DEFAULT 2,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_offer_medicine FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE CASCADE,
    CONSTRAINT fk_offer_retailer FOREIGN KEY (retailer_id) REFERENCES retailers (id) ON DELETE CASCADE,
    CONSTRAINT uk_medicine_retailer UNIQUE (medicine_id, retailer_id),
    INDEX idx_offers_medicine (medicine_id),
    INDEX idx_offers_retailer (retailer_id),
    INDEX idx_offers_selling_price (selling_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Pharmacies Table
CREATE TABLE IF NOT EXISTS pharmacies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    license_number VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    opening_time TIME DEFAULT '08:00:00',
    closing_time TIME DEFAULT '22:00:00',
    is_24_hours BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 4.50,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pharmacies_city (city),
    INDEX idx_pharmacies_postal (postal_code),
    INDEX idx_pharmacies_lat_lng (latitude, longitude),
    INDEX idx_pharmacies_24h (is_24_hours),
    INDEX idx_pharmacies_name (name),
    INDEX idx_pharmacies_verified (is_verified),
    INDEX idx_pharmacies_city_24h (city, is_24_hours)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    medicine_id BIGINT,
    custom_medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    unit VARCHAR(30) DEFAULT 'tablet',
    frequency VARCHAR(50) NOT NULL,
    time_of_day VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    instructions VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reminder_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_reminder_medicine FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE SET NULL,
    INDEX idx_reminders_user_active (user_id, is_active),
    INDEX idx_reminders_user_schedule (user_id, is_active, start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Dose Logs Table (Adherence Tracking)
CREATE TABLE IF NOT EXISTS dose_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reminder_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    actual_time DATETIME,
    status VARCHAR(20) NOT NULL DEFAULT 'TAKEN',
    notes VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dose_reminder FOREIGN KEY (reminder_id) REFERENCES reminders (id) ON DELETE CASCADE,
    CONSTRAINT fk_dose_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_dose_logs_user_time (user_id, scheduled_time),
    INDEX idx_dose_logs_reminder_time (reminder_id, scheduled_time),
    INDEX idx_dose_logs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Saved Medicines Table (Bookmarks/Watchlist)
CREATE TABLE IF NOT EXISTS saved_medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_medicine FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_saved_medicine UNIQUE (user_id, medicine_id),
    INDEX idx_saved_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'REMINDER',
    channel VARCHAR(30) NOT NULL DEFAULT 'IN_APP',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    scheduled_for DATETIME,
    sent_at DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, is_read),
    INDEX idx_notifications_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
