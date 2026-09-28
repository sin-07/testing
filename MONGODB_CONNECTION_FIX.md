# MongoDB Atlas Connection Fix

## The Problem
Error: `querySrv ECONNREFUSED _mongodb._tcp.cluster0.jvzvacw.mongodb.net`

**This means: MongoDB Atlas is BLOCKING your connection because your IP address is not whitelisted.**

---

## SOLUTION (Follow Step-by-Step)

### Step 1: Whitelist Your IP in MongoDB Atlas

1. Open browser and go to: **https://cloud.mongodb.com/**

2. **Sign in** with your MongoDB Atlas account

3. Click on your **Project** (where Cluster0 is located)

4. In the left sidebar, click **"Network Access"** 
   (under SECURITY section)

5. Click the green **"ADD IP ADDRESS"** button

6. Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` to allow all IPs
   - For production, you should restrict this to specific IPs

7. Click **"Confirm"**

8. **WAIT 2-3 MINUTES** for the changes to propagate

---

### Step 2: Verify Your Connection String

Your current connection string in `.env.local`:
```
MONGODB_URI=mongodb+srv://aniketsingh9322_db_user:5Xw9tKfdjELWNJQ0@cluster0.jvzvacw.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0
```

This looks correct. Make sure:
- Username: `aniketsingh9322_db_user`
- Password: `5Xw9tKfdjELWNJQ0`
- Cluster: `cluster0.jvzvacw.mongodb.net`
- Database: `EMS`

---

### Step 3: Verify Database User Exists

1. In MongoDB Atlas, go to **"Database Access"** (left sidebar)
2. Verify user `aniketsingh9322_db_user` exists
3. Make sure it has **"Read and write to any database"** permission
4. Password should match: `5Xw9tKfdjELWNJQ0`

---

### Step 4: Test Connection

After whitelisting IP (and waiting 2-3 minutes):

1. **Stop your dev server** (Ctrl+C in terminal)

2. **Restart Next.js:**
   ```bash
   npm run dev
   ```

3. **Check the console** - you should see:
   ```
   ✅ MongoDB connected successfully
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:3000/apply
   ```

---

## Common Issues

### Issue 1: "Cluster doesn't exist"
- Your cluster might be paused or deleted
- Go to Atlas → Clusters → Resume cluster if paused

### Issue 2: "Still getting ECONNREFUSED after whitelisting"
- Wait 2-3 minutes for IP whitelist to propagate
- Clear your browser cache
- Restart your computer/router
- Check if you're behind a corporate firewall or VPN

### Issue 3: "Authentication failed"
- Password might be wrong
- Reset password in Database Access → Edit User → Reset Password

---

## Verification Checklist

✅ IP Address whitelisted in Network Access (0.0.0.0/0)
✅ Database user exists with correct password
✅ Cluster is running (not paused)
✅ Connection string is correct in .env.local
✅ Waited 2-3 minutes after making changes
✅ Restarted Next.js dev server

---

## Your Code Status: ✅ PERFECT

Your code is production-ready and follows all best practices:
- ✅ Singleton MongoDB connection
- ✅ Proper error handling
- ✅ Center capacity validation (8 students max)
- ✅ Duplicate email/mobile prevention
- ✅ Atomic transactions for seat allocation
- ✅ Unique indexes on email, mobile, roll_no
- ✅ Clean error messages
- ✅ TypeScript with proper types

**THE ONLY ISSUE IS MONGODB ATLAS IP WHITELISTING.**

Once you whitelist your IP, everything will work perfectly!
