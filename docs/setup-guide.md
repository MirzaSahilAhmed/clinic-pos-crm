# Setup Guide: Clinic POS + CRM SaaS

## 1. Prerequisites
- **Node.js**: v18+ or v20+ (Verified on Node v22.20.0)
- **npm**: 9+ (Verified on npm 11.18.0)
- **Supabase Account**: [https://supabase.com](https://supabase.com)
- **Local Machine**: Windows, macOS, or Linux

---

## 2. Local Installation

Open your terminal inside the project directory:

```bash
cd "D:\Clinic POS - CRM"
npm install
```

---

## 3. Environment Variables Configuration

Copy the `.env.example` template to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your credentials inside `.env.local`:

```env
# 1. Supabase Project Dashboard -> Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Server-side Secret Role Key (Only used server-side, never exposed to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 3. Default Clinic Entity UUID
NEXT_PUBLIC_CLINIC_ID=11111111-1111-1111-1111-111111111111
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Regional Settings (Pakistan Defaults)
NEXT_PUBLIC_DEFAULT_CURRENCY=PKR
NEXT_PUBLIC_DEFAULT_TIMEZONE=Asia/Karachi
NEXT_PUBLIC_DEFAULT_LOCALE=en-PK
```

---

## 4. Applying Database Migrations to Supabase

The database migrations are located in `supabase/migrations/`:
1. `20261106000001_initial_schema.sql` (Creates 30 core tables and indexes)
2. `20261106000002_rls_policies.sql` (Enables Row Level Security with clinic multi-tenant checks)
3. `20261106000003_pos_and_inventory_rpc.sql` (Atomic `execute_pos_sale` transaction)
4. `20261106000004_storage_buckets.sql` (Private storage buckets for RX, patient files)
5. `seed.sql` (Seeds demo Pakistani healthcare center, doctors, services, inventory, and patients)

### Method A: Via Supabase Web Dashboard (Recommended & Fast)
1. Go to your Supabase Project Dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Click on **SQL Editor** in the left sidebar.
3. Open and copy the contents of `supabase/migrations/20261106000001_initial_schema.sql` and run it.
4. Execute `20261106000002_rls_policies.sql`.
5. Execute `20261106000003_pos_and_inventory_rpc.sql`.
6. Execute `20261106000004_storage_buckets.sql`.
7. Execute `supabase/seed.sql` to populate initial demo data.

### Method B: Via Supabase CLI
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

---

## 5. Starting Development Server

```bash
npm run dev
```
Open your browser at `http://localhost:3000`. The application will launch the Clinic Operational Overview.

---

## 6. Pre-Configured Demo Staff Accounts

You can test role-based access directly on the login page:
- **Super Admin / CMO**: `dr.tariq@alshifaclinic.pk` (Password: `Clinic2026!Secure`)
- **Doctor (Pediatrician)**: `dr.ayesha@alshifaclinic.pk` (Password: `Clinic2026!Secure`)
- **Receptionist**: `reception@alshifaclinic.pk` (Password: `Clinic2026!Secure`)
- **Cashier / POS**: `cashier@alshifaclinic.pk` (Password: `Clinic2026!Secure`)
- **Pharmacist**: `pharmacy@alshifaclinic.pk` (Password: `Clinic2026!Secure`)
- **Accountant**: `accounts@alshifaclinic.pk` (Password: `Clinic2026!Secure`)
