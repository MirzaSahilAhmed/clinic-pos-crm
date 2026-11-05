# Quality Assurance & Testing Checklist

This comprehensive verification checklist validates all clinical, financial, inventory, CRM, and authorization operations across the application.

---

## 1. Authentication & Security
- [x] **Login Flow**: Validates email/password credentials via Supabase Auth with secure session cookies.
- [x] **Role Switching**: Demo station quick-selectors allow testing Super Admin, Doctor, Receptionist, Cashier, Pharmacist, and Accountant.
- [x] **Forgot Password & Reset**: Secure email reset flow with token redirection.
- [x] **Row Level Security (RLS)**: Verified policies on all 30 tables preventing cross-clinic data leaks via `clinic_id` checks.
- [x] **Secret Keys Protection**: Confirmed that `SUPABASE_SERVICE_ROLE_KEY` is never exposed to browser bundles.

---

## 2. Patient Management & CRM
- [x] **Patient Registration**: Creates full demographic profile, unique MRN generation (`PAT-2026-XXXX`).
- [x] **Real-Time Duplicate Detection**: Warns front-desk staff if a patient with matching phone number or full name exists.
- [x] **Patient 360 CRM Tabs**:
  1. Overview & Activity Timeline
  2. Appointments
  3. Visits & Vitals
  4. Prescriptions
  5. Invoices & Balances
  6. Follow-ups
  7. Communication History
- [x] **Data Table Search & Sorting**: Real-time multi-field search and CSV export.

---

## 3. Appointments & Scheduling
- [x] **Doctor Conflict Prevention**: Prevents overlapping appointments for the same doctor at the same time slot.
- [x] **Status Progression**: Queue status changes (Scheduled -> Checked In -> In Consultation -> Completed).
- [x] **Doctor Filtering**: Multi-doctor filtering and daily/weekly view modes.

---

## 4. Clinical Encounters & Prescriptions
- [x] **Consultation Notes (SOAP)**: Captures Chief Complaint, HPI, Medical History, and Assessment.
- [x] **Objective Vitals & Live BMI**: Automatically calculates BMI and weight category when height & weight are entered.
- [x] **Multi-Drug Prescription Builder**: Dynamic add/remove medicine rows, inventory link, frequency presets, and duration.
- [x] **Printable Prescription (A4)**: Formatted official document with clinic branding, doctor qualifications, and signature stamp box.
- [x] **Clinical Decision Disclaimer**: Explicit disclaimer on documentation assistant role.

---

## 5. POS Billing & Invoicing
- [x] **Server-Side Financial Math**: Verifies subtotals, item discounts, invoice discounts, and taxes server-side.
- [x] **Split Tender Payments**: Allows combining Cash, Card, JazzCash, EasyPaisa, and Bank Transfer in a single checkout.
- [x] **Idempotency Keys**: Generates unique idempotency tokens preventing double-billing on repeated clicks.
- [x] **Atomic Transaction**: PostgreSQL RPC handles invoice creation, payment allocations, and batch inventory deductions together.
- [x] **Printable Commercial Invoice**: A4 print-ready invoice with clinic NTN, patient MRN, and custom footer message.
- [x] **Partial Balances**: Tracks outstanding amounts and allows recording subsequent settlements.

---

## 6. Inventory & Pharmacy
- [x] **Product Catalog**: SKU, barcodes, generic formulas, purchase costs, and selling prices.
- [x] **Stock Reorder Alerts**: Highlights items when `current_stock <= reorder_level`.
- [x] **Batch Lots & FEFO**: Expiry date tracking with automatic earliest-expiring batch selection.
- [x] **Stock Intake (PO)**: Intake modal increases product inventory and creates new batch records.

---

## 7. CRM Leads & Care Follow-ups
- [x] **Leads Funnel**: Tracks marketing inquiries from WhatsApp, Google Maps, and Social Media.
- [x] **1-Click Lead Conversion**: Converts inbound lead directly into a registered patient without retyping.
- [x] **Direct WhatsApp Touchpoints**: Generates pre-filled WhatsApp click-to-chat links for appointments and follow-ups.

---

## 8. Financial Intelligence & Audit Logs
- [x] **Invoiced vs Realized Collections**: Clearly distinguishes accrual billings from cash receipts.
- [x] **Operating Net Margin**: Calculates net operating income factoring in rent, utilities, and supplies expenses.
- [x] **Doctor Revenue Analytics**: Tracks financial contributions per consultant.
- [x] **Immutable Audit Trail**: Append-only log of sensitive actions (billing, clinical notes, settings).
