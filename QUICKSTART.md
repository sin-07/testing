# ⚡ Quick Start Guide

Get your Examination Center Allotment System running in **10 minutes**!

## 🎯 What You'll Build

A complete exam registration system with:
- ✅ Student registration with center selection
- ✅ Automatic center allotment (nearest available if full)
- ✅ Admit card generation with PDF download
- ✅ Admin dashboard with statistics
- ✅ Email notifications (optional)

## 📦 Step 1: Setup Project (2 minutes)

```bash
# Clone and install
git clone <your-repo-url>
cd "Center Allotment_Proj"
npm install
```

## 🗄️ Step 2: Setup Database (3 minutes)

### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **"New Project"**
3. Enter project name, password, region
4. Wait for project to be ready (~2 minutes)

### B. Run Database Schema

1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy entire content of `supabase/schema.sql`
4. Paste and click **"Run"**
5. ✅ You should see "Success. No rows returned"

**What this creates:**
- 10 exam centers (Patna, Gaya, etc.) with 8 capacity each
- Student registration table
- Smart allocation function
- All required indexes and policies

## 🔑 Step 3: Get API Keys (1 minute)

In Supabase Dashboard:
1. Go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (keep secret!)
```

## ⚙️ Step 4: Configure Environment (1 minute)

```bash
# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key

# Optional: Email notifications (skip for now)
# RESEND_API_KEY=re_your_key
```

## 🚀 Step 5: Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Step 6: Test Everything (2 minutes)

### Test 1: Register a Student

1. Go to http://localhost:3000/apply
2. Fill the form:
   - Name: Test Student
   - Email: test@example.com
   - Mobile: 9876543210
   - DOB: 2000-01-01
   - Center: **Patna**
3. Click **Submit**
4. ✅ You should see: "Registration Successful!"
5. **Note the Roll Number** (e.g., EXAM20260001)

### Test 2: Download Admit Card

1. Go to http://localhost:3000/admit-card
2. Enter:
   - Roll Number: EXAM20260001
   - DOB: 2000-01-01
3. Click **Get Admit Card**
4. ✅ Click **Download PDF**

### Test 3: View Admin Dashboard

1. Go to http://localhost:3000/admin/dashboard
2. ✅ See statistics:
   - Total Students: 1
   - Total Centers: 10
   - Seats Filled: 1
   - Available Seats: 79
3. Click **View All Students**
4. ✅ See your test student in the table

## 🎨 What You Just Built

### Pages Created

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/apply` | Student registration form |
| `/admit-card` | Admit card download |
| `/admin/dashboard` | Admin statistics |
| `/admin/dashboard/students` | Student list |

### Key Features

1. **Smart Center Allotment**
   - Student selects preferred center
   - If full → automatically assigns nearest available center
   - Uses PostgreSQL row locking (no race conditions!)

2. **PDF Admit Card**
   - Professional layout
   - Student + center details
   - Download as PDF

3. **Real-time Dashboard**
   - Center-wise capacity status
   - Visual progress bars
   - Search functionality

## 🔧 Common Issues & Fixes

### ❌ "Database error occurred"

**Cause:** Schema not applied or wrong credentials

**Fix:**
1. Check `.env.local` has correct Supabase URL and keys
2. Re-run `schema.sql` in Supabase SQL Editor
3. Restart dev server: `npm run dev`

### ❌ "Module not found" errors

**Cause:** Missing dependencies

**Fix:**
```bash
npm install
```

### ❌ Page shows blank/loading forever

**Cause:** Supabase client connection issue

**Fix:**
1. Verify all env vars are set in `.env.local`
2. Check browser console for errors (F12)
3. Check Supabase project is active (not paused)

## 📧 Optional: Setup Email Notifications

Skip this if you want to test quickly. Add later if needed.

1. Sign up at [resend.com](https://resend.com) (free)
2. Get API key
3. Add to `.env.local`:
```env
RESEND_API_KEY=re_your_api_key
```
4. Restart dev server

Emails will be sent on:
- ✅ Successful registration
- ✅ Admit card generation

## 🚢 Deploy to Production

Ready to go live? Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

Quick deploy to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables when prompted
# Follow the setup wizard
```

Your app will be live at: `https://your-app.vercel.app`

## 🎯 Next Steps

Now that your system is running:

1. **Customize Content**
   - Update exam date, time, instructions
   - Modify center list if needed
   - Customize admit card layout

2. **Add Features**
   - Admin authentication with Supabase Auth
   - Export student data to CSV
   - SMS notifications (using Twilio)
   - Payment integration (if needed)

3. **Production Ready**
   - Enable email notifications
   - Set up monitoring
   - Create database backups
   - Add rate limiting

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Database Schema**: [supabase/schema.sql](supabase/schema.sql)

## 💡 Pro Tips

1. **Test Concurrent Registrations**
   - Open multiple browser tabs
   - Register students simultaneously
   - Verify no seat overbooking

2. **Monitor Center Capacity**
   - Watch admin dashboard while students register
   - See real-time updates

3. **Backup Database**
   - Supabase Dashboard → Database → Backups
   - Download periodic backups

4. **Check Logs**
   - Browser Console (F12) for client errors
   - Supabase Logs for database queries
   - Server console for backend logs

## 🎉 You're Done!

Your Examination Center Allotment System is ready to use!

**Share your registration link:**
- Local: `http://localhost:3000/apply`
- Production: `https://your-domain.vercel.app/apply`

Need help? Check the [README.md](README.md) or open an issue on GitHub.

---

**Built with:**
- ⚡ Next.js 14 (App Router)
- 🗄️ Supabase (PostgreSQL)
- 🎨 Tailwind CSS
- 📄 jsPDF + html2canvas

Happy coding! 🚀
