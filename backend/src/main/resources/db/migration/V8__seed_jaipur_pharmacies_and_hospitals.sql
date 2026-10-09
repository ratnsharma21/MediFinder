-- ==============================================================================
-- Flyway Migration V8__seed_jaipur_pharmacies_and_hospitals.sql
-- MediFinder / MediCare - Jaipur, Rajasthan Default Pharmacy & Hospital Location
-- ==============================================================================

-- Seed Verified Jaipur, Rajasthan Pharmacies and Emergency Hospital Counters
INSERT INTO pharmacies (id, name, license_number, contact_number, email, address, city, state, postal_code, latitude, longitude, opening_time, closing_time, is_24_hours, is_verified, rating, created_at, updated_at)
VALUES
(101, 'SMS Hospital 24x7 Emergency Pharmacy', 'RJ-JAI-SMS-2021-001', '+91 141 251 8240', 'pharmacy.sms@rajasthan.gov.in', 'Sawai Man Singh Hospital Campus, JLN Marg, Ashok Nagar', 'Jaipur', 'Rajasthan', '302004', 26.89160000, 75.81590000, '00:00:00', '23:59:59', TRUE, TRUE, 4.85, NOW(), NOW()),
(102, 'Apollo Pharmacy - C-Scheme Branch', 'RJ-JAI-APL-2020-044', '+91 141 237 8890', 'apollo.cscheme.jaipur@apollopharmacy.in', 'Plot 18, Bhagwan Das Road, C-Scheme, Ashok Nagar', 'Jaipur', 'Rajasthan', '302001', 26.91100000, 75.80350000, '08:00:00', '23:00:00', FALSE, TRUE, 4.70, NOW(), NOW()),
(103, 'Fortis Escorts Hospital 24x7 Pharmacy', 'RJ-JAI-FTS-2019-112', '+91 141 254 7000', 'pharmacy.jaipur@fortishealthcare.com', 'Jawaharlal Nehru Marg, Malviya Nagar', 'Jaipur', 'Rajasthan', '302017', 26.85270000, 75.80480000, '00:00:00', '23:59:59', TRUE, TRUE, 4.80, NOW(), NOW()),
(104, 'MedPlus Pharmacy - Vaishali Nagar', 'RJ-JAI-MPL-2022-089', '+91 141 235 6677', 'store.vaishali.jaipur@medplusindia.com', 'Near Nursery Circle, Queens Road, Vaishali Nagar', 'Jaipur', 'Rajasthan', '302021', 26.90480000, 75.74850000, '07:30:00', '23:00:00', FALSE, TRUE, 4.65, NOW(), NOW()),
(105, 'Manipal Hospital 24x7 Emergency Chemist', 'RJ-JAI-MNP-2021-305', '+91 141 516 4000', 'chemist.jaipur@manipalhospitals.com', 'Sector 5, Main Sikar Road, Vidhyadhar Nagar', 'Jaipur', 'Rajasthan', '302039', 26.96910000, 75.77250000, '00:00:00', '23:59:59', TRUE, TRUE, 4.75, NOW(), NOW()),
(106, 'Sanjeevani Medical & General Store', 'RJ-JAI-SJV-2018-721', '+91 98290 12345', 'sanjeevani.mansarovar@gmail.com', 'Shop 14, Madhyam Marg, Sector 7, Mansarovar', 'Jaipur', 'Rajasthan', '302020', 26.86240000, 75.76180000, '08:00:00', '22:30:00', FALSE, TRUE, 4.50, NOW(), NOW()),
(107, 'Eternal Hospital (EHCC) 24x7 Pharmacy', 'RJ-JAI-EHC-2020-918', '+91 141 517 4000', 'emergency.pharmacy@eternalhospital.com', '3 A, Near Jawahar Circle, Jagatpura Road, Malviya Nagar', 'Jaipur', 'Rajasthan', '302017', 26.84560000, 75.80820000, '00:00:00', '23:59:59', TRUE, TRUE, 4.80, NOW(), NOW()),
(108, 'Narayana Multispeciality Hospital Chemist', 'RJ-JAI-NH-2019-450', '+91 141 712 2222', 'pharmacy.jaipur@narayanahealth.org', 'Sector 28, Kumbha Marg, Pratap Nagar, Sanganer', 'Jaipur', 'Rajasthan', '302033', 26.80870000, 75.82020000, '00:00:00', '23:59:59', TRUE, TRUE, 4.70, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    contact_number = VALUES(contact_number),
    address = VALUES(address),
    city = VALUES(city),
    state = VALUES(state),
    postal_code = VALUES(postal_code),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    is_24_hours = VALUES(is_24_hours),
    updated_at = NOW();
