-- CLINIC POS + CRM SAAS APPLICATION - ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 20261106000002_rls_policies.sql

-- Helper Function: Check if user is active member of clinic
CREATE OR REPLACE FUNCTION is_clinic_member(check_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM clinic_memberships
    WHERE clinic_id = check_clinic_id
      AND user_id = auth.uid()
      AND is_active = true
  );
$$;

-- Helper Function: Check user role within clinic
CREATE OR REPLACE FUNCTION has_clinic_role(check_clinic_id UUID, required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM clinic_memberships
    WHERE clinic_id = check_clinic_id
      AND user_id = auth.uid()
      AND is_active = true
      AND role = ANY(required_roles)
  );
$$;

-- Helper Function: Get current user role
CREATE OR REPLACE FUNCTION get_user_role(check_clinic_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM clinic_memberships
  WHERE clinic_id = check_clinic_id
    AND user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- 1. CLINICS POLICIES
CREATE POLICY clinics_select ON clinics FOR SELECT USING (is_clinic_member(id));
CREATE POLICY clinics_update ON clinics FOR UPDATE USING (has_clinic_role(id, ARRAY['super_admin', 'admin']));

-- 2. PROFILES POLICIES
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid());

-- 3. CLINIC MEMBERSHIPS POLICIES
CREATE POLICY memberships_select ON clinic_memberships FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY memberships_admin ON clinic_memberships FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin']));

-- 4. DOCTORS POLICIES
CREATE POLICY doctors_select ON doctors FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY doctors_modify ON doctors FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin']));

-- 5. PATIENTS CRM POLICIES
CREATE POLICY patients_select ON patients FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY patients_insert ON patients FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY patients_update ON patients FOR UPDATE USING (is_clinic_member(clinic_id));

-- 6. APPOINTMENTS POLICIES
CREATE POLICY appointments_select ON appointments FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY appointments_insert ON appointments FOR INSERT WITH CHECK (is_clinic_member(clinic_id));
CREATE POLICY appointments_update ON appointments FOR UPDATE USING (is_clinic_member(clinic_id));
CREATE POLICY appointments_delete ON appointments FOR DELETE USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'receptionist']));

-- 7. VISITS (CONSULTATIONS) POLICIES
CREATE POLICY visits_select ON visits FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY visits_insert ON visits FOR INSERT WITH CHECK (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'doctor']));
CREATE POLICY visits_update ON visits FOR UPDATE USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'doctor']));

-- 8. VISIT VITALS POLICIES
CREATE POLICY vitals_select ON visit_vitals FOR SELECT USING (
  EXISTS (SELECT 1 FROM visits WHERE visits.id = visit_vitals.visit_id AND is_clinic_member(visits.clinic_id))
);
CREATE POLICY vitals_modify ON visit_vitals FOR ALL USING (
  EXISTS (SELECT 1 FROM visits WHERE visits.id = visit_vitals.visit_id AND is_clinic_member(visits.clinic_id))
);

-- 9. PRESCRIPTIONS POLICIES
CREATE POLICY prescriptions_select ON prescriptions FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY prescriptions_doctor ON prescriptions FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'doctor']));

-- 10. PRESCRIPTION ITEMS POLICIES
CREATE POLICY rx_items_select ON prescription_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM prescriptions WHERE prescriptions.id = prescription_items.prescription_id AND is_clinic_member(prescriptions.clinic_id))
);
CREATE POLICY rx_items_modify ON prescription_items FOR ALL USING (
  EXISTS (SELECT 1 FROM prescriptions WHERE prescriptions.id = prescription_items.prescription_id AND has_clinic_role(prescriptions.clinic_id, ARRAY['super_admin', 'admin', 'doctor']))
);

-- 11. SERVICES POLICIES
CREATE POLICY services_select ON services FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY services_admin ON services FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin']));

-- 12. INVENTORY & PHARMACY POLICIES
CREATE POLICY categories_select ON product_categories FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY categories_modify ON product_categories FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'pharmacist']));

CREATE POLICY suppliers_select ON suppliers FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY suppliers_modify ON suppliers FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'pharmacist']));

CREATE POLICY products_select ON products FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY products_modify ON products FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'pharmacist']));

CREATE POLICY batches_select ON product_batches FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY batches_modify ON product_batches FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'pharmacist']));

CREATE POLICY purchases_select ON purchases FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY purchases_modify ON purchases FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'pharmacist']));

CREATE POLICY purchase_items_select ON purchase_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND is_clinic_member(purchases.clinic_id))
);
CREATE POLICY purchase_items_modify ON purchase_items FOR ALL USING (
  EXISTS (SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND has_clinic_role(purchases.clinic_id, ARRAY['super_admin', 'admin', 'pharmacist']))
);

CREATE POLICY inv_tx_select ON inventory_transactions FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY inv_tx_insert ON inventory_transactions FOR INSERT WITH CHECK (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'pharmacist', 'cashier']));

-- 13. BILLING, POS & INVOICES POLICIES
CREATE POLICY invoices_select ON invoices FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY invoices_insert ON invoices FOR INSERT WITH CHECK (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'cashier', 'receptionist', 'doctor']));
CREATE POLICY invoices_update ON invoices FOR UPDATE USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'cashier', 'accountant']));

CREATE POLICY invoice_items_select ON invoice_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND is_clinic_member(invoices.clinic_id))
);
CREATE POLICY invoice_items_insert ON invoice_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND is_clinic_member(invoices.clinic_id))
);

-- 14. PAYMENTS & REFUNDS POLICIES
CREATE POLICY payments_select ON payments FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY payments_insert ON payments FOR INSERT WITH CHECK (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'cashier', 'receptionist', 'accountant']));

CREATE POLICY refunds_select ON refunds FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY refunds_insert ON refunds FOR INSERT WITH CHECK (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'accountant']));

-- 15. EXPENSES & FINANCE POLICIES
CREATE POLICY expenses_select ON expenses FOR SELECT USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'accountant']));
CREATE POLICY expenses_modify ON expenses FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin', 'accountant']));

-- 16. CRM LEADS & FOLLOW-UPS POLICIES
CREATE POLICY leads_all ON leads FOR ALL USING (is_clinic_member(clinic_id));
CREATE POLICY follow_ups_all ON follow_ups FOR ALL USING (is_clinic_member(clinic_id));
CREATE POLICY comms_all ON communications FOR ALL USING (is_clinic_member(clinic_id));

-- 17. NOTIFICATIONS POLICIES
CREATE POLICY notif_select ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notif_update ON notifications FOR UPDATE USING (user_id = auth.uid());

-- 18. AUDIT LOGS POLICIES
CREATE POLICY audit_select ON audit_logs FOR SELECT USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin']));
CREATE POLICY audit_insert ON audit_logs FOR INSERT WITH CHECK (is_clinic_member(clinic_id));

-- 19. CLINIC SETTINGS POLICIES
CREATE POLICY settings_select ON clinic_settings FOR SELECT USING (is_clinic_member(clinic_id));
CREATE POLICY settings_modify ON clinic_settings FOR ALL USING (has_clinic_role(clinic_id, ARRAY['super_admin', 'admin']));
