# Supabase Database Setup Guide

## ✅ Your Credentials Are Ready!

Your `.env.local` has been updated with:
- **Project URL**: `https://qeopejothjgroaqzwnej.supabase.co`
- **Anon Key**: Set and configured

---

## 🚀 Next Steps (2 minutes)

### Step 1: Copy SQL Setup Script

Open `SUPABASE_SETUP.sql` in this folder - it contains all database setup commands.

### Step 2: Run in Supabase SQL Editor

1. Go to: **https://app.supabase.com**
2. Select your project: **qeopejothjgroaqzwnej**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. **Copy & paste entire `SUPABASE_SETUP.sql` content**
6. Click **Run** (green play button)
7. Wait for ✅ "Success" message

### Step 3: Verify Setup

In Supabase dashboard, go to **Database → Tables**. You should see:
- ✅ `users`
- ✅ `user_data`
- ✅ `skills`
- ✅ `evidence_logs`
- ✅ `achievements`
- ✅ `skill_buddies`

---

## 🔄 What Gets Created

### Tables
| Table | Purpose |
|-------|----------|
| `users` | User profiles & metadata |
| `user_data` | User progress & settings |
| `skills` | Skill tracking |
| `evidence_logs` | Learning activity log |
| `achievements` | Badges & milestones |
| `skill_buddies` | Accountability partnerships |

### Security (RLS Policies)
- Users can only read/write their own data
- Buddy invites allow sharing specific data
- Automatic cleanup when users delete account

### Performance (Indexes)
- Fast queries on `user_id`, `skill_id`
- Optimized for Vercel serverless

---

## ✨ Features Now Enabled

After setup, your app can:

✅ **Authentication**
- Email/password sign up & login
- Secure session management
- Auto logout

✅ **Skill Tracking**
- Create multiple skills
- Track levels 1-10
- Points & streaks

✅ **Evidence Logging**
- Log 4 types: Built, Solved, Taught, Read
- Timestamp proof of learning
- Points system

✅ **Achievements**
- Unlock badges
- Milestone tracking
- Visual progress

✅ **Skill Buddy**
- Share progress via invite link
- Observer mode (view-only)
- Competitor mode (streak comparison)

---

## 🧪 Test Your Setup

### Test Sign Up
1. Start dev server: `npm run dev`
2. Open http://localhost:5173
3. Click "Create account"
4. Enter: `test@example.com`, `password123`, name
5. ✅ Should redirect to dashboard

### Test Data Storage
1. In dashboard, create a skill
2. Go to Supabase → `skills` table
3. ✅ Should see your new skill!

### Verify in Database
```sql
SELECT * FROM users;
SELECT * FROM skills WHERE user_id = auth.uid();
SELECT * FROM evidence_logs ORDER BY created_at DESC;
```

---

## ⚙️ Environment Variables

Your `.env.local`:
```env
VITE_SUPABASE_URL=https://qeopejothjgroaqzwnej.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

For **production (Vercel)**:
1. Go to **Settings → Environment Variables**
2. Add both variables
3. Redeploy

---

## 🔐 Security Checklist

✅ **RLS Policies** - Enabled for all tables
✅ **Foreign Keys** - Cascade deletes on user removal
✅ **Unique Constraints** - Prevent duplicates
✅ **Anon Key** - Used only for client (safe)
✅ **Service Role Key** - Keep secret (not in `.env.local`)

---

## 🛠️ Troubleshooting

### "Permission denied" error
→ RLS policies not set up. Re-run `SUPABASE_SETUP.sql`

### "relation does not exist"
→ Tables not created. Check SQL ran successfully

### Can't sign up
→ Check `.env.local` has correct URL & key
→ Try signing in if account exists

### Data not saving
→ Check RLS policies allow user's ID
→ Check `user_id` matches `auth.uid()`

---

## 📱 Next: Connect to App

Your app is already connected! Just needed:
1. ✅ Environment variables (done)
2. ✅ Database tables (do now via SQL)
3. ✅ RLS policies (included in SQL)
4. = Ready to deploy!

---

## 🚀 Deploy to Vercel

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "add: Supabase integration"
   git push origin main
   ```

2. Go to Vercel dashboard
3. Add env variables from `.env.local`
4. Deploy!

---

## 📚 Useful Links

- [Supabase Dashboard](https://app.supabase.com/project/qeopejothjgroaqzwnej/editor)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Reference](https://supabase.com/docs/reference/sql)

---

**Status**: ✅ Ready to go! Run the SQL setup now.
