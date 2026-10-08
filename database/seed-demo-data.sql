-- ==============================================================================
-- MediFinder / MediCare - Initial Seed / Demonstration Data (V2)
-- Safe demonstration dataset with clearly labeled sample records
-- Password for demo users: Password@123
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ==============================================================================

-- 1. Demo Users
INSERT INTO users (id, username, email, password_hash, role, is_active, created_at, updated_at)
VALUES 
(1, 'ratn_lead', 'ratn@medicare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', TRUE, NOW(), NOW()),
(2, 'demo_user', 'user@medicare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER', TRUE, NOW(), NOW()),
(3, 'rahul_sharma', 'rahul@medicare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 2. Demo User Profiles
INSERT INTO user_profiles (id, user_id, full_name, phone_number, date_of_birth, gender, blood_group, emergency_contact, address, city, state, postal_code, created_at, updated_at)
VALUES
(1, 1, 'Ratn Sharma (Backend Lead)', '+91 9876543210', '1998-05-15', 'Male', 'O+', '+91 9876543211', '101 Tech Residency, Whitefield', 'Bengaluru', 'Karnataka', '560066', NOW(), NOW()),
(2, 2, 'Jane Customer (Demo)', '+91 9123456780', '1995-08-20', 'Female', 'A+', '+91 9123456781', '402 Green Meadows, Indiranagar', 'Bengaluru', 'Karnataka', '560038', NOW(), NOW()),
(3, 3, 'Rahul Sharma (Patient Care)', '+91 9988776655', '1992-11-10', 'Male', 'B+', '+91 9988776654', '12 Sector 14, Gurugram', 'Gurugram', 'Haryana', '122001', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 3. Demo User Settings
INSERT INTO user_settings (id, user_id, email_notifications_enabled, sms_notifications_enabled, browser_notifications_enabled, in_app_notifications_enabled, dark_mode, reminder_sound, created_at, updated_at)
VALUES
(1, 1, TRUE, FALSE, TRUE, TRUE, TRUE, 'chime', NOW(), NOW()),
(2, 2, TRUE, FALSE, TRUE, TRUE, FALSE, 'default', NOW(), NOW()),
(3, 3, TRUE, TRUE, TRUE, TRUE, FALSE, 'gentle_bell', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 4. Demo Manufacturers
INSERT INTO manufacturers (id, name, country, website, contact_email, is_verified, created_at)
VALUES
(1, 'Cipla Ltd', 'India', 'https://www.cipla.com', 'contact@cipla.com', TRUE, NOW()),
(2, 'Sun Pharmaceutical Industries Ltd', 'India', 'https://www.sunpharma.com', 'info@sunpharma.com', TRUE, NOW()),
(3, 'Dr. Reddy''s Laboratories', 'India', 'https://www.drreddys.com', 'support@drreddys.com', TRUE, NOW()),
(4, 'Abbott India', 'India', 'https://www.abbott.co.in', 'customercare@abbott.co.in', TRUE, NOW()),
(5, 'GlaxoSmithKline Pharmaceuticals Ltd', 'India', 'https://india-pharma.gsk.com', 'gsk.india@gsk.com', TRUE, NOW()),
(6, 'Torrent Pharmaceuticals', 'India', 'https://www.torrentpharma.com', 'info@torrentpharma.com', TRUE, NOW()),
(7, 'Lupin Limited', 'India', 'https://www.lupin.com', 'contact@lupin.com', TRUE, NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. Demo Medicines
INSERT INTO medicines (id, name, generic_name, brand_name, category, dosage_form, strength, pack_size, composition, indications, side_effects, precautions, storage_instructions, requires_prescription, mrp, manufacturer_id, image_url, is_available, created_at, updated_at)
VALUES
(1, 'Dolo 650 Tablet', 'Paracetamol', 'Dolo', 'Analgesic & Antipyretic', 'Tablet', '650 mg', '15 Tablets in 1 Strip', 'Paracetamol / Acetaminophen (650mg)', 'Fever, headache, body aches, mild to moderate pain', 'Nausea, allergic skin rash (rare), liver strain with overdose', 'Do not exceed 4000mg per day. Avoid excessive alcohol consumption.', 'Store in a cool, dry place away from direct sunlight below 25°C', FALSE, 34.00, 1, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(2, 'Augmentin 625 Duo Tablet', 'Amoxicillin and Potassium Clavulanate', 'Augmentin', 'Antibiotic', 'Tablet', '625 mg', '10 Tablets in 1 Strip', 'Amoxicillin (500mg) + Clavulanic Acid (125mg)', 'Bacterial infections of the respiratory tract, ear, sinus, skin, and urinary tract', 'Diarrhea, nausea, vomiting, skin rashes, fungal infections', 'Complete full course as prescribed. Inform doctor of penicillin allergies.', 'Store protected from moisture at temperatures below 25°C', TRUE, 223.50, 5, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(3, 'Pan 40 Tablet', 'Pantoprazole', 'Pan', 'Antacid & Gastrointestinal', 'Tablet', '40 mg', '15 Tablets in 1 Strip', 'Pantoprazole Sodium (40mg)', 'Gastroesophageal reflux disease (GERD), acidity, peptic ulcers, heartburn', 'Headache, diarrhea, dizziness, flatulence, abdominal pain', 'Best taken 30-60 minutes before breakfast on an empty stomach.', 'Store in original container below 30°C', TRUE, 175.00, 4, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(4, 'Telma 40 Tablet', 'Telmisartan', 'Telma', 'Cardiological / Antihypertensive', 'Tablet', '40 mg', '30 Tablets in 1 Strip', 'Telmisartan (40mg)', 'Essential hypertension (high blood pressure), cardiovascular risk reduction', 'Dizziness, back pain, sinus congestion, fatigue', 'Monitor blood pressure regularly. Do not discontinue without physician guidance.', 'Store in a cool dry place protected from light and moisture', TRUE, 240.00, 6, 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(5, 'Glycomet-GP 2 Tablet', 'Metformin + Glimepiride', 'Glycomet-GP', 'Antidiabetic', 'Tablet', '2 mg / 500 mg', '15 Tablets in 1 Strip', 'Glimepiride (2mg) + Metformin Hydrochloride (500mg)', 'Type 2 Diabetes Mellitus glycemic control', 'Hypoglycemia (low blood sugar), gastrointestinal disturbance, metallic taste', 'Take with breakfast. Carry glucose candy in case of sudden dizziness.', 'Store below 25°C in a dry place', TRUE, 195.00, 2, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(6, 'Allegra 120mg Tablet', 'Fexofenadine', 'Allegra', 'Antiallergic', 'Tablet', '120 mg', '10 Tablets in 1 Strip', 'Fexofenadine Hydrochloride (120mg)', 'Seasonal allergic rhinitis, runny nose, sneezing, itchy eyes, hives', 'Drowsiness (minimal), headache, dry mouth', 'Do not take with fruit juices (apple, orange, grapefruit) as it reduces absorption.', 'Store at room temperature', FALSE, 218.00, 4, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(7, 'Shelcal 500 Tablet', 'Calcium + Vitamin D3', 'Shelcal', 'Supplements & Vitamins', 'Tablet', '500 mg / 250 IU', '15 Tablets in 1 Strip', 'Elemental Calcium (500mg) + Cholecalciferol / Vitamin D3 (250 IU)', 'Calcium deficiency, osteoporosis, bone strength and dental health maintenance', 'Constipation, stomach upset in rare instances', 'Take after food for optimum absorption. Maintain adequate hydration.', 'Store in a cool, dry place', FALSE, 131.00, 6, 'https://images.unsplash.com/photo-1550572017-edb0a390ba03?w=600&auto=format&fit=crop', TRUE, NOW(), NOW()),
(8, 'Combiflam Tablet', 'Ibuprofen and Paracetamol', 'Combiflam', 'Analgesic & Anti-inflammatory', 'Tablet', '400 mg / 325 mg', '20 Tablets in 1 Strip', 'Ibuprofen (400mg) + Paracetamol (325mg)', 'Dental pain, muscular strain, arthritis pain, fever with body inflammation', 'Heartburn, nausea, stomach ache', 'Take with meals or milk to prevent gastric irritation. Avoid if ulcer history.', 'Store below 30°C', FALSE, 52.00, 5, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 6. Demo Retailers (Online Pharmacies)
INSERT INTO retailers (id, name, website_url, logo_url, rating, is_verified, created_at)
VALUES
(1, 'Tata 1mg', 'https://www.1mg.com', 'https://assets.1mg.com/images/tata_1mg_logo.svg', 4.70, TRUE, NOW()),
(2, 'PharmEasy', 'https://pharmeasy.in', 'https://assets.pharmeasy.in/web-assets/dist/fca22bc9.png', 4.50, TRUE, NOW()),
(3, 'Apollo Pharmacy Online', 'https://www.apollopharmacy.in', 'https://www.apollopharmacy.in/assets/images/logo.png', 4.60, TRUE, NOW()),
(4, 'Netmeds', 'https://www.netmeds.com', 'https://www.netmeds.com/assets/gloryweb/images/netmeds-new-logo.svg', 4.40, TRUE, NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 7. Demo Retailer Offers (Medicine price comparisons across providers)
INSERT INTO retailer_offers (id, medicine_id, retailer_id, selling_price, discount_percent, product_url, in_stock, delivery_estimate_days, updated_at)
VALUES
(1, 1, 1, 28.50, 16.18, 'https://www.1mg.com/drugs/dolo-650-tablet-41639', TRUE, 1, NOW()),
(2, 1, 2, 29.00, 14.71, 'https://pharmeasy.in/online-medicine-order/dolo-650mg-strip-of-15-tablets-10020', TRUE, 1, NOW()),
(3, 1, 3, 30.60, 10.00, 'https://www.apollopharmacy.in/otc/dolo-650mg-tablet-15-s', TRUE, 2, NOW()),
(4, 2, 1, 189.98, 15.00, 'https://www.1mg.com/drugs/augmentin-625-duo-tablet-138629', TRUE, 1, NOW()),
(5, 2, 2, 195.00, 12.75, 'https://pharmeasy.in/online-medicine-order/augmentin-625-duo-tablet-10-s-34211', TRUE, 2, NOW()),
(6, 3, 1, 148.75, 15.00, 'https://www.1mg.com/drugs/pan-40-tablet-69022', TRUE, 1, NOW()),
(7, 3, 3, 155.00, 11.43, 'https://www.apollopharmacy.in/medicine/pan-40mg-tablet-15-s', TRUE, 2, NOW()),
(8, 4, 1, 204.00, 15.00, 'https://www.1mg.com/drugs/telma-40-tablet-133998', TRUE, 1, NOW()),
(9, 4, 4, 210.00, 12.50, 'https://www.netmeds.com/prescriptions/telma-40mg-tablet-30s', TRUE, 3, NOW()),
(10, 5, 2, 165.75, 15.00, 'https://pharmeasy.in/online-medicine-order/glycomet-gp-2-tablet-15s-2009', TRUE, 1, NOW()),
(11, 6, 1, 185.30, 15.00, 'https://www.1mg.com/drugs/allegra-120mg-tablet-33120', TRUE, 1, NOW()),
(12, 7, 3, 115.00, 12.21, 'https://www.apollopharmacy.in/otc/shelcal-500mg-strip-of-15-tablets', TRUE, 1, NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 8. Demo Pharmacies (Locatable physical medical stores)
INSERT INTO pharmacies (id, name, license_number, contact_number, email, address, city, state, postal_code, latitude, longitude, opening_time, closing_time, is_24_hours, is_verified, rating, created_at, updated_at)
VALUES
(1, 'Apollo Pharmacy - Indiranagar 24x7', 'DL-KA-BNG-2021-9921', '+91 80 2520 1122', 'apollo.indiranagar@apollopharmacy.in', '100 Feet Road, HAL 2nd Stage, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 12.97159870, 77.64098450, '00:00:00', '23:59:59', TRUE, TRUE, 4.80, NOW(), NOW()),
(2, 'MedPlus Pharmacy - Whitefield Main Rd', 'DL-KA-BNG-2020-5421', '+91 80 2845 3344', 'store.whitefield@medplusindia.com', 'Next to Forum Mall, Whitefield Main Road', 'Bengaluru', 'Karnataka', '560066', 12.96981200, 77.74994500, '08:00:00', '23:00:00', FALSE, TRUE, 4.60, NOW(), NOW()),
(3, 'Fortis HealthWorld Pharmacy', 'DL-KA-BNG-2019-1203', '+91 80 6621 4455', 'healthworld.bg@fortishealthcare.com', 'Bannerghatta Main Road, Opposite IIM-B', 'Bengaluru', 'Karnataka', '560076', 12.89445100, 77.59821500, '00:00:00', '23:59:59', TRUE, TRUE, 4.75, NOW(), NOW()),
(4, 'Sanjivani Medical & General Store', 'DL-KA-BNG-2018-8812', '+91 98450 12345', 'sanjivani.koramangala@gmail.com', '80 Feet Road, 4th Block, Koramangala', 'Bengaluru', 'Karnataka', '560034', 12.93524200, 77.62448000, '08:30:00', '22:30:00', FALSE, TRUE, 4.40, NOW(), NOW()),
(5, 'Guardian Pharmacy - MG Road', 'DL-KA-BNG-2022-7714', '+91 80 4112 8899', 'support@guardianpharmacy.in', 'Shop 14, Brigade Plaza, MG Road', 'Bengaluru', 'Karnataka', '560001', 12.97561200, 77.60662300, '09:00:00', '22:00:00', FALSE, TRUE, 4.55, NOW(), NOW()),
(6, 'Noble Chemists 24x7 Emergency', 'DL-HR-GUR-2021-3312', '+91 124 4055 999', 'noble.gurugram@gmail.com', 'Galleria Market, DLF Phase 4', 'Gurugram', 'Haryana', '122002', 28.46820000, 77.08250000, '00:00:00', '23:59:59', TRUE, TRUE, 4.70, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 9. Demo Reminders
INSERT INTO reminders (id, user_id, medicine_id, custom_medicine_name, dosage, unit, frequency, time_of_day, start_date, end_date, instructions, is_active, created_at, updated_at)
VALUES
(1, 2, 1, 'Dolo 650 Tablet', '1 tablet', 'tablet', 'TWICE_DAILY', '09:00, 21:00', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), 'Take after meals for fever', TRUE, NOW(), NOW()),
(2, 2, 3, 'Pan 40 Tablet', '1 tablet', 'tablet', 'ONCE_DAILY', '07:30', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY), 'Take before breakfast with water', TRUE, NOW(), NOW()),
(3, 3, 4, 'Telma 40 Tablet', '1 tablet', 'tablet', 'ONCE_DAILY', '08:00', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 90 DAY), 'Take every morning for blood pressure', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 10. Demo Dose Logs
INSERT INTO dose_logs (id, reminder_id, user_id, scheduled_time, actual_time, status, notes, created_at)
VALUES
(1, 1, 2, CONCAT(CURRENT_DATE(), ' 09:00:00'), CONCAT(CURRENT_DATE(), ' 09:12:00'), 'TAKEN', 'Felt better after taking', NOW()),
(2, 2, 2, CONCAT(CURRENT_DATE(), ' 07:30:00'), CONCAT(CURRENT_DATE(), ' 07:35:00'), 'TAKEN', 'Taken with glass of water', NOW()),
(3, 3, 3, CONCAT(CURRENT_DATE(), ' 08:00:00'), CONCAT(CURRENT_DATE(), ' 08:05:00'), 'TAKEN', 'Morning BP dose logged', NOW())
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

-- 11. Demo Saved Medicines
INSERT INTO saved_medicines (id, user_id, medicine_id, notes, created_at)
VALUES
(1, 2, 1, 'Emergency fever stock for family', NOW()),
(2, 2, 7, 'Calcium supplement prescribed for mother', NOW()),
(3, 3, 4, 'Father regular prescription medicine', NOW())
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

-- 12. Demo In-App Notifications
INSERT INTO notifications (id, user_id, title, message, type, channel, is_read, scheduled_for, sent_at, created_at)
VALUES
(1, 2, 'Time for your Pan 40 dose', 'Your morning dose of Pan 40 is scheduled at 07:30 AM before breakfast.', 'REMINDER', 'IN_APP', TRUE, CONCAT(CURRENT_DATE(), ' 07:30:00'), CONCAT(CURRENT_DATE(), ' 07:30:01'), NOW()),
(2, 2, 'Evening Dolo 650 reminder', 'Don''t forget to take Dolo 650 (1 tablet) after dinner at 09:00 PM.', 'REMINDER', 'IN_APP', FALSE, CONCAT(CURRENT_DATE(), ' 21:00:00'), CONCAT(CURRENT_DATE(), ' 21:00:01'), NOW()),
(3, 3, 'Welcome to MediFinder!', 'Your profile has been created. Add your daily medication schedule to stay healthy on time.', 'SYSTEM', 'IN_APP', FALSE, NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE message = VALUES(message);
