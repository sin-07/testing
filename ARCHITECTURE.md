# 🏗️ System Architecture

Visual overview of the Examination Center Allotment System architecture.

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Student   │  │   Admit    │  │   Admin    │            │
│  │    Form    │  │    Card    │  │ Dashboard  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  /apply    │  │ /admit-card│  │   /admin   │            │
│  │   page     │  │    page    │  │  dashboard │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER ACTIONS LAYER                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │registration│  │ admit-card │  │   admin    │            │
│  │    .ts     │  │    .ts     │  │    .ts     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE CLIENT LAYER                      │
│              ┌─────────────────────────┐                     │
│              │  Supabase JS Client     │                     │
│              └─────────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER (PostgreSQL)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  centers   │  │  students  │  │email_logs  │            │
│  │   table    │  │   table    │  │   table    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  ┌────────────┐  ┌─────────────────────────────┐           │
│  │  Functions │  │ register_student()          │           │
│  │            │  │ generate_roll_number()      │           │
│  └────────────┘  └─────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│              ┌─────────────────────────┐                     │
│              │  Resend (Email API)     │                     │
│              └─────────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### 1. Student Registration Flow

```
┌─────────────┐
│   Student   │
│ Opens /apply│
└──────┬──────┘
       │ 1. Fills form with center preference
       ↓
┌──────────────────┐
│ Registration Form│
│  (Client-side)   │
│  - Zod validation│
└──────┬───────────┘
       │ 2. Submit form data
       ↓
┌──────────────────────┐
│ registerStudent()    │
│  Server Action       │
│  - Validate data     │
│  - Call DB function  │
└──────┬───────────────┘
       │ 3. RPC call
       ↓
┌──────────────────────────────┐
│ register_student()           │
│  PostgreSQL Function         │
│  ┌────────────────────────┐  │
│  │ 1. Check duplicates    │  │
│  │ 2. Find center         │  │
│  │    - Preferred first   │  │
│  │    - Nearest if full   │  │
│  │ 3. Lock row (FOR UPDATE│  │
│  │ 4. Generate roll number│  │
│  │ 5. Insert student      │  │
│  │ 6. Update center count │  │
│  └────────────────────────┘  │
└──────┬───────────────────────┘
       │ 4. Return result
       ↓
┌──────────────────────┐
│  Server Action       │
│  - Send email (async)│
└──────┬───────────────┘
       │ 5. Return to client
       ↓
┌──────────────────┐
│ Registration Form│
│ - Show success   │
│ - Display roll # │
│ - Show center    │
└──────────────────┘
```

### 2. Center Allotment Algorithm

```
START: Student selects "Patna"
  ↓
┌────────────────────────────┐
│ Check if "Patna" available │
│ filled_count < capacity?   │
└────────┬───────────────────┘
         │
    ┌────┴────┐
    │  YES    │  NO
    ↓         ↓
 ┌─────┐  ┌──────────────────────┐
 │Allot│  │Find nearest center   │
 │Patna│  │                      │
 └─────┘  │1. Get Patna order: 1 │
          │2. Query centers:     │
          │   WHERE filled < cap │
          │   ORDER BY           │
          │   ABS(order - 1) ASC │
          │                      │
          │Result: Patna City (3)│
          │Distance: |3-1| = 2   │
          └──────┬───────────────┘
                 │
          ┌──────┴────────┐
          │ Allot Patna   │
          │     City      │
          └───────────────┘
                 │
          ┌──────┴────────┐
          │Update center  │
          │filled_count++ │
          └───────────────┘
                 │
                END
```

### 3. Admit Card Download Flow

```
┌─────────────┐
│   Student   │
│Opens /admit-│
│    card     │
└──────┬──────┘
       │ 1. Enter roll # + DOB
       ↓
┌──────────────────┐
│ AdmitCardForm    │
│ - Zod validation │
└──────┬───────────┘
       │ 2. Submit credentials
       ↓
┌──────────────────────┐
│ getAdmitCard()       │
│ Server Action        │
│ - Query student      │
└──────┬───────────────┘
       │ 3. SELECT with WHERE
       ↓
┌──────────────────────┐
│ student_details view │
│ JOIN students +      │
│      centers         │
└──────┬───────────────┘
       │ 4. Return data
       ↓
┌──────────────────────┐
│ AdmitCardDisplay     │
│ - Render card        │
│ - jsPDF ready        │
└──────┬───────────────┘
       │ 5. User clicks download
       ↓
┌──────────────────────┐
│ html2canvas()        │
│ - Capture DOM        │
└──────┬───────────────┘
       │ 6. Canvas data
       ↓
┌──────────────────────┐
│ jsPDF()              │
│ - Convert to PDF     │
│ - Trigger download   │
└──────────────────────┘
```

