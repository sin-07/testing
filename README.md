# 🎓 Examination Center Allotment System

A complete examination management system built with **Next.js 14 (App Router)**, **Supabase (PostgreSQL)**, and **Tailwind CSS**. Features automatic center allocation based on proximity and capacity management.

## ✨ Features

### 🎯 Core Functionality
- **Student Registration Form** with 10 exam center options
- **Automatic Center Allotment** - assigns nearest available center if preferred is full
- **Transaction-Safe** allocation using database row locking (prevents overbooking)
- **Admit Card System** with PDF download
- **Admin Dashboard** with real-time statistics
- **Email Notifications** (optional) for registration and admit cards

### 📊 Admin Features
- Center-wise capacity monitoring
- Student list with search functionality
- Registration statistics dashboard
- Export-ready student data

### 🔒 Technical Highlights
- **Race Condition Safe**: PostgreSQL row-level locking
- **Scalable Architecture**: Server Actions for mutations
- **Type-Safe**: Full TypeScript with Zod validation
- **Responsive UI**: Mobile-first Tailwind CSS design
- **Free Deployment**: Vercel-ready configuration

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Supabase** | PostgreSQL database + Authentication |
| **Tailwind CSS** | Styling |
| **Zod** | Form validation |
| **jsPDF + html2canvas** | PDF generation |
| **Resend** | Email notifications (optional) |

## 📦 Project Structure

```
src/
├── actions/              # Server Actions
│   ├── registration.ts   # Student registration with center allotment
│   ├── admin.ts          # Admin dashboard data
│   ├── admit-card.ts     # Admit card fetching
│   └── email.ts          # Email notifications
├── app/
│   ├── apply/            # Student registration page
│   ├── admit-card/       # Admit card download page
│   ├── admin/            # Admin dashboard
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   └── layout/           # Header, Footer
├── lib/
│   ├── supabase/         # Supabase client setup
│   ├── types.ts          # TypeScript types
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Helper functions
└── supabase/
    └── schema.sql        # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier)
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Center\ Allotment_Proj
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire [schema.sql](supabase/schema.sql) file
3. This will create:
   - `centers` table with 10 exam centers (8 capacity each)
   - `students` table
   - `email_logs` table
   - `register_student()` function with automatic center allotment logic
   - Required indexes and RLS policies

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Email notifications
RESEND_API_KEY=your_resend_api_key
```

**Get Supabase Keys:**
- Dashboard → Project Settings → API
- Copy `URL` and `anon` key
- Copy `service_role` key (keep this secret!)

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 How It Works

### Center Allotment Algorithm

The system uses a PostgreSQL function (`register_student`) that ensures safe concurrent registration:

```sql
-- 1. Try to allocate the student's selected center
SELECT id FROM centers 
WHERE name = selected_center AND filled_count < capacity 
FOR UPDATE;  -- Lock the row

-- 2. If full, find nearest available center
SELECT id FROM centers 
WHERE filled_count < capacity
ORDER BY ABS(location_order - selected_center_order) ASC
LIMIT 1 FOR UPDATE;

-- 3. Insert student and update center count atomically
INSERT INTO students (...) VALUES (...);
UPDATE centers SET filled_count = filled_count + 1 WHERE id = center_id;
```

**Key Features:**
- `FOR UPDATE` locks rows to prevent race conditions
- Nearest center logic based on `location_order`
- Atomic transaction ensures data consistency
- Returns detailed registration result

### Available Exam Centers

| Center | Capacity | Location Order |
|--------|----------|----------------|
| Patna | 8 | 1 |
| Gaya | 8 | 2 |
| Patna City | 8 | 3 |
| Danapur | 8 | 4 |
| Buxar | 8 | 5 |
| Rajgir | 8 | 6 |
| Biharsharif | 8 | 7 |
| Nalanda | 8 | 8 |
| Pawapuri | 8 | 9 |
| Fatuha | 8 | 10 |

