-- ==============================================================================
-- Flyway Migration V4__seed_medicine_catalogue.sql
-- MediFinder / MediCare - Comprehensive Medicine Catalogue & Seed Data
-- ==============================================================================

-- 1. Insert Verified Pharmaceutical Manufacturers
INSERT IGNORE INTO manufacturers (id, name, country, website, contact_email, is_verified) VALUES
(1, 'Cipla Ltd', 'India', 'https://www.cipla.com', 'contactus@cipla.com', TRUE),
(2, 'Sun Pharmaceutical Industries Ltd', 'India', 'https://www.sunpharma.com', 'info@sunpharma.com', TRUE),
(3, 'Dr. Reddy''s Laboratories', 'India', 'https://www.drreddys.com', 'mail@drreddys.com', TRUE),
(4, 'Abbott India Ltd', 'India', 'https://www.abbott.co.in', 'customercare@abbott.co.in', TRUE),
(5, 'Torrent Pharmaceuticals', 'India', 'https://www.torrentpharma.com', 'info@torrentpharma.com', TRUE),
(6, 'Lupin Ltd', 'India', 'https://www.lupin.com', 'info@lupin.com', TRUE),
(7, 'Mankind Pharma Ltd', 'India', 'https://www.mankindpharma.com', 'contact@mankindpharma.com', TRUE),
(8, 'Glenmark Pharmaceuticals', 'India', 'https://www.glenmarkpharma.com', 'global@glenmarkpharma.com', TRUE),
(9, 'Zydus Lifesciences', 'India', 'https://www.zyduslife.com', 'contact@zyduslife.com', TRUE),
(10, 'Alkem Laboratories', 'India', 'https://www.alkemlabs.com', 'contactus@alkem.com', TRUE);

-- 2. Insert Verified Online Medical Retailers
INSERT IGNORE INTO retailers (id, name, website_url, logo_url, rating, is_verified) VALUES
(1, 'Tata 1mg', 'https://www.1mg.com', 'https://assets.1mg.com/images/1mg-logo.svg', 4.80, TRUE),
(2, 'PharmEasy', 'https://pharmeasy.in', 'https://assets.pharmeasy.in/web-assets/dist/fca22bc9.png', 4.60, TRUE),
(3, 'Netmeds', 'https://www.netmeds.com', 'https://www.netmeds.com/assets/gloryweb/images/netmeds-new-logo.svg', 4.50, TRUE),
(4, 'Apollo Pharmacy', 'https://www.apollopharmacy.in', 'https://images.apollo247.in/images/logos/apollo-pharmacy-logo.svg', 4.70, TRUE);

