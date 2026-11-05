export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'doctor'
  | 'receptionist'
  | 'cashier'
  | 'pharmacist'
  | 'accountant';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type PaymentMethod =
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'jazzcash'
  | 'easypaisa'
  | 'other';

export type InvoicePaymentStatus =
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'refunded';

export type InventoryTransactionType =
  | 'purchase'
  | 'sale'
  | 'adjustment'
  | 'return'
  | 'expired'
  | 'damaged';

export type ExpenseCategory =
  | 'rent'
  | 'salaries'
  | 'electricity'
  | 'internet'
  | 'medical_supplies'
  | 'maintenance'
  | 'equipment'
  | 'marketing'
  | 'other';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'appointment_booked'
  | 'converted'
  | 'not_interested'
  | 'lost';

export type FollowUpStatus =
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'overdue';

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  tax_number?: string | null;
  currency: string;
  timezone: string;
  date_format: string;
  invoice_prefix: string;
  invoice_footer?: string | null;
  enabled_modules: {
    pharmacy: boolean;
    inventory: boolean;
    crm_leads: boolean;
    expenses: boolean;
    prescriptions: boolean;
    advanced_reports: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ClinicMembership {
  id: string;
  clinic_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  profile?: Profile;
}

export interface Doctor {
  id: string;
  clinic_id: string;
  user_id?: string | null;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  specialty: string;
  qualification?: string | null;
  consultation_fee: number;
  follow_up_fee: number;
  room_number?: string | null;
  working_days: string[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface Patient {
  id: string;
  clinic_id: string;
  patient_mrn: string;
  full_name: string;
  gender: 'male' | 'female' | 'other';
  dob?: string | null;
  age?: number | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  blood_group?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  patient_source?: string | null;
  assigned_doctor_id?: string | null;
  status: 'active' | 'inactive' | 'archived';
  notes?: string | null;
  created_at: string;
  updated_at: string;
  assigned_doctor?: Doctor;
  total_visits?: number;
  outstanding_balance?: number;
  last_visit_date?: string | null;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  appointment_number: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  appointment_type: 'consultation' | 'follow_up' | 'procedure' | 'emergency' | 'checkup';
  department?: string | null;
  reason?: string | null;
  source: 'walk_in' | 'phone' | 'online' | 'referral' | 'crm';
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface VisitVitals {
  id: string;
  visit_id: string;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  heart_rate?: number | null;
  temperature?: number | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  oxygen_saturation?: number | null;
  respiratory_rate?: number | null;
  bmi?: number | null;
  recorded_at: string;
}

export interface Visit {
  id: string;
  clinic_id: string;
  visit_number: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string | null;
  visit_date: string;
  chief_complaint?: string | null;
  symptoms?: string | null;
  medical_history?: string | null;
  examination_notes?: string | null;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_date?: string | null;
  follow_up_notes?: string | null;
  status: 'in_progress' | 'completed' | 'amended';
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
  vitals?: VisitVitals | null;
  prescriptions?: Prescription[];
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  product_id?: string | null;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string | null;
  created_at: string;
}

export interface Prescription {
  id: string;
  clinic_id: string;
  prescription_number: string;
  patient_id: string;
  doctor_id: string;
  visit_id?: string | null;
  prescription_date: string;
  notes?: string | null;
  created_at: string;
  patient?: Patient;
  doctor?: Doctor;
  items?: PrescriptionItem[];
}

export interface Service {
  id: string;
  clinic_id: string;
  code?: string | null;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  tax_rate: number;
  doctor_id?: string | null;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  clinic_id: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Supplier {
  id: string;
  clinic_id: string;
  name: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductBatch {
  id: string;
  clinic_id: string;
  product_id: string;
  batch_number: string;
  supplier_id?: string | null;
  purchase_date?: string | null;
  expiry_date: string;
  initial_quantity: number;
  current_quantity: number;
  purchase_price: number;
  selling_price?: number | null;
  created_at: string;
  supplier?: Supplier;
}

export interface Product {
  id: string;
  clinic_id: string;
  sku?: string | null;
  barcode?: string | null;
  name: string;
  generic_name?: string | null;
  brand?: string | null;
  category_id?: string | null;
  purchase_price: number;
  selling_price: number;
  unit: string;
  current_stock: number;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
  batches?: ProductBatch[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  created_at: string;
  product?: Product;
}

export interface Purchase {
  id: string;
  clinic_id: string;
  purchase_number: string;
  supplier_id: string;
  purchase_date: string;
  total_amount: number;
  payment_status: 'paid' | 'partial' | 'unpaid';
  notes?: string | null;
  created_at: string;
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface InventoryTransaction {
  id: string;
  clinic_id: string;
  product_id: string;
  batch_id?: string | null;
  transaction_type: InventoryTransactionType;
  quantity_delta: number;
  balance_after: number;
  reference_type?: string | null;
  reference_id?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  product?: Product;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  item_type: 'service' | 'product';
  service_id?: string | null;
  product_id?: string | null;
  batch_id?: string | null;
  item_name: string;
  description?: string | null;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  clinic_id: string;
  payment_number: string;
  invoice_id: string;
  patient_id: string;
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string | null;
  notes?: string | null;
  received_by?: string | null;
  is_reversed: boolean;
  reversed_at?: string | null;
  reversed_by?: string | null;
  reversal_reason?: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  clinic_id: string;
  invoice_number: string;
  patient_id: string;
  doctor_id?: string | null;
  visit_id?: string | null;
  invoice_date: string;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  payment_status: InvoicePaymentStatus;
  idempotency_key?: string | null;
  notes?: string | null;
  cashier_id?: string | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
  items?: InvoiceItem[];
  payments?: Payment[];
}

export interface Refund {
  id: string;
  clinic_id: string;
  refund_number: string;
  invoice_id: string;
  payment_id?: string | null;
  amount: number;
  reason: string;
  refund_method: string;
  processed_by?: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  clinic_id: string;
  expense_number: string;
  expense_date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  payment_method: PaymentMethod;
  paid_to?: string | null;
  attachment_url?: string | null;
  notes?: string | null;
  recorded_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  clinic_id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  source: string;
  service_interested?: string | null;
  inquiry_date: string;
  follow_up_date?: string | null;
  assigned_staff_id?: string | null;
  status: LeadStatus;
  notes?: string | null;
  converted_patient_id?: string | null;
  created_at: string;
  updated_at: string;
  assigned_staff?: Profile;
}

export interface FollowUp {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id?: string | null;
  visit_id?: string | null;
  follow_up_date: string;
  follow_up_type: 'routine' | 'post_op' | 'medication_review' | 'lab_results' | 'chronic_care';
  assigned_staff_id?: string | null;
  status: FollowUpStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Communication {
  id: string;
  clinic_id: string;
  patient_id: string;
  communication_type: 'whatsapp' | 'sms' | 'call' | 'email' | 'in_person';
  message_summary: string;
  outcome?: string | null;
  staff_id?: string | null;
  sent_at: string;
  created_at: string;
  patient?: Patient;
}

export interface Notification {
  id: string;
  clinic_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  clinic_id: string;
  user_id?: string | null;
  action: string;
  module: string;
  record_id?: string | null;
  description: string;
  metadata?: Json | null;
  ip_address?: string | null;
  created_at: string;
  user?: Profile;
}

export interface ClinicSettings {
  id: string;
  clinic_id: string;
  clinic_name: string;
  logo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  registration_no?: string | null;
  currency: string;
  timezone: string;
  date_format: string;
  language: string;
  default_tax_rate: number;
  default_discount_rate: number;
  invoice_prefix: string;
  invoice_footer?: string | null;
  accepted_payment_methods: PaymentMethod[];
  working_days: string[];
  opening_time: string;
  closing_time: string;
  default_slot_duration: number;
  enabled_modules: {
    pharmacy: boolean;
    inventory: boolean;
    crm_leads: boolean;
    expenses: boolean;
    prescriptions: boolean;
    advanced_reports: boolean;
  };
  updated_at: string;
}
