# Vercel Production Deployment Guide

## 1. Overview
This application is fully optimized for continuous deployment on **Vercel** with Next.js 15 App Router, Turbopack, and Supabase SSR authentication cookies.

---

## 2. Pre-Deployment Build Verification

Always verify that the local build succeeds before pushing:

```bash
cd "D:\Clinic POS - CRM"
npm run build
```

Expected result:
```
✓ Compiled successfully
✓ Finished writing to disk
✓ Generating static pages (5/5)
✓ Finalizing page optimization
```

---

## 3. Deploying to Vercel

### Method A: Deploy via Vercel CLI (Installed)
The `vercel` CLI is available on your machine (v59.11.7):

1. Login to your Vercel account:
   ```bash
   vercel login
   ```
2. Link your local project:
   ```bash
   vercel link
   ```
3. Set your environment variables on Vercel:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add NEXT_PUBLIC_CLINIC_ID
   ```
4. Deploy a preview build:
   ```bash
   vercel
   ```
5. Deploy to production (only after verifying the preview):
   ```bash
   vercel --prod
   ```

### Method B: Deploy via GitHub / GitLab Repository
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete clinic pos + crm saas application"
   git remote add origin https://github.com/your-username/clinic-pos-crm.git
   git push -u origin main
   ```
2. Navigate to [https://vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Set the **Framework Preset** to `Next.js`.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (ensure this is marked as Sensitive/Secret)
   - `NEXT_PUBLIC_CLINIC_ID`
6. Click **Deploy**.

---

## 4. Production Checklist
- [x] Turbopack production builds without TypeScript errors
- [x] Row Level Security (RLS) enabled on all 30 PostgreSQL tables
- [x] Stored procedures handle concurrent stock deduction with row locking
- [x] Private Supabase Storage buckets configured for patient medical records
- [x] Service role key protected and never leaked in client-side bundles