-- 3. Insert Comprehensive Medicine Catalogue Records
INSERT IGNORE INTO medicines (id, name, generic_name, brand_name, category, dosage_form, strength, pack_size, composition, indications, side_effects, precautions, storage_instructions, requires_prescription, mrp, manufacturer_id, image_url, is_available) VALUES
(1, 'Dolo 650 Tablet', 'Paracetamol', 'Dolo', 'Analgesics & Antipyretics', 'Tablet', '650mg', '15 Tablets', 'Paracetamol (Acetaminophen) IP 650mg', 'Relief from mild to moderate pain, headache, toothache, muscle aches, and fever reduction.', 'Nausea, allergic skin rash (rare), liver toxicity with overdose.', 'Do not exceed 4000mg per day. Avoid alcohol consumption while taking this medication.', 'Store in a cool, dry place below 25°C away from direct sunlight.', FALSE, 34.00, 7, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', TRUE),

(2, 'Augmentin 625 Duo Tablet', 'Amoxicillin + Clavulanic Acid', 'Augmentin', 'Antibiotics & Anti-infectives', 'Tablet', '625mg', '10 Tablets', 'Amoxicillin Trihydrate IP 500mg + Potassium Clavulanate IP 125mg', 'Bacterial infections of the respiratory tract, urinary tract, skin, soft tissue, and dental infections.', 'Diarrhea, nausea, vomiting, skin rashes, mild digestive upset.', 'Complete the full prescribed course. Inform doctor in case of penicillin allergies.', 'Store below 25°C in moisture-proof packaging.', TRUE, 223.50, 6, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', TRUE),

(3, 'Pan 40 Tablet', 'Pantoprazole', 'Pan', 'Gastrointestinal & Antacids', 'Tablet', '40mg', '15 Tablets', 'Pantoprazole Sodium IP equivalent to Pantoprazole 40mg', 'Gastroesophageal reflux disease (GERD), acid-related indigestion, peptic ulcer disease, and Zollinger-Ellison syndrome.', 'Headache, diarrhea, dizziness, flatulence, abdominal pain.', 'Best taken on an empty stomach 30 to 60 minutes before breakfast.', 'Store protected from light and moisture below 30°C.', TRUE, 162.00, 10, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500', TRUE),

(4, 'Glycomet-GP 2 Tablet', 'Glimepiride + Metformin', 'Glycomet-GP', 'Antidiabetic Agents', 'Tablet', '2mg/500mg', '15 Tablets', 'Glimepiride IP 2mg + Metformin Hydrochloride IP 500mg (Sustained Release)', 'Management of type 2 diabetes mellitus when dietary modification and exercise alone are insufficient.', 'Hypoglycemia (low blood sugar), gastrointestinal upset, metallic taste, nausea.', 'Monitor blood sugar levels regularly. Take with meals to minimize stomach upset.', 'Store in a dry place protected from heat and moisture.', TRUE, 142.50, 4, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', TRUE),

(5, 'Telma 40 Tablet', 'Telmisartan', 'Telma', 'Cardiovascular & Antihypertensives', 'Tablet', '40mg', '30 Tablets', 'Telmisartan IP 40mg', 'Treatment of essential hypertension (high blood pressure) and cardiovascular risk reduction.', 'Dizziness, back pain, sinus congestion, low blood pressure when standing.', 'Contraindicated during pregnancy. Periodic monitoring of serum potassium and renal function advised.', 'Keep tightly closed in original packaging below 30°C.', TRUE, 248.00, 8, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500', TRUE),

(6, 'Cetirizine 10mg Tablet', 'Cetirizine Hydrochloride', 'Cetzine', 'Allergy & Antihistamines', 'Tablet', '10mg', '10 Tablets', 'Cetirizine Hydrochloride IP 10mg', 'Allergic rhinitis, hay fever, watery eyes, runny nose, sneezing, and chronic hives (urticaria).', 'Mild drowsiness, dry mouth, tiredness, sore throat.', 'May cause mild drowsiness; caution when driving or operating machinery.', 'Store below 25°C in a dry place.', FALSE, 21.50, 3, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', TRUE),

(7, 'Azithral 500 Tablet', 'Azithromycin', 'Azithral', 'Antibiotics & Anti-infectives', 'Tablet', '500mg', '5 Tablets', 'Azithromycin Dihydrate IP equivalent to Azithromycin 500mg', 'Respiratory tract infections, tonsillitis, sinusitis, skin infections, and uncomplicated genital infections.', 'Abdominal cramps, diarrhea, nausea, temporary taste disturbances.', 'Avoid taking with aluminum or magnesium antacids simultaneously. Full course must be completed.', 'Store at room temperature away from excessive moisture.', TRUE, 131.00, 6, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', TRUE),

(8, 'Becosules Z Capsule', 'B-Complex + Vitamin C + Zinc', 'Becosules', 'Vitamins & Supplements', 'Capsule', 'Multivitamin', '20 Capsules', 'Vitamin B1, B2, B6, B12, Niacinamide, Calcium Pantothenate, Folic Acid, Vitamin C 150mg, Zinc Sulfate 41.4mg', 'Nutritional deficiency, mouth ulcers, recovery after illness, enhanced immunity, and skin health.', 'Bright yellow urine (normal B2 excretion), mild upset stomach if taken on empty stomach.', 'Take with or after meals. Consult doctor before high-dose supplementation.', 'Store protected from light and moisture in a cool place.', FALSE, 49.50, 4, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', TRUE),

(9, 'Montair-LC Tablet', 'Montelukast + Levocetirizine', 'Montair-LC', 'Respiratory & Asthma', 'Tablet', '10mg/5mg', '10 Tablets', 'Montelukast Sodium IP 10mg + Levocetirizine Dihydrochloride IP 5mg', 'Allergic rhinitis, seasonal allergies, and maintenance therapy for chronic allergic asthma symptoms.', 'Drowsiness, headache, dry mouth, fatigue, gastrointestinal distress.', 'Best taken in the evening before bedtime. Not intended for acute asthma attacks.', 'Store below 25°C protected from direct sunlight.', TRUE, 198.00, 1, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500', TRUE),

(10, 'Ascoril LS Syrup', 'Levosalbutamol + Ambroxol + Guaiphenesin', 'Ascoril', 'Respiratory & Asthma', 'Syrup', '100ml', '1 Bottle (100ml)', 'Levosalbutamol 1mg + Ambroxol Hydrochloride 30mg + Guaiphenesin 50mg per 5ml', 'Productive cough associated with bronchospasm in bronchitis, bronchial asthma, and COPD.', 'Tremors, palpitations, nausea, throat irritation, dizziness.', 'Shake well before use. Use the measuring cup provided. Diabetics should note sucrose content.', 'Store in a cool place below 25°C. Do not freeze.', TRUE, 118.00, 8, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500', TRUE),

(11, 'Shelcal 500 Tablet', 'Calcium + Vitamin D3', 'Shelcal', 'Vitamins & Supplements', 'Tablet', '500mg/250IU', '15 Tablets', 'Elemental Calcium 500mg (from Calcium Carbonate) + Vitamin D3 250 IU', 'Calcium and vitamin D deficiency, osteoporosis, bone strengthening during aging and pregnancy.', 'Constipation, mild bloating, hypercalcemia with excessive dosage.', 'Maintain adequate daily fluid intake while taking calcium supplements.', 'Store protected from moisture at room temperature.', FALSE, 131.50, 5, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', TRUE),

(12, 'Rosuvas 10 Tablet', 'Rosuvastatin', 'Rosuvas', 'Cardiovascular & Antihypertensives', 'Tablet', '10mg', '15 Tablets', 'Rosuvastatin Calcium IP equivalent to Rosuvastatin 10mg', 'Hypercholesterolemia, prevention of cardiovascular disease, reduction of LDL cholesterol and triglycerides.', 'Muscle pain, weakness, headache, abdominal cramps, mild nausea.', 'Report unexplained muscle pain or weakness immediately to your healthcare provider.', 'Store in original blister packaging protected from moisture.', TRUE, 265.00, 2, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', TRUE);

-- 4. Insert Verified Online Retailer Quotes & Offers
INSERT IGNORE INTO retailer_offers (id, medicine_id, retailer_id, selling_price, discount_percent, product_url, in_stock, delivery_estimate_days) VALUES
-- Dolo 650 (MRP 34.00)
(1, 1, 1, 28.90, 15.00, 'https://www.1mg.com/drugs/dolo-650-tablet-41634', TRUE, 1),
(2, 1, 2, 29.50, 13.24, 'https://pharmeasy.in/online-medicine-order/dolo-650mg-strip-of-15-tablets-10651', TRUE, 2),
(3, 1, 3, 29.00, 14.71, 'https://www.netmeds.com/prescriptions/dolo-650mg-tablet-15-s', TRUE, 2),
(4, 1, 4, 30.60, 10.00, 'https://www.apollopharmacy.in/otc/dolo-650-tablet-15s', TRUE, 1),

-- Augmentin 625 (MRP 223.50)
(5, 2, 1, 189.98, 15.00, 'https://www.1mg.com/drugs/augmentin-625-duo-tablet-138621', TRUE, 1),
(6, 2, 2, 185.50, 17.00, 'https://pharmeasy.in/online-medicine-order/augmentin-625-duo-tablet-10-s-3721', TRUE, 2),
(7, 2, 4, 194.45, 13.00, 'https://www.apollopharmacy.in/otc/augmentin-625-duo-tablet-10s', TRUE, 1),

-- Pan 40 (MRP 162.00)
(8, 3, 1, 137.70, 15.00, 'https://www.1mg.com/drugs/pan-40-tablet-5847', TRUE, 1),
(9, 3, 2, 134.46, 17.00, 'https://pharmeasy.in/online-medicine-order/pan-40-strip-of-15-tablets-10892', TRUE, 2),
(10, 3, 3, 137.70, 15.00, 'https://www.netmeds.com/prescriptions/pan-40mg-tablet-15-s', TRUE, 2),

-- Glycomet-GP 2 (MRP 142.50)
(11, 4, 1, 121.12, 15.00, 'https://www.1mg.com/drugs/glycomet-gp-2-tablet-sr-15582', TRUE, 2),
(12, 4, 3, 122.55, 14.00, 'https://www.netmeds.com/prescriptions/glycomet-gp-2mg-tablet-15-s', TRUE, 2),
(13, 4, 4, 128.25, 10.00, 'https://www.apollopharmacy.in/otc/glycomet-gp-2-tablet-15s', TRUE, 1),

-- Telma 40 (MRP 248.00)
(14, 5, 1, 210.80, 15.00, 'https://www.1mg.com/drugs/telma-40-tablet-133984', TRUE, 1),
(15, 5, 2, 205.84, 17.00, 'https://pharmeasy.in/online-medicine-order/telma-40mg-strip-of-30-tablets-14300', TRUE, 2),
(16, 5, 4, 218.24, 12.00, 'https://www.apollopharmacy.in/otc/telma-40-tablet-30s', TRUE, 1),

-- Cetirizine 10mg (MRP 21.50)
(17, 6, 1, 17.20, 20.00, 'https://www.1mg.com/drugs/cetzine-10mg-tablet-37604', TRUE, 1),
(18, 6, 2, 17.50, 18.60, 'https://pharmeasy.in/online-medicine-order/cetzine-10mg-strip-of-10-tablets-12903', TRUE, 2),

-- Montair-LC (MRP 198.00)
(19, 9, 1, 168.30, 15.00, 'https://www.1mg.com/drugs/montair-lc-tablet-36423', TRUE, 1),
(20, 9, 2, 164.34, 17.00, 'https://pharmeasy.in/online-medicine-order/montair-lc-strip-of-10-tablets-9821', TRUE, 2),
(21, 9, 4, 174.24, 12.00, 'https://www.apollopharmacy.in/otc/montair-lc-tablet-10s', TRUE, 1),

-- Shelcal 500 (MRP 131.50)
(22, 11, 1, 111.77, 15.00, 'https://www.1mg.com/drugs/shelcal-500-tablet-67931', TRUE, 1),
(23, 11, 2, 109.14, 17.00, 'https://pharmeasy.in/online-medicine-order/shelcal-500mg-strip-of-15-tablets-8932', TRUE, 2),
(24, 11, 3, 111.77, 15.00, 'https://www.netmeds.com/prescriptions/shelcal-500-tablet-15-s', TRUE, 2);
