# 🚀 Deployment Guide - Vercel

Complete step-by-step guide to deploy your Examination Center Allotment System to Vercel.

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Supabase project set up
- [ ] Database schema applied
- [ ] Code pushed to GitHub

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Verify these files exist:**
- ✅ `vercel.json` (already configured)
- ✅ `.env.example` (for reference)
- ✅ `README.md`
- ✅ All source code in `src/`

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Configure Environment Variables

Click **"Environment Variables"** and add:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional - Email Notifications
RESEND_API_KEY=re_your_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Where to get these values:**

1. **Supabase Keys:**
   - Go to Supabase Dashboard
   - Navigate to: Settings → API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

2. **Resend API Key (Optional):**
   - Sign up at [resend.com](https://resend.com)
   - Go to API Keys
   - Create new key
   - Copy → `RESEND_API_KEY`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Once deployed, you'll get a URL: `https://your-project.vercel.app`

### Step 5: Post-Deployment Setup

#### A. Update Supabase RLS Policies (Important!)

In Supabase SQL Editor, run:

```sql
-- Allow public access to centers (for dropdown)
CREATE POLICY "Allow public read on centers" ON centers
    FOR SELECT USING (true);

-- Allow anonymous registration
CREATE POLICY "Allow public insert on students" ON students
    FOR INSERT WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Service role full access on students" ON students
    FOR ALL USING (true);

CREATE POLICY "Service role full access on centers" ON centers
    FOR ALL USING (true);
```

#### B. Configure Supabase Auth (for Admin)

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add redirect URLs:
   - `https://your-project.vercel.app/admin/dashboard`

#### C. Test Your Deployment

1. **Test Student Registration:**
   - Visit `https://your-project.vercel.app/apply`
   - Fill and submit form
   - Verify success message with roll number

2. **Test Admit Card:**
   - Visit `https://your-project.vercel.app/admit-card`
   - Enter roll number and DOB
   - Download PDF

3. **Test Admin Dashboard:**
   - Visit `https://your-project.vercel.app/admin`
   - Login with credentials
   - Verify dashboard shows correct data

### Step 6: Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## 🔍 Vercel Configuration Explained

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]  // US East (change if needed)
}
```

**Available Regions:**
- `iad1` - US East (Virginia)
- `sfo1` - US West (San Francisco)
- `gru1` - South America (São Paulo)
- `fra1` - Europe (Frankfurt)
- `sin1` - Asia (Singapore)

Choose the region closest to your target audience.

## 📊 Monitoring & Analytics

### Vercel Dashboard

Monitor your deployment:
- **Analytics**: User visits, page views
- **Speed Insights**: Performance metrics
- **Logs**: Runtime errors and console output
- **Deployments**: History of all builds

Access: `vercel.com/your-project/analytics`

### Supabase Dashboard

Monitor database:
- **Database**: Table data, row counts
- **Logs**: Query logs, errors
- **Performance**: Query performance
- **Auth**: User signups, sessions

Access: `supabase.com/dashboard/project/your-project`

## 🚨 Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Ensure all dependencies are in package.json
npm install
```

**Error: Environment variables not found**
- Add all required env vars in Vercel dashboard
- Redeploy after adding variables

### Runtime Errors

**Error: Supabase connection failed**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure no trailing slashes in URL

**Error: Database query failed**
- Check if schema is properly set up in Supabase
- Verify RLS policies allow required access
- Check Supabase logs for detailed error

### Email Not Sending

**Resend API errors**
- Verify `RESEND_API_KEY` is correct
- Check you haven't exceeded free tier limit (100/day)
- Verify sender email is from `resend.dev` domain or verified domain

**Solution: Emails are optional**
- System works without email notifications
- Remove or comment out email code if not needed

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests
# 4. Deploys to production
```

**Preview Deployments:**
- Every branch gets a preview URL
- Perfect for testing before merging

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use different keys for development and production
- ✅ Rotate `SUPABASE_SERVICE_ROLE_KEY` periodically
- ✅ Don't expose service role key on client

### Supabase Security
- ✅ Enable Row Level Security (RLS) on all tables
- ✅ Create specific policies for each operation
- ✅ Use `service_role` only in server-side code
- ✅ Monitor database logs for suspicious activity

### Vercel Security
- ✅ Enable automatic HTTPS
- ✅ Use environment-specific variables
- ✅ Enable "Automatically expose System Environment Variables" for debugging
- ✅ Set up deployment protection (paid plans)

## 📈 Scaling Considerations

### Free Tier Limits

**Vercel Free:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ⚠️ 100 serverless function executions/day

**Supabase Free:**
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth/month
- ✅ 50,000 monthly active users
- ⚠️ Projects pause after 1 week of inactivity

**Resend Free:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month

### When to Upgrade

Consider upgrading when:
- 📊 More than 80 students register (database limit)
- 📧 Need more than 100 emails/day
- 🌐 Traffic exceeds 100 GB/month
- ⚡ Need faster serverless functions

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Database schema applied in Supabase
- [ ] RLS policies configured
- [ ] Test student registration flow
- [ ] Test admit card download
- [ ] Test admin dashboard
- [ ] Test on mobile devices
- [ ] Verify email notifications work
- [ ] Check error handling
- [ ] Set up monitoring/alerts
- [ ] Document admin credentials securely
- [ ] Create database backup plan
- [ ] Test under load (multiple concurrent registrations)

## 📞 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Congratulations!

Your Examination Center Allotment System is now live and ready to handle student registrations!

**Next Steps:**
1. Share the registration link with students
2. Monitor registrations in admin dashboard
3. Enable email notifications for better UX
4. Set up database backups
5. Consider adding analytics for insights

---

Need help? Check the main [README.md](README.md) or open an issue on GitHub.
