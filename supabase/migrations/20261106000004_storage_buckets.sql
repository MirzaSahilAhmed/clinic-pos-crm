-- CLINIC POS + CRM SAAS APPLICATION - STORAGE BUCKETS & POLICIES
-- Migration: 20261106000004_storage_buckets.sql

-- Insert Buckets into Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('clinic-assets', 'clinic-assets', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']),
  ('patient-documents', 'patient-documents', false, 15728640, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('prescriptions', 'prescriptions', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('expense-receipts', 'expense-receipts', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg'])
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- 1. Clinic Assets (Public read for clinic logo, authenticated write)
CREATE POLICY "Public read clinic assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'clinic-assets');

CREATE POLICY "Authenticated users upload clinic assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'clinic-assets' AND auth.uid() IS NOT NULL);

-- 2. Patient Documents (Private, authenticated members only)
CREATE POLICY "Clinic members access patient documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'patient-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Clinic staff upload patient documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'patient-documents' AND auth.uid() IS NOT NULL);

-- 3. Prescriptions (Private, clinic staff and doctors only)
CREATE POLICY "Staff read prescriptions" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'prescriptions' AND auth.uid() IS NOT NULL);

CREATE POLICY "Staff upload prescriptions" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid() IS NOT NULL);

-- 4. Expense Receipts (Private, accountants and admins only)
CREATE POLICY "Accountants read expense receipts" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'expense-receipts' AND auth.uid() IS NOT NULL);

CREATE POLICY "Staff upload expense receipts" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'expense-receipts' AND auth.uid() IS NOT NULL);
