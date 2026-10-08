# MediCare / MediFinder - Database Architecture & Design

**Author**: Ratn (Backend Lead & Database Architect)  
**RDBMS**: MySQL 8.0+  
**Schema Engine**: InnoDB  
**Character Set**: `utf8mb4` (Collation: `utf8mb4_unicode_ci`)  
**Evolution Tool**: Flyway Database Migrations (`V1__initial_schema.sql`, `V2__seed_demo_data.sql`)  

---

## 1. Entity Relationship (ER) Model

```
                    ┌─────────────────────────┐
                    │      manufacturers      │
                    └────────────┬────────────┘
                                 │ 1:N
                                 ▼
┌──────────────┐ 1:N ┌─────────────────────────┐ N:1 ┌──────────────┐
│  retailers   ├────►│     retailer_offers     │◄────┤  medicines   │
└──────────────┘     └─────────────────────────┘     └──────┬───────┘
                                                            │ 1:N
                                                            ▼
┌──────────────┐ 1:1 ┌─────────────────────────┐ 1:N ┌────────────────┐
│user_profiles │◄────┤          users          ├────►│   reminders    │
└──────────────┘     └───────────┬─────────────┘     └──────┬─────────┘
                                 │ 1:N                      │ 1:N
                                 ▼                          ▼
                     ┌─────────────────────────┐     ┌────────────────┐
                     │      notifications      │     │   dose_logs    │
                     └─────────────────────────┘     └────────────────┘
```

---

## 2. Table Specifications & Indexes

### 1. `users`
- `id` (BIGINT, PK, Auto-increment)
- `username` (VARCHAR(50), UNIQUE, NOT NULL, INDEX)
- `email` (VARCHAR(100), UNIQUE, NOT NULL, INDEX)
- `password_hash` (VARCHAR(255), NOT NULL) - BCrypt 10 rounds
- `role` (VARCHAR(20), NOT NULL, DEFAULT 'ROLE_USER')
- `is_active` (BOOLEAN, NOT NULL, DEFAULT TRUE)
- `created_at`, `updated_at` (TIMESTAMP)

### 2. `user_profiles`
- `id` (BIGINT, PK, Auto-increment)
- `user_id` (BIGINT, UNIQUE, NOT NULL, FK -> users.id ON DELETE CASCADE)
- `full_name`, `phone_number`, `date_of_birth`, `gender`, `blood_group`, `emergency_contact`, `address`, `city`, `state`, `postal_code`

### 3. `user_settings`
- `id` (BIGINT, PK, Auto-increment)
- `user_id` (BIGINT, UNIQUE, NOT NULL, FK -> users.id ON DELETE CASCADE)
- `email_notifications_enabled`, `sms_notifications_enabled`, `browser_notifications_enabled`, `in_app_notifications_enabled`, `dark_mode`, `reminder_sound`

### 4. `manufacturers`
- `id` (BIGINT, PK, Auto-increment)
- `name` (VARCHAR(150), UNIQUE, NOT NULL, INDEX)
- `country`, `website`, `contact_email`, `is_verified`

### 5. `medicines`
- `id` (BIGINT, PK, Auto-increment)
- `name` (VARCHAR(150), NOT NULL, INDEX)
- `generic_name` (VARCHAR(150), NOT NULL, INDEX)
- `brand_name` (VARCHAR(150), INDEX)
- `category` (VARCHAR(100), NOT NULL, INDEX)
- `dosage_form`, `strength`, `pack_size`, `composition`, `indications`, `side_effects`, `precautions`, `storage_instructions`
- `requires_prescription` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `mrp` (DECIMAL(10,2), NOT NULL, INDEX)
- `manufacturer_id` (BIGINT, FK -> manufacturers.id ON DELETE SET NULL)
- `image_url`, `is_available`

### 6. `retailers`
- `id` (BIGINT, PK, Auto-increment)
- `name` (VARCHAR(100), UNIQUE, NOT NULL, INDEX)
- `website_url`, `logo_url`, `rating`, `is_verified`

### 7. `retailer_offers`
- `id` (BIGINT, PK, Auto-increment)
- `medicine_id` (BIGINT, NOT NULL, FK -> medicines.id ON DELETE CASCADE)
- `retailer_id` (BIGINT, NOT NULL, FK -> retailers.id ON DELETE CASCADE)
- `selling_price` (DECIMAL(10,2), NOT NULL, INDEX)
- `discount_percent`, `product_url`, `in_stock`, `delivery_estimate_days`
- CONSTRAINT `uk_medicine_retailer` UNIQUE (`medicine_id`, `retailer_id`)

### 8. `pharmacies`
- `id` (BIGINT, PK, Auto-increment)
- `name`, `license_number`, `contact_number`, `email`, `address`
- `city` (INDEX), `state`, `postal_code` (INDEX)
- `latitude` (DECIMAL(10,8), INDEX), `longitude` (DECIMAL(11,8), INDEX)
- `opening_time`, `closing_time`, `is_24_hours` (INDEX), `is_verified`, `rating`

### 9. `reminders`
- `id` (BIGINT, PK, Auto-increment)
- `user_id` (BIGINT, NOT NULL, FK -> users.id ON DELETE CASCADE)
- `medicine_id` (BIGINT, NULLABLE, FK -> medicines.id ON DELETE SET NULL)
- `custom_medicine_name`, `dosage`, `unit`, `frequency`, `time_of_day`, `start_date`, `end_date`, `instructions`, `is_active`

### 10. `dose_logs`
- `id` (BIGINT, PK, Auto-increment)
- `reminder_id` (BIGINT, NOT NULL, FK -> reminders.id ON DELETE CASCADE)
- `user_id` (BIGINT, NOT NULL, FK -> users.id ON DELETE CASCADE)
- `scheduled_time` (DATETIME, NOT NULL, INDEX), `actual_time`
- `status` (VARCHAR(20), NOT NULL, DEFAULT 'TAKEN', INDEX)
- `notes`

### 11. `saved_medicines`
- `id` (BIGINT, PK, Auto-increment)
- `user_id` (BIGINT, NOT NULL, FK -> users.id ON DELETE CASCADE)
- `medicine_id` (BIGINT, NOT NULL, FK -> medicines.id ON DELETE CASCADE)
- `notes`, `created_at`
- CONSTRAINT `uk_user_saved_medicine` UNIQUE (`user_id`, `medicine_id`)

### 12. `notifications`
- `id` (BIGINT, PK, Auto-increment)
- `user_id` (BIGINT, NOT NULL, FK -> users.id ON DELETE CASCADE)
- `title`, `message`, `type` (`REMINDER`, `SYSTEM`, `OFFER`), `channel` (`IN_APP`, `BROWSER`, `EMAIL`, `SMS`), `is_read` (INDEX), `scheduled_for`, `sent_at`

---

## 3. Flyway Migration Strategy

- Migrations are versioned under `backend/src/main/resources/db/migration/`.
- `V1__initial_schema.sql`: Table definitions, foreign key constraints, indexes.
- `V2__seed_demo_data.sql`: Safe seed records with hashed demonstration user passwords.
- Flyway automatically checks schema version on startup when running against MySQL.
- Standalone SQL files are provided in `database/schema.sql` and `database/seed-demo-data.sql` for manual execution in MySQL Workbench or CLI.
