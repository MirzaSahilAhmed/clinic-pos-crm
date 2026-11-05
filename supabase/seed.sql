-- CLINIC POS + CRM SAAS APPLICATION - SEED DATA
-- Migration: seed.sql

-- 1. CLINIC
INSERT INTO clinics (
    id, name, slug, phone, email, address, city, tax_number,
    currency, timezone, date_format, invoice_prefix, invoice_footer, enabled_modules
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Al-Shifa Premier Clinic & Healthcare Center',
    'al-shifa-premier-clinic',
    '+92 21 35889900',
    'info@alshifaclinic.pk',
    'Suite 401, Health Avenue, Clifton Block 5',
    'Karachi',
    'NTN-9988231-1',
    'PKR',
    'Asia/Karachi',
    'DD/MM/YYYY',
    'INV-',
    'Thank you for trusting Al-Shifa Premier Clinic. Wishing you radiant health!',
    '{"pharmacy": true, "inventory": true, "crm_leads": true, "expenses": true, "prescriptions": true, "advanced_reports": true}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. CLINIC SETTINGS
INSERT INTO clinic_settings (
    id, clinic_id, clinic_name, phone, email, address, city, registration_no,
    currency, timezone, date_format, language, default_tax_rate, default_discount_rate,
    invoice_prefix, invoice_footer, accepted_payment_methods, working_days,
    opening_time, closing_time, default_slot_duration, enabled_modules
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Al-Shifa Premier Clinic & Healthcare Center',
    '+92 21 35889900',
    'info@alshifaclinic.pk',
    'Suite 401, Health Avenue, Clifton Block 5',
    'Karachi',
    'PMC-KHI-40912',
    'PKR',
    'Asia/Karachi',
    'DD/MM/YYYY',
    'en',
    0.00,
    0.00,
    'INV-',
    'Thank you for trusting Al-Shifa Premier Clinic. Wishing you radiant health!',
    ARRAY['cash','card','bank_transfer','jazzcash','easypaisa'],
    ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    '09:00:00',
    '21:00:00',
    20,
    '{"pharmacy": true, "inventory": true, "crm_leads": true, "expenses": true, "prescriptions": true, "advanced_reports": true}'::jsonb
) ON CONFLICT (clinic_id) DO NOTHING;

-- 3. DOCTORS
INSERT INTO doctors (
    id, clinic_id, full_name, email, phone, specialty, qualification,
    consultation_fee, follow_up_fee, room_number, working_days, start_time, end_time, slot_duration_minutes, is_active
) VALUES 
(
    '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111111',
    'Dr. Tariq Mahmood',
    'dr.tariq@alshifaclinic.pk',
    '+92 300 2233441',
    'Cardiologist',
    'MBBS, FCPS (Cardiology), MRCP (UK)',
    3000.00,
    1500.00,
    'Room 101',
    ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'],
    '10:00:00',
    '16:00:00',
    20,
    true
),
(
    '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111111',
    'Dr. Ayesha Siddiqui',
    'dr.ayesha@alshifaclinic.pk',
    '+92 321 8899112',
    'Pediatrician',
    'MBBS, FCPS (Pediatrics), DCH',
    2500.00,
    1200.00,
    'Room 102',
    ARRAY['Monday','Tuesday','Wednesday','Thursday','Saturday'],
    '14:00:00',
    '20:00:00',
    15,
    true
),
(
    '33333333-3333-3333-3333-333333333303',
    '11111111-1111-1111-1111-111111111111',
    'Dr. Bilal Ahmed Khan',
    'dr.bilal@alshifaclinic.pk',
    '+92 333 4455667',
    'General Physician',
    'MBBS, MCPS (Family Medicine)',
    1500.00,
    800.00,
    'Room 103',
    ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    '09:00:00',
    '18:00:00',
    20,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 4. SERVICES
INSERT INTO services (
    id, clinic_id, code, name, category, description, price, tax_rate, duration_minutes, is_active
) VALUES 
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', 'SRV-001', 'General Physician Consultation', 'Consultation', 'Complete routine health check and vitals assessment', 1500.00, 0.00, 20, true),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'SRV-002', 'Specialist Consultation', 'Consultation', 'Consultation with senior specialist / consultant', 2500.00, 0.00, 20, true),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111111', 'SRV-003', 'Cardiology Comprehensive Evaluation', 'Specialized', 'In-depth cardiac check, rhythm review, risk evaluation', 3000.00, 0.00, 30, true),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111111', 'SRV-004', 'ECG (12-Lead Diagnostic)', 'Diagnostic', 'High-definition 12-lead electrocardiogram with doctor review', 1200.00, 0.00, 15, true),
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111111', 'SRV-005', 'Blood Glucose Random (BSL)', 'Laboratory', 'Instant glucometer test with counseling', 300.00, 0.00, 5, true),
('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111111', 'SRV-006', 'Complete Blood Count (CBC)', 'Laboratory', 'Automated hematology 24-parameter profile', 950.00, 0.00, 10, true),
('44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111111', 'SRV-007', 'Nebulization Therapy', 'Procedure', 'Aerosolized bronchodilator treatment per session', 600.00, 0.00, 15, true),
('44444444-4444-4444-4444-444444444408', '11111111-1111-1111-1111-111111111111', 'SRV-008', 'Wound Dressing & Antiseptic Care', 'Procedure', 'Surgical sterile dressing and bandage application', 800.00, 0.00, 20, true)
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCT CATEGORIES & SUPPLIERS
INSERT INTO product_categories (id, clinic_id, name, description) VALUES
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', 'Analgesics & Antipyretics', 'Pain and fever reduction medications'),
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111111', 'Antibiotics & Antimicrobials', 'Bacterial infection prescription drugs'),
('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111111', 'Cardiovascular & Hypertension', 'Blood pressure and cardiac medications'),
('55555555-5555-5555-5555-555555555504', '11111111-1111-1111-1111-111111111111', 'Gastrointestinal & Antacids', 'Stomach and digestive care drugs'),
('55555555-5555-5555-5555-555555555505', '11111111-1111-1111-1111-111111111111', 'Clinical Supplies & Consumables', 'Syringes, bandages, gloves, gauze')
ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, clinic_id, name, company, phone, email, address) VALUES
('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111111', 'MediPharm Distribution', 'MediPharm Pakistan Pvt Ltd', '+92 21 34991122', 'orders@medipharm.pk', 'Korangi Industrial Area, Karachi'),
('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111111', 'Searle Pharma Direct', 'The Searle Company Limited', '+92 21 35055000', 'supplies@searle.com.pk', 'SITE Industrial Estate, Karachi'),
('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111111', 'Alliance Medical Supplies', 'Alliance Healthcare Traders', '+92 300 9283741', 'sales@alliancemedical.pk', 'Tariq Road Medical Plaza, Karachi')
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCTS & PRODUCT BATCHES
INSERT INTO products (
    id, clinic_id, sku, barcode, name, generic_name, brand, category_id,
    purchase_price, selling_price, unit, current_stock, reorder_level
) VALUES 
('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111111', 'MED-PAN-500', '896400010011', 'Panadol 500mg Tablets', 'Paracetamol', 'GSK', '55555555-5555-5555-5555-555555555501', 3.50, 5.00, 'Tablet', 350, 50),
('77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111111', 'MED-AUG-625', '896400020022', 'Augmentin 625mg Tablets', 'Co-Amoxiclav', 'GSK', '55555555-5555-5555-5555-555555555502', 32.00, 45.00, 'Tablet', 120, 30),
('77777777-7777-7777-7777-777777777703', '11111111-1111-1111-1111-111111111111', 'MED-CON-005', '896400030033', 'Concor 5mg Tablets', 'Bisoprolol Fumarate', 'Merck', '55555555-5555-5555-5555-555555555503', 18.00, 24.00, 'Tablet', 90, 25),
('77777777-7777-7777-7777-777777777704', '11111111-1111-1111-1111-111111111111', 'MED-RIS-020', '896400040044', 'Risek 20mg Capsules', 'Omeprazole', 'Getz Pharma', '55555555-5555-5555-5555-555555555504', 22.00, 29.50, 'Capsule', 180, 40),
('77777777-7777-7777-7777-777777777705', '11111111-1111-1111-1111-111111111111', 'CON-SYR-005', '896400050055', 'Disposable Syringe 5ml', 'Sterile Syringe with Needle', 'BD', '55555555-5555-5555-5555-555555555505', 12.00, 20.00, 'Pcs', 250, 50)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_batches (
    id, clinic_id, product_id, batch_number, supplier_id,
    purchase_date, expiry_date, initial_quantity, current_quantity, purchase_price, selling_price
) VALUES 
('88888888-8888-8888-8888-888888888801', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777701', 'B-PAN-2026A', '66666666-6666-6666-6666-666666666601', '2026-01-10', '2027-12-31', 400, 350, 3.50, 5.00),
('88888888-8888-8888-8888-888888888802', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777702', 'B-AUG-991', '66666666-6666-6666-6666-666666666601', '2026-02-15', '2027-08-30', 150, 120, 32.00, 45.00),
('88888888-8888-8888-8888-888888888803', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777703', 'B-CON-412', '66666666-6666-6666-6666-666666666602', '2026-01-20', '2028-03-31', 100, 90, 18.00, 24.00),
('88888888-8888-8888-8888-888888888804', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777704', 'B-RIS-778', '66666666-6666-6666-6666-666666666602', '2026-02-01', '2027-11-30', 200, 180, 22.00, 29.50),
('88888888-8888-8888-8888-888888888805', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777705', 'B-SYR-011', '66666666-6666-6666-6666-666666666603', '2026-01-05', '2029-01-01', 300, 250, 12.00, 20.00)
ON CONFLICT (id) DO NOTHING;

-- 7. PATIENTS CRM
INSERT INTO patients (
    id, clinic_id, patient_mrn, full_name, gender, dob, age,
    phone, whatsapp, email, address, city, emergency_contact_name, emergency_contact_phone,
    blood_group, allergies, medical_conditions, patient_source, assigned_doctor_id, status, notes
) VALUES 
(
    '99999999-9999-9999-9999-999999999901',
    '11111111-1111-1111-1111-111111111111',
    'PAT-2026-0001',
    'Muhammad Farooq',
    'male',
    '1981-04-14',
    45,
    '+92 300 1234567',
    '+92 300 1234567',
    'm.farooq@example.pk',
    'House 24-B, Khayaban-e-Shamsheer, DHA Phase 5',
    'Karachi',
    'Zainab Farooq (Spouse)',
    '+92 300 7654321',
    'B+',
    'Penicillin allergic',
    'Essential Hypertension, Grade 1 Fatty Liver',
    'Referral',
    '33333333-3333-3333-3333-333333333301',
    'active',
    'Compliant with blood pressure medications'
),
(
    '99999999-9999-9999-9999-999999999902',
    '11111111-1111-1111-1111-111111111111',
    'PAT-2026-0002',
    'Fatima Zahra',
    'female',
    '1994-08-22',
    32,
    '+92 321 7654321',
    '+92 321 7654321',
    'fatima.z@example.pk',
    'Apartment 12-C, Royal Towers, Gulshan-e-Iqbal',
    'Karachi',
    'Ahmed Raza (Husband)',
    '+92 321 1122334',
    'O+',
    'None reported',
    'Asthma (mild intermittent)',
    'Social Media',
    '33333333-3333-3333-3333-333333333303',
    'active',
    'Requires regular inhaler review'
),
(
    '99999999-9999-9999-9999-999999999903',
    '11111111-1111-1111-1111-111111111111',
    'PAT-2026-0003',
    'Usman Ali Siddiqui',
    'male',
    '1998-11-05',
    28,
    '+92 333 9876543',
    '+92 333 9876543',
    'usman.ali@example.pk',
    'Street 7, Sector F-8/2',
    'Islamabad',
    'Tariq Siddiqui (Father)',
    '+92 333 4455889',
    'A+',
    'Sulfa drugs',
    'None',
    'Walk-in',
    '33333333-3333-3333-3333-333333333303',
    'active',
    'Fitness checkup and routine labs'
),
(
    '99999999-9999-9999-9999-999999999904',
    '11111111-1111-1111-1111-111111111111',
    'PAT-2026-0004',
    'Zainab Bibi',
    'female',
    '1966-02-18',
    60,
    '+92 312 3456789',
    '+92 312 3456789',
    'zainab.bibi@example.pk',
    'Block 13-D, Gulshan-e-Iqbal',
    'Karachi',
    'Kamran Khan (Son)',
    '+92 312 9988776',
    'AB+',
    'NSAIDs (induces gastritis)',
    'Type 2 Diabetes Mellitus, Osteoarthritis',
    'Doctor Referral',
    '33333333-3333-3333-3333-333333333301',
    'active',
    'Joint pain evaluation and HbA1c review'
),
(
    '99999999-9999-9999-9999-999999999905',
    '11111111-1111-1111-1111-111111111111',
    'PAT-2026-0005',
    'Hamza Tariq (Pediatric)',
    'male',
    '2018-06-12',
    8,
    '+92 345 1122334',
    '+92 345 1122334',
    'parent.tariq@example.pk',
    'Villa 9, DHA Phase 6',
    'Karachi',
    'Tariq Aziz (Father)',
    '+92 345 1122334',
    'O-',
    'Peanuts',
    'Seasonal allergic rhinitis',
    'Walk-in',
    '33333333-3333-3333-3333-333333333302',
    'active',
    'Pediatric growth assessment and vaccination'
)
ON CONFLICT (id) DO NOTHING;

-- 8. APPOINTMENTS
INSERT INTO appointments (
    id, clinic_id, appointment_number, patient_id, doctor_id,
    appointment_date, start_time, end_time, appointment_type, reason, source, status
) VALUES 
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01',
    '11111111-1111-1111-1111-111111111111',
    'APT-2026-0001',
    '99999999-9999-9999-9999-999999999901',
    '33333333-3333-3333-3333-333333333301',
    CURRENT_DATE,
    '10:30:00',
    '10:50:00',
    'consultation',
    'Follow-up blood pressure check and palpitations',
    'phone',
    'in_consultation'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02',
    '11111111-1111-1111-1111-111111111111',
    'APT-2026-0002',
    '99999999-9999-9999-9999-999999999902',
    '33333333-3333-3333-3333-333333333303',
    CURRENT_DATE,
    '11:00:00',
    '11:20:00',
    'consultation',
    'Acute throat pain and mild dry cough',
    'walk_in',
    'checked_in'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03',
    '11111111-1111-1111-1111-111111111111',
    'APT-2026-0003',
    '99999999-9999-9999-9999-999999999905',
    '33333333-3333-3333-3333-333333333302',
    CURRENT_DATE,
    '15:00:00',
    '15:20:00',
    'checkup',
    'Vaccination booster and seasonal allergy review',
    'online',
    'scheduled'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04',
    '11111111-1111-1111-1111-111111111111',
    'APT-2026-0004',
    '99999999-9999-9999-9999-999999999904',
    '33333333-3333-3333-3333-333333333301',
    CURRENT_DATE - INTERVAL '1 day',
    '11:30:00',
    '11:50:00',
    'consultation',
    'Diabetes management and knee joint pain',
    'phone',
    'completed'
)
ON CONFLICT (id) DO NOTHING;

-- 9. EXPENSES
INSERT INTO expenses (
    id, clinic_id, expense_number, expense_date, category, description,
    amount, payment_method, paid_to, notes
) VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '11111111-1111-1111-1111-111111111111', 'EXP-2026-001', CURRENT_DATE - INTERVAL '3 days', 'rent', 'Monthly Clinic Facility Lease - Clifton Health Plaza', 125000.00, 'bank_transfer', 'Health Plaza Properties', 'March lease payment cleared'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', '11111111-1111-1111-1111-111111111111', 'EXP-2026-002', CURRENT_DATE - INTERVAL '2 days', 'electricity', 'K-Electric Commercial Power Bill', 34500.00, 'bank_transfer', 'K-Electric Limited', 'Account 04000123998'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', '11111111-1111-1111-1111-111111111111', 'EXP-2026-003', CURRENT_DATE - INTERVAL '1 day', 'medical_supplies', 'Sterile Syringes, Gauze, and Disinfection Solutions', 18500.00, 'cash', 'Alliance Medical Traders', 'Cash on delivery receipt verified'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', '11111111-1111-1111-1111-111111111111', 'EXP-2026-004', CURRENT_DATE, 'internet', 'High-Speed Fiber Internet & Landline Line', 4200.00, 'easypaisa', 'StormFiber Telecom', 'Monthly commercial 50Mbps subscription')
ON CONFLICT (id) DO NOTHING;

-- 10. LEADS & FOLLOW-UPS
INSERT INTO leads (
    id, clinic_id, full_name, phone, email, source, service_interested, inquiry_date, follow_up_date, status, notes
) VALUES 
('cccccccc-cccc-cccc-cccc-cccccccccc01', '11111111-1111-1111-1111-111111111111', 'Kamran Sheikh', '+92 333 5511223', 'kamran.sheikh@example.pk', 'Google Search', 'Executive Cardiac Health Package', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 'new', 'Interested in ECG + Echo package pricing'),
('cccccccc-cccc-cccc-cccc-cccccccccc02', '11111111-1111-1111-1111-111111111111', 'Sadia Munir', '+92 315 8822331', 'sadia.m@example.pk', 'WhatsApp', 'Pediatric Vaccination Schedule', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE, 'contacted', 'Sent newborn vaccination brochure via WhatsApp')
ON CONFLICT (id) DO NOTHING;

INSERT INTO follow_ups (
    id, clinic_id, patient_id, doctor_id, follow_up_date, follow_up_type, status, notes
) VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddd01', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999901', '33333333-3333-3333-3333-333333333301', CURRENT_DATE + INTERVAL '7 days', 'routine', 'pending', 'Evaluate BP control on Concor 5mg'),
('dddddddd-dddd-dddd-dddd-dddddddddd02', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999904', '33333333-3333-3333-3333-333333333301', CURRENT_DATE + INTERVAL '14 days', 'chronic_care', 'pending', 'Fasting Blood Sugar log review and HbA1c repeat')
ON CONFLICT (id) DO NOTHING;