### 4. Admin Dashboard Flow

```
┌─────────────┐
│    Admin    │
│Opens /admin/│
│  dashboard  │
└──────┬──────┘
       │ 1. Navigate
       ↓
┌──────────────────────┐
│ Dashboard Page       │
│ useEffect on mount   │
└──────┬───────────────┘
       │ 2. Fetch data
       ↓
┌─────────────────────────┐
│ getCenterStats()        │
│ getStudentCount()       │
│ (Parallel requests)     │
└──────┬──────────────────┘
       │ 3. Database queries
       ↓
┌──────────────────────────┐
│ Supabase Queries         │
│ SELECT * FROM centers    │
│ SELECT COUNT(*) FROM     │
│        students          │
└──────┬───────────────────┘
       │ 4. Return results
       ↓
┌──────────────────────┐
│ Dashboard Page       │
│ - Render stats       │
│ - Show progress bars │
│ - Display table      │
└──────────────────────┘
```

## 🗄️ Database Schema Diagram

```
┌─────────────────────────────┐
│        centers              │
├─────────────────────────────┤
│ id (UUID) [PK]              │
│ name (VARCHAR) [UNIQUE]     │
│ capacity (INT) = 8          │
│ filled_count (INT) = 0      │
│ location_order (INT)        │
│ created_at (TIMESTAMPTZ)    │
│ updated_at (TIMESTAMPTZ)    │
└─────────────┬───────────────┘
              │ 1
              │ has many
              │ *
┌─────────────┴───────────────┐
│        students             │
├─────────────────────────────┤
│ id (UUID) [PK]              │
│ name (VARCHAR)              │
│ email (VARCHAR) [UNIQUE]    │
│ mobile (VARCHAR) [UNIQUE]   │
│ dob (DATE)                  │
│ roll_no (VARCHAR) [UNIQUE]  │
│ selected_center (VARCHAR)   │
│ allotted_center_id (UUID)   │◄── [FK] centers.id
│ registration_status (ENUM)  │
│ email_sent (BOOLEAN)        │
│ created_at (TIMESTAMPTZ)    │
│ updated_at (TIMESTAMPTZ)    │
└─────────────┬───────────────┘
              │ 1
              │ has many
              │ *
┌─────────────┴───────────────┐
│       email_logs            │
├─────────────────────────────┤
│ id (UUID) [PK]              │
│ student_id (UUID) [FK]      │◄── students.id
│ email_type (VARCHAR)        │
│ recipient_email (VARCHAR)   │
│ status (VARCHAR)            │
│ error_message (TEXT)        │
│ sent_at (TIMESTAMPTZ)       │
└─────────────────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────┐
│              CLIENT (Browser)               │
│  ┌───────────────────────────────────────┐  │
│  │  Next.js Client Components            │  │
│  │  - Uses NEXT_PUBLIC_SUPABASE_ANON_KEY │  │
│  │  - Limited permissions                │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ HTTPS only
┌─────────────────────────────────────────────┐
│          SERVER (Next.js Runtime)           │
│  ┌───────────────────────────────────────┐  │
│  │  Server Actions                       │  │
│  │  - Uses SUPABASE_SERVICE_ROLE_KEY     │  │
│  │  - Full database access               │  │
│  │  - Environment variables only         │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ Authenticated connection
┌─────────────────────────────────────────────┐
│           SUPABASE (PostgreSQL)             │
│  ┌───────────────────────────────────────┐  │
│  │  Row Level Security (RLS)             │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ anon role:                      │  │  │
│  │  │  - SELECT centers               │  │  │
│  │  │  - INSERT students              │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ service_role:                   │  │  │
│  │  │  - Full access all tables       │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## 📦 Component Hierarchy

```
App Root
│
├── Layout (Header + Footer)
│
├── Home Page (/)
│   └── Hero section with CTAs
│
├── Apply Page (/apply)
│   └── RegistrationForm
│       ├── FormInput (name)
│       ├── FormInput (email)
│       ├── FormInput (mobile)
│       ├── FormInput (dob)
│       ├── Select (centers)
│       ├── Button (submit)
│       └── Alert (success/error)
│
├── Admit Card Page (/admit-card)
│   ├── AdmitCardForm
│   │   ├── FormInput (roll number)
│   │   ├── FormInput (dob)
│   │   └── Button (submit)
│   │
│   └── AdmitCardDisplay
│       ├── Student details
│       ├── Center details
│       ├── Instructions
│       └── Button (download PDF)
│
└── Admin Dashboard (/admin/dashboard)
    ├── Dashboard Page
    │   ├── DashboardCard (Total Students)
    │   ├── DashboardCard (Total Centers)
    │   ├── DashboardCard (Seats Filled)
    │   ├── DashboardCard (Available)
    │   └── CenterStatusTable
    │
    └── Students Page
        ├── Search Input
        └── StudentsTable
            ├── Table Headers
            └── Student Rows
