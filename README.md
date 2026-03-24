# 🏥 DavShon Hospital Management System

A production-ready Hospital Management System MVP built with Next.js 14, Convex, NextAuth.js v5, Tailwind CSS, Framer Motion, and Recharts.

---

## 🚀 HOW TO DEPLOY — STEP BY STEP

### ─────────────────────────────────────────
### STEP 1 — Clone / Copy the Project
### ─────────────────────────────────────────

```bash
# If using git
git clone <your-repo-url>
cd davshon-hms

# Or copy from /tmp/davshon-hms
cp -r /tmp/davshon-hms ~/projects/davshon-hms
cd ~/projects/davshon-hms
```

---

### ─────────────────────────────────────────
### STEP 2 — Install Dependencies
### ─────────────────────────────────────────

```bash
npm install
```

---

### ─────────────────────────────────────────
### STEP 3 — Set Up Convex (Database)
### ─────────────────────────────────────────

1. Create a free Convex account at https://convex.dev
2. Install Convex CLI globally:
   ```bash
   npm install -g convex
   ```
3. Initialize Convex in the project:
   ```bash
   npx convex dev
   ```
   - This will open your browser to log in
   - A new Convex project will be created
   - Your `NEXT_PUBLIC_CONVEX_URL` will be printed — copy it!
   - The schema and functions are pushed automatically from `convex/`

4. The Convex dashboard will be at: https://dashboard.convex.dev

---

### ─────────────────────────────────────────
### STEP 4 — Configure Environment Variables
### ─────────────────────────────────────────

Copy the example env file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# NextAuth — generate a strong secret:
# Run: openssl rand -base64 32
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Convex — from Step 3
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

---

### ─────────────────────────────────────────
### STEP 5 — Run Locally
### ─────────────────────────────────────────

```bash
# Terminal 1 — Start Convex dev server (keeps schema in sync)
npx convex dev

# Terminal 2 — Start Next.js
npm run dev
```

Open: http://localhost:3000

---

### ─────────────────────────────────────────
### STEP 6 — Deploy to Vercel (Recommended)
### ─────────────────────────────────────────

#### Option A — Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables (when prompted, or via dashboard):
# NEXTAUTH_SECRET=<your-secret>
# NEXTAUTH_URL=https://your-app.vercel.app
# NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

#### Option B — Vercel Dashboard (No CLI needed)

1. Push your project to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add these Environment Variables in Vercel settings:

   | Variable | Value |
   |---|---|
   | `NEXTAUTH_SECRET` | (run: `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |
   | `NEXT_PUBLIC_CONVEX_URL` | Your Convex URL from Step 3 |

5. Click **Deploy** ✅

#### Deploy Convex to Production
```bash
npx convex deploy
```
This pushes all schema + functions to your production Convex project.

---

### ─────────────────────────────────────────
### STEP 7 — Deploy to Other Platforms
### ─────────────────────────────────────────

#### Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
# Add env vars in Railway dashboard
```

#### Render
1. Connect your GitHub repo at https://render.com
2. Create a new "Web Service"
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables in Render dashboard

#### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
```bash
docker build -t davshon-hms .
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_CONVEX_URL=https://your.convex.cloud \
  davshon-hms
```

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@davshon.com | admin123 |
| Doctor | doctor@davshon.com | doctor123 |
| Nurse | nurse@davshon.com | nurse123 |
| Receptionist | receptionist@davshon.com | rec123 |
| Lab Technician | lab@davshon.com | lab123 |
| Pharmacist | pharmacist@davshon.com | pharm123 |

---

## 📁 Project Structure

```
davshon-hms/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (dashboard)/         # All protected pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── patients/        # Patient management
│   │   ├── appointments/    # OPD appointments
│   │   ├── billing/         # Invoicing & billing
│   │   ├── laboratory/      # Lab tests & results
│   │   ├── pharmacy/        # Drug inventory
│   │   ├── reports/         # Analytics & charts
│   │   └── admin/           # Staff management
│   └── api/auth/            # NextAuth handler
├── components/
│   ├── layout/              # Sidebar, Header
│   ├── modules/             # Feature-specific components
│   ├── providers/           # Auth + Convex providers
│   └── ui/                  # Reusable UI (Table, Modal, Badge...)
├── convex/                  # Database schema & functions
├── lib/                     # Auth, utils, permissions
├── types/                   # TypeScript interfaces
└── middleware.ts            # Route protection
```

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | NextAuth.js v5 (JWT) |
| Database | Convex |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## 🔒 RBAC — Role Permissions

| Module | Admin | Doctor | Nurse | Receptionist | Lab Tech | Pharmacist |
|---|---|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patients | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Appointments | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Laboratory | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Pharmacy | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Administration | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🗃️ Connecting Convex to Pages

The pages currently use **mock data** for the MVP demo. To wire up live Convex data:

```tsx
// Example: Replace mock patients with Convex
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// In your component:
const patients = useQuery(api.patients.getAll, { limit: 50 });
const createPatient = useMutation(api.patients.create);
```

All Convex functions are ready in `convex/` — just swap the mock arrays.

---

## 📝 Production Checklist

- [ ] Change all demo passwords in `lib/auth.ts`
- [ ] Set a strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Run `npx convex deploy` to push schema to production
- [ ] Enable HTTPS on your hosting platform
- [ ] Replace mock data with `useQuery`/`useMutation` Convex calls
- [ ] Add proper error monitoring (Sentry, etc.)
- [ ] Set up database backups in Convex dashboard

