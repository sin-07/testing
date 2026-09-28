# 🏛️ National Testing Agency (NTA) - JEE (Main) 2026
## Centralized Examination Center Allotment & Management Portal

An enterprise-grade, high-performance examination management portal modeled after the **National Testing Agency (NTA) - Joint Entrance Examination (Main) 2026**. Built with **Next.js 16 (App Router)**, **TypeScript**, **MongoDB / Mongoose**, and **Vanilla Tailwind CSS**.

Featuring a **zero-loss smart proximity routing engine**, **atomic concurrency locking**, **live center radar**, and an official **5-stage candidate application wizard**.

---

## ✨ Flagship Highlights

### 🎯 Smart Proximity Allotment Engine
- **10 Centralized Bihar Examination Centers**: Patna (`PAT-01`), Danapur (`DAN-02`), Patna City (`PTC-03`), Fatuha (`FAT-04`), Biharsharif (`BIH-05`), Nalanda (`NAL-06`), Pawapuri (`PAW-07`), Rajgir (`RAJ-08`), Gaya (`GAY-09`), and Buxar (`BUX-10`).
- **Atomic Concurrency Protection**: High-throughput atomic seat reservation using MongoDB `$expr: { $lt: ['$filled_count', '$capacity'] }` preventing race conditions and double bookings.
- **Automated Overflow Routing**: If a candidate's 1st Choice center reaches capacity (8/8), the engine calculates road distances across the geographic matrix and re-routes the candidate to the nearest neighboring center with zero manual intervention.
- **Zero-Downtime In-Memory Fallback**: Continues operating seamlessly with full in-memory state persistence if network or database connectivity is temporarily interrupted.

### 📝 Authentic NTA JEE Main Application Experience (`/apply`)
- **Stage 1: Candidate Personal Details**: Name, Father's Name, Mother's Name, Gender, Category (General, GEN-EWS, OBC-NCL, SC, ST), PwD Category, Identity Document (Aadhaar / Passport / Voter ID), and **Live Age Calculator** as of 01-Jan-2026 cutoff.
- **Stage 2: Paper & 4 Exam City Preferences**: B.E. / B.Tech (Paper 1), B.Arch, Medium (English, Hindi, Urdu), and choice of 4 Bihar examination cities with live seat meters and proximity recommendations.
- **Stage 3: Academic Qualifications**: Class 10th and 12th details (Board, Roll Number, Passing Year, Stream, Marks).
- **Stage 4: Document Uploads**: Passport photograph compliance checker and digital signature preview.
- **Stage 5: Review & Security PIN (CAPTCHA)**: Full candidate summary, case-sensitive 6-character Security PIN with refresh button, and mandatory NTA Undertaking declaration.
- **Stage 6: Official NTA Confirmation Slip**: Displays 12-digit Application Number (`260310XXXXXX`), Roll Number (`EXAM2026XXXX`), Allotted Center venue address, shift timetable, QR verification code, and 1-click PDF export / print.

### 🎫 Cryptographic Admit Card Portal (`/admit-card`)
- Official Hall Ticket with candidate photo, signature, proctor barcode, and verification QR code.
- Official NTA shift timings: **Shift 1 (09:00 AM – 12:00 PM)** | Reporting: 07:30 AM | Gate Closes: 08:30 AM.
- Dual-tab search: Retrieve by Roll Number + DOB or recover lost roll number using Phone + DOB.

### 📊 Admin Command Center (`/admin`)
- Real-time KPI analytics: Total Capacity (80 seats), Occupancy Rates, Center Fill Gauges.
- Candidate table with live search, filters (preferred vs reallocated), and 1-click candidate transfer.
- Capacity management: Adjust individual center quotas dynamically.
- 1-Click CSV export for examination centers.

---

## 🏗️ Technical Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Actions, SSR, Dynamic Metadata |
| **Language** | TypeScript (Strict mode) | 100% type-safe schemas and domain contracts |
| **Database** | MongoDB & Mongoose | ACID conditional atomic updates and connection pooling |
| **Styling** | Vanilla Tailwind CSS | Curated HSL government palette, dark modes, glassmorphism |
| **Animations** | HTML5 Canvas Confetti | Zero-dependency 60fps celebration particle physics |
| **Security** | Global DNS Override & Zod | Google/Cloudflare DNS resolver, strict input validation |

---

## 📁 Project Directory Layout

```text
src/
├── actions/              # Next.js Server Actions
│   ├── admin.ts          # Center overrides, metrics, candidate transfers
│   ├── admit-card.ts     # Verification hash and admit card retrieval
│   ├── email.ts          # Notification dispatch with audit logging
│   └── registration.ts   # Concurrency lock, proximity routing, roll no generator
├── app/
│   ├── admin/            # Admin login & command center dashboard
│   ├── admit-card/       # Official NTA Admit Card display and search
│   ├── apply/            # 5-Stage NTA JEE Main Application Form
│   ├── globals.css       # Design tokens, keyframes, print media queries
│   ├── layout.tsx        # Root HTML layout with Inter typography
│   └── page.tsx          # Flagship portal landing page with notice tickers
├── components/
│   ├── home/             # HomeCenterRadar interactive seat radar
│   ├── layout/           # Government Header, Tricolor Ribbon, Footer
│   └── ui/               # Button, FormInput, Alert, NtaLogo, AshokaEmblem
└── lib/
    ├── confetti.ts       # 60fps Canvas confetti particle engine
    ├── memory-store.ts   # Zero-downtime transactional in-memory store
    ├── proximity.ts      # Geocoordinates, Haversine formula, Bihar distance matrix
    ├── types.ts          # Domain interfaces & NTA candidate profile types
    ├── validations.ts    # Zod registration and credential schemas
    └── mongodb/          # Connection manager with DNS bypass and seeder
```

---

## 🚀 Quickstart & Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/sin-07/testing.git
cd Center\ Allotment_Proj
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Local MongoDB (Default Recommended):
MONGODB_URI=mongodb://127.0.0.1:27017/exam_management

# Admin Portal Credentials
ADMIN_EMAIL=admin@examportal.com
ADMIN_PASSWORD=Admin@123

# Application Details
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_EXAM_DATE=2026-03-15
NEXT_PUBLIC_CENTER_NAME=Govt. Central Examination Complex
NEXT_PUBLIC_CENTER_ADDRESS=Frazer Road, Patna - 800001
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security & Integrity

- **Strict Validation**: All candidate inputs are sanitized with Zod schemas.
- **Protected Environment**: `.env.local` is excluded via `.gitignore` to prevent any credential leaks.
- **DNS SRV Bypass**: Configured with Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) DNS resolvers to avoid Windows/ISP UDP SRV query blocking.
- **WCAG 2.1 Compliant**: High contrast typography, accessible labels, and responsive layout across all screen sizes.