```

## 🔄 State Management

```
┌────────────────────────────────────────┐
│         Client State (React)           │
│  ┌──────────────────────────────────┐  │
│  │  Local Component State           │  │
│  │  - Form values                   │  │
│  │  - Loading states                │  │
│  │  - Error messages                │  │
│  │  - Success flags                 │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│       Server State (Supabase)          │
│  ┌──────────────────────────────────┐  │
│  │  Database Tables                 │  │
│  │  - centers (source of truth)     │  │
│  │  - students (source of truth)    │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              GITHUB REPOSITORY               │
│  - Source code                              │
│  - Automatic deployments on push            │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ Push to main
┌─────────────────────────────────────────────┐
│                VERCEL PLATFORM               │
│  ┌───────────────────────────────────────┐  │
│  │  Build Process                        │  │
│  │  1. npm install                       │  │
│  │  2. npm run build                     │  │
│  │  3. Deploy to CDN                     │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  Runtime Environment                  │  │
│  │  - Serverless functions               │  │
│  │  - Edge network                       │  │
│  │  - Environment variables              │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ API calls
┌─────────────────────────────────────────────┐
│              SUPABASE CLOUD                  │
│  ┌───────────────────────────────────────┐  │
│  │  PostgreSQL Database                  │  │
│  │  - Auto backups                       │  │
│  │  - Connection pooling                 │  │
│  │  - Row Level Security                 │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  Authentication                       │  │
│  │  - JWT tokens                         │  │
│  │  - Session management                 │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│              END USERS                       │
│  - Students (registration + admit card)     │
│  - Admins (dashboard)                       │
└─────────────────────────────────────────────┘
```

## 📊 Performance Architecture

```
┌─────────────────────────────────────┐
│          CDN Edge Nodes             │
│  - Static assets cached             │
│  - Geographic distribution          │
└─────────────┬───────────────────────┘
              │
              ↓ < 50ms
┌─────────────────────────────────────┐
│        Next.js Server               │
│  ┌───────────────────────────────┐  │
│  │ ISR (Static generation)       │  │
│  │ - Homepage cached             │  │
│  │ - Revalidate on demand        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Server Actions                │  │
│  │ - Database queries            │  │
│  │ - Business logic              │  │
│  └───────────────────────────────┘  │
└─────────────┬───────────────────────┘
              │
              ↓ Connection pool
┌─────────────────────────────────────┐
│      Supabase Database              │
│  ┌───────────────────────────────┐  │
│  │ Indexes for fast queries      │  │
│  │ - email, mobile, roll_no      │  │
│  │ - center filled_count         │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Connection pooler             │  │
│  │ - Handles 1000+ connections   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🎯 Key Architectural Decisions

### 1. **Server Actions over API Routes**
- Simpler implementation
- Type-safe by default
- Automatic error handling
- Better developer experience

### 2. **PostgreSQL Function for Allocation**
- Atomic operations
- Row-level locking
- Complex logic in database
- Better performance

### 3. **Client-Side PDF Generation**
- No server overhead
- Instant download
- Works offline
- Better user experience

### 4. **Materialized View for Admin**
- Faster queries
- Pre-joined data
- Simplified queries
- Better performance

### 5. **Optional Email Service**
- System works without email
- Can be added later
- No dependency on external service
- Graceful degradation

---

**Architecture Principles:**
- 🎯 Simplicity over complexity
- 🔒 Security by default
- ⚡ Performance first
- 📱 Mobile responsive
- 🔄 Scalable design
- 🆓 Free tier friendly
