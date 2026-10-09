-- ==============================================================================
-- Flyway Migration V9__seed_more_jaipur_hospitals.sql
-- MediFinder / MediCare - Premier Known Hospitals of Jaipur, Rajasthan
-- ==============================================================================

INSERT INTO pharmacies (id, name, license_number, contact_number, email, address, city, state, postal_code, latitude, longitude, opening_time, closing_time, is_24_hours, is_verified, rating, created_at, updated_at)
VALUES
(109, 'Santokba Durlabhji Memorial Hospital (SDMH) 24x7 Pharmacy', 'RJ-JAI-SDM-2018-019', '+91 141 256 6251', 'sdmh.pharmacy@sdmh.in', 'Bhawani Singh Road, Near Rambagh Circle, Bapu Nagar', 'Jaipur', 'Rajasthan', '302015', 26.89200000, 75.80850000, '00:00:00', '23:59:59', TRUE, TRUE, 4.80, NOW(), NOW()),
(110, 'Mahatma Gandhi Hospital 24x7 Emergency Chemist', 'RJ-JAI-MGH-2017-882', '+91 141 277 1777', 'pharmacy@mgmch.org', 'RIICO Institutional Area, Sitapura Industrial Area, Tonk Road', 'Jaipur', 'Rajasthan', '302022', 26.77250000, 75.85800000, '00:00:00', '23:59:59', TRUE, TRUE, 4.75, NOW(), NOW()),
(111, 'Apex Hospital 24x7 Pharmacy Counter', 'RJ-JAI-APX-2020-551', '+91 141 275 1871', 'info@apexhospitals.com', 'SP-6, Malviya Industrial Area, Malviya Nagar', 'Jaipur', 'Rajasthan', '302017', 26.84800000, 75.81900000, '00:00:00', '23:59:59', TRUE, TRUE, 4.70, NOW(), NOW()),
(112, 'CK Birla Hospitals (RBH) 24x7 Pharmacy', 'RJ-JAI-CKB-2019-214', '+91 141 309 6999', 'pharmacy.rbh@ckbirlahospitals.com', 'Near Gopalpura Flyover, Shanthi Nagar, Gopalpura Bypass', 'Jaipur', 'Rajasthan', '302018', 26.87200000, 75.78200000, '00:00:00', '23:59:59', TRUE, TRUE, 4.80, NOW(), NOW()),
(113, 'Shalby Multi-Specialty Hospital Pharmacy', 'RJ-JAI-SHL-2021-663', '+91 141 712 3888', 'info.jaipur@shalby.in', 'Under Pass, Sector 3, Chitrakoot, Vaishali Nagar', 'Jaipur', 'Rajasthan', '302021', 26.89900000, 75.73800000, '00:00:00', '23:59:59', TRUE, TRUE, 4.75, NOW(), NOW()),
(114, 'Bhagwan Mahaveer Cancer Hospital (BMCHRC) Chemist', 'RJ-JAI-BMC-2016-904', '+91 141 270 0107', 'pharmacy@bmchrc.org', 'Jawahar Lal Nehru Marg, Bajaj Nagar', 'Jaipur', 'Rajasthan', '302015', 26.86500000, 75.81200000, '00:00:00', '23:59:59', TRUE, TRUE, 4.85, NOW(), NOW()),
(115, 'JNU Hospital & Medical Institute 24x7 Pharmacy', 'RJ-JAI-JNU-2020-741', '+91 141 719 9000', 'medicalstore@jnuhealthcare.com', 'Jaipur-Agra Bypass, Near RTO Office, Jagatpura', 'Jaipur', 'Rajasthan', '302017', 26.81500000, 75.86500000, '00:00:00', '23:59:59', TRUE, TRUE, 4.65, NOW(), NOW())
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
