# Al-Shifa Healthcare: Enterprise Clinic POS + CRM SaaS

A modern, high-performance, commercial-quality Clinic Management System with integrated Point of Sale (POS), electronic health records (EHR), multi-tender billing, pharmacy inventory, and CRM pipeline capabilities.

Built with **Next.js 15 (React 19 / App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL + RLS)**, and optimized for **Vercel** deployment.

---

## 🌟 Key Highlights & Modules

### 1. Executive Clinic Dashboard
- Real-time statistics: Total Patients, Today's Appointments, Today's Revenue, Monthly Revenue, Outstanding Balances, Total Expenses, and Net Operating Income.
- Financial flow analysis with interactive Recharts area charts (Inflows vs Outflows).
- Queue monitoring: Live patient check-in status and upcoming follow-ups.

### 2. Comprehensive Patient CRM
- Full demographic files, auto-generated unique Medical Record Numbers (`PAT-2026-XXXX`).
- Real-time duplicate detection warning before saving.
- Patient 360 profile with 7 integrated tabs:
  1. Personal Overview & Chronological Timeline
  2. Scheduled Appointments
  3. Visits & Vitals History
  4. Electronic Prescriptions
  5. Invoices & Billing
  6. Scheduled Follow-ups
  7. WhatsApp & Communication History

### 3. Conflict-Preventing Appointment Scheduling
- Multi-doctor queue management (Daily, Weekly, and List modes).
- Intelligent conflict prevention: validates doctor availability on the server to prevent overlapping slots.
- Status progression: `Scheduled` ➔ `Confirmed` ➔ `Checked In` ➔ `In Consultation` ➔ `Completed`.

### 4. Clinical Encounters (SOAP) & Objective Vitals
- Structured consultation encounters: Chief Complaints, HPI, Medical History, Physical Findings, Assessment / Diagnosis, Treatment Plan, and Advice.
- Objective Vitals entry: Blood Pressure (Systolic/Diastolic), Heart Rate, Temp (°F), Weight (kg), Height (cm), SpO2, and Respiratory Rate.
- **Instant Live BMI Calculation**: Automatically calculates body mass index and category (Underweight, Normal, Overweight, Obese) dynamically.

### 5. Multi-Drug Prescription Builder (e-Rx)
- Add/remove medication rows dynamically.
- Quick-pick from pharmacy stock catalog or custom prescriptions.
- Pre-configured frequencies: `1-0-1 (BD)`, `1-0-0 (OD)`, `1-1-1 (TDS)`, `SOS`.
- **Printable A4 Prescription Template**: Standardized medical document with clinic header, doctor credentials, patient demographics, ℞ symbol, and physician signature line.

### 6. High-Speed POS Billing & Multi-Tender Checkout
- Two-column point of sale terminal: catalog search & category filtering on the left, reactive cart & settlement on the right.
- **Split Tender Payments**: Combine Cash, Debit/Credit Card, JazzCash, EasyPaisa, and Bank Transfer in a single transaction.
- Server-side verified totals (Never trusts client-calculated prices or taxes).
- **Atomic Transaction RPC (`execute_pos_sale`)**: Creates invoice, records payments, deducts batch stock, and logs inventory transactions in an all-or-nothing PostgreSQL transaction with row-level locks.
- Idempotency key protection preventing duplicate submissions.
- **Printable A4 Commercial Tax Invoice**: Ready-to-print commercial invoice layout with clinic NTN, patient MRN, and custom footer messages.

### 7. Pharmacy Inventory & FEFO Batch Expiry
- Product catalog with SKU, brand, purchase cost, selling price, and reorder levels.
- Batch lots tracking with First-Expiry First-Out (FEFO) automated selection.
- Low-stock and near-expiry alert banners.
- Supplier management and Goods Received Notes (GRN) / Purchase Order stock intake.

### 8. Patient CRM & Marketing Pipeline
- Inbound inquiries pipeline from Google Maps, WhatsApp, and Social Media.
- **1-Click Convert to Patient**: Converts an inquiry into an active patient file with zero redundant data entry.
- Direct WhatsApp click-to-chat integration with pre-filled clinical reminders and follow-up templates.

### 9. Operating Expenses & Financial Intelligence
- Categorized expense vouchers: Rent, Salaries, Electricity, Medical Supplies, Telecom, Maintenance.
- **Invoiced vs Realized Cash Collections**: Distinguishes accrual billings from cash receipts.
- Doctor revenue contribution analytics and tender distribution pie charts.

### 10. Role-Based Access Control (RBAC) & Audit Trail
- 7 distinct operational roles: `Super Admin`, `Clinic Administrator`, `Doctor`, `Receptionist`, `Cashier`, `Pharmacist`, `Accountant`.
- PostgreSQL Row Level Security (RLS) policies on every table.
- Immutable security audit trail recording billing, clinical modifications, and administrative actions.
- Modular SaaS configuration panel to enable or disable optional modules.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

### 3. Execute Database Migrations
Run the SQL migration scripts in your Supabase SQL Editor:
1. `supabase/migrations/20261106000001_initial_schema.sql`
2. `supabase/migrations/20261106000002_rls_policies.sql`
3. `supabase/migrations/20261106000003_pos_and_inventory_rpc.sql`
4. `supabase/migrations/20261106000004_storage_buckets.sql`
5. `supabase/seed.sql`

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to launch the platform.

### 5. Production Build
```bash
npm run build
```

---

## 📁 Project Architecture

```
D:\Clinic POS - CRM/
├── docs/
│   ├── database-schema.md      # Detailed ER diagram and table relationships
│   ├── setup-guide.md          # Step-by-step local installation and Supabase guide
│   ├── deployment-guide.md     # Vercel deployment instructions
│   └── testing-checklist.md    # 30-point QA verification checklist
├── supabase/
│   ├── migrations/             # 4 versioned PostgreSQL migrations
│   ├── seed.sql                # Rich demo clinic dataset (Karachi, PK)
│   └── config.toml             # Supabase CLI configuration
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login, Forgot Password, Reset Password
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/      # Operational analytics and KPI overview
│   │   │   ├── patients/       # Directory, New Patient, Patient 360 profile
│   │   │   ├── appointments/   # Scheduling, conflict checks, new booking
│   │   │   ├── clinical/       # Consultations, Vitals, Prescriptions, Print
│   │   │   ├── pos/            # Fast billing terminal, Invoices, Payments
│   │   │   ├── inventory/      # Products, Batches & Expiry, Suppliers, POs
│   │   │   ├── crm/            # Leads pipeline, Follow-ups, WhatsApp logs
│   │   │   ├── finance/        # Expenses, Financial reports & CSV export
│   │   │   └── management/     # Doctors, Staff RBAC, Services, Audit, Settings
│   ├── components/
│   │   ├── ui/                 # Reusable buttons, cards, badges, inputs, dialogs
│   │   └── layout/             # Responsive Navy sidebar, header, global search
│   ├── lib/
│   │   ├── supabase/           # SSR browser & server clients, middleware
│   │   └── utils.ts            # Currency formatter, date, BMI calculator
│   ├── services/
│   │   └── clinic-service.ts   # Unified service layer with Supabase + seed data
│   └── types/
│       └── database.types.ts   # Complete TypeScript interfaces for all 30+ tables
├── .env.example
├── package.json
└── tsconfig.json
```
