# MongoDB Atlas Connection Guide & Troubleshooting

## The Problem
Error: `querySrv ECONNREFUSED _mongodb._tcp.<cluster-name>.mongodb.net`

**This usually means:**
1. MongoDB Atlas cluster network access requires whitelisting your IP (`0.0.0.0/0`).
2. Local ISP or Windows DNS resolver blocked the UDP SRV query.
3. Cluster is paused or deleted.

---

## SOLUTION (Step-by-Step)

### Step 1: Whitelist Your IP in MongoDB Atlas

1. Open browser and go to: **https://cloud.mongodb.com/**
2. **Sign in** with your MongoDB Atlas account
3. Click on your **Project**
4. In the left sidebar, click **"Network Access"** (under SECURITY section)
5. Click the green **"ADD IP ADDRESS"** button
6. Click **"ALLOW ACCESS FROM ANYWHERE"** (`0.0.0.0/0`)
7. Click **"Confirm"** and wait 2-3 minutes for propagation

---

### Step 2: Configure Your Connection String

In `.env.local`:
```bash
# For Local MongoDB (Default recommended):
MONGODB_URI=mongodb://127.0.0.1:27017/exam_management

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@<CLUSTER_HOST>/exam_management?retryWrites=true&w=majority
```

Make sure:
- Username: `<your_atlas_user>`
- Password: `<your_atlas_password>`
- Cluster: `<your_cluster>.mongodb.net`
- Database: `exam_management`

---

### Step 3: Verify Database User Exists

1. In MongoDB Atlas, go to **"Database Access"** (left sidebar)
2. Verify your database user exists
3. Make sure it has **"Read and write to any database"** permission

---

### Step 4: Test Connection

1. **Restart Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **Check the console** - you should see:
   ```
   [SUCCESS] MongoDB connected successfully
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:3000/apply
   ```

---

## Automatic Failover Architecture

The portal includes an automatic failover mechanism in `src/lib/mongodb/connection.ts`:
- If an Atlas connection fails or times out, it automatically connects to local MongoDB on `127.0.0.1:27017`.
- If local MongoDB is also unavailable, the portal operates seamlessly using its in-memory fallback store with zero downtime.
