# ============================================================
# EXAMINATION CENTER ALLOTMENT SYSTEM - MONGODB SETUP
# ============================================================
# This project uses MongoDB instead of SQL databases
# Follow the instructions below to set up your database
# ============================================================

## Option 1: MongoDB Atlas (Recommended for Production)

1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a new cluster (free tier M0 is fine)
3. Set up database access:
   - Create a database user with password
   - Add your IP to the IP Access List (or 0.0.0.0/0 for all IPs)
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
5. Add to your `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/exam_management?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB

1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Add to your `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/exam_management
   ```

## Database Initialization

After setting up MongoDB, run the seed script to create exam centers:

```bash
npm run seed
```

This will create 10 examination centers:
- Patna (location_order: 1)
- Gaya (location_order: 2)
- Patna City (location_order: 3)
- Danapur (location_order: 4)
- Buxar (location_order: 5)
- Rajgir (location_order: 6)
- Biharsharif (location_order: 7)
- Nalanda (location_order: 8)
- Pawapuri (location_order: 9)
- Fatuha (location_order: 10)

Each center has a capacity of 8 students (Total: 80 students)

## Collections Structure

### centers
```javascript
{
  _id: ObjectId,
  name: String (unique),
  capacity: Number (default: 8),
  filled_count: Number (default: 0),
  location_order: Number,
  created_at: Date,
  updated_at: Date
}
```

### students
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  mobile: String (unique),
  dob: Date,
  roll_no: String (unique, format: EXAM2026XXXX),
  selected_center: String,
  allotted_center_id: ObjectId (ref: centers),
  registration_status: String (enum: pending, confirmed, cancelled),
  email_sent: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### email_logs
```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: students),
  email_type: String,
  recipient_email: String,
  status: String (enum: pending, sent, failed),
  error_message: String,
  sent_at: Date
}
```

## Center Allotment Algorithm

The system uses `location_order` to find the nearest center when a selected center is full:

1. Student selects preferred center
2. If center has capacity → Allot that center
3. If center is full → Find nearest available center by:
   - Calculate distance: `abs(location_order - selected_center_order)`
   - Sort by distance (ascending)
   - Pick the first available center

## Indexes

The following indexes are created automatically by Mongoose:
- centers: name, filled_count, location_order
- students: email, mobile, roll_no, allotted_center_id
- email_logs: student_id, status

## Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://...

# Admin Credentials (for simple auth)
ADMIN_EMAIL=admin@exam.com
ADMIN_PASSWORD=admin123

# Email Configuration (optional - Resend)
RESEND_API_KEY=re_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