**Total Capacity**: 80 students

## 🎨 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/apply` | Student registration form |
| `/admit-card` | Admit card download page |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard with stats |
| `/admin/dashboard/students` | All registered students |

## 📧 Email Notifications (Optional)

The system uses [Resend](https://resend.com) for email notifications:

1. Create free account at [resend.com](https://resend.com)
2. Get API key (free tier: 100 emails/day)
3. Add `RESEND_API_KEY` to `.env.local`
4. Update sender email in [email.ts](src/actions/email.ts)

Emails sent:
- ✅ Registration confirmation with roll number and center
- 📄 Admit card availability notification

## 🔐 Admin Access

For admin authentication, you can use **Supabase Auth**:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Create admin user:
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO auth.users (email, encrypted_password)
   VALUES ('admin@example.com', crypt('your_password', gen_salt('bf')));
   ```

Or use the simplified admin check in the current implementation.

## 🚢 Deployment (Vercel)

### Option 1: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your repository
5. Add environment variables from `.env.local`
6. Click **Deploy**

### Option 2: Deploy via CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your environment variables when asked.

### Post-Deployment Checklist

✅ Add environment variables in Vercel dashboard  
✅ Test student registration  
✅ Verify email notifications work  
✅ Test admit card download  
✅ Check admin dashboard access  
✅ Test on mobile devices  

## 🧪 Testing the System

### Test Student Registration

1. Go to `/apply`
2. Fill in details:
   - Name: Test Student
   - Email: test@example.com
   - Mobile: 9876543210
   - DOB: 2000-01-01
   - Center: Patna
3. Submit and note the roll number

### Test Admit Card

1. Go to `/admit-card`
2. Enter roll number and DOB
3. Download PDF

### Test Admin Dashboard

1. Go to `/admin`
2. Login with credentials
3. View statistics and student list

## 🛠️ Customization

### Change Center Capacity

Edit [schema.sql](supabase/schema.sql):

```sql
INSERT INTO centers (name, capacity, location_order) VALUES
    ('Patna', 10, 1),  -- Change 8 to 10
    ...
```

### Add More Centers

```sql
INSERT INTO centers (name, capacity, filled_count, location_order) VALUES
    ('New Center', 8, 0, 11);
```

Update [types.ts](src/lib/types.ts):

```typescript
export const EXAM_CENTERS = [
  'Patna',
  'Gaya',
  // ... existing centers
  'New Center',
] as const
```

### Modify Email Templates

Edit functions in [email.ts](src/actions/email.ts):
- `generateRegistrationEmailHTML()`
- `generateAdmitCardEmailHTML()`

## 📊 Database Schema

```
centers
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
├── capacity (INTEGER, DEFAULT 8)
├── filled_count (INTEGER, DEFAULT 0)
├── location_order (INTEGER) -- For nearest center logic
└── timestamps

students
├── id (UUID, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── mobile (VARCHAR, UNIQUE)
├── dob (DATE)
├── roll_no (VARCHAR, UNIQUE)
├── selected_center (VARCHAR)
├── allotted_center_id (UUID, FK)
├── registration_status (ENUM)
└── timestamps
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 💡 Tips & Best Practices

- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` on the client
- Enable **Row Level Security (RLS)** in production
- Use **environment variables** for all secrets
- Test concurrent registrations to verify locking works
- Monitor Supabase logs for errors
- Set up database backups in Supabase dashboard

## 🐛 Troubleshooting

### Registration fails with "Database error"
- Check if Supabase schema is properly set up
- Verify environment variables are correct
- Check Supabase logs for detailed errors

### Emails not sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for API limits
- Emails are optional - system works without them

### Admin dashboard shows no data
- Ensure at least one student is registered
- Check Supabase connection
- Verify RLS policies allow service_role access

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check Supabase documentation
- Review Next.js App Router docs

---

Built with ❤️ using Next.js and Supabase
