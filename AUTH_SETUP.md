# Authentication Setup Guide

## Overview

Provd now includes **Supabase** authentication with an automatic **local fallback** system. This means:
- ✅ **Supabase enabled**: Uses cloud database for user authentication
- ✅ **Supabase unavailable**: Automatically falls back to browser localStorage
- ✅ **No manual configuration required** for local development

---

## Quick Start (Local Development)

No setup needed! The app uses local authentication by default.

```bash
npm install
npm run dev
```

Then create an account or sign in. Data is stored in your browser's localStorage.

---

## Production Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings → API** and copy:
   - `Project URL` (https://qeopejothjgroaqzwnej.supabase.co)
   - `Anon Key` (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb3Blam90aGpncm9hcXp3bmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzI4MzMsImV4cCI6MjA5NTM0ODgzM30.L8Pba1mc29of3kD8i3HAz8V3EjQs6_iVJE-UXX_IElE)

### Step 2: Set Up Database Tables

Run these SQL queries in your Supabase SQL editor:

```sql
-- Users table (Supabase Auth handles this automatically)
-- But you can store additional user metadata:

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User data table for storing progress
CREATE TABLE user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Step 3: Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

### Step 4: Deploy

When deploying to Vercel:

1. Go to **Settings → Environment Variables**
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`
3. Deploy!

---

## How It Works

### Local Mode (No Supabase)
- Users are stored in `localStorage` as `provd_users`
- Sessions stored in `provd_session`
- Data persists until browser cache is cleared
- **Perfect for development & testing**

### Supabase Mode (Production)
- Users stored in Supabase authentication
- Profile data in `users` table
- Progress data in `user_data` table
- Full cloud sync across devices

### Automatic Fallback
The `AuthService` automatically:
1. Tries to initialize Supabase
2. If Supabase keys are missing or initialization fails → uses localStorage
3. Provides the same API regardless of which backend is used

---

## Authentication Methods

### Email & Password (Built-in)
```javascript
import { AuthService } from './AuthService';

// Sign up
const { error, data } = await AuthService.signUp(
  'user@example.com',
  'password123',
  'John Doe'
);

// Sign in
const { error, data } = await AuthService.signIn(
  'user@example.com',
  'password123'
);

// Sign out
await AuthService.signOut();
```

### Check Authentication Mode
```javascript
const isLocal = AuthService.isLocalAuth();
console.log(isLocal ? 'Using local auth' : 'Using Supabase');
```

---

## Debugging

### Check if using local auth
Open browser DevTools Console:
```javascript
localStorage.getItem('provd_users')  // Shows all users
localStorage.getItem('provd_session') // Shows current session
```

### Clear all local auth data
```javascript
localStorage.removeItem('provd_users');
localStorage.removeItem('provd_session');
localStorage.clear(); // Nuclear option
```

### Force Supabase logging
Edit `AuthService.js` and uncomment console logs

---

## Security Notes

⚠️ **Local Auth (Development Only)**
- Passwords are hashed but NOT production-grade
- Use **ONLY** for development/testing
- Do NOT store sensitive data

✅ **Supabase (Production)**
- Enterprise-grade PostgreSQL encryption
- Row-Level Security (RLS)
- Built-in OAuth support
- Audit logs available

---

## Troubleshooting

### "Invalid email or password"
- Check email exists
- For signup: password must be 8+ characters

### Data not persisting
- Check browser localStorage isn't disabled
- Try incognito mode
- Clear cache and refresh

### Supabase not connecting
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`
- Check project is active on supabase.com
- Look for CORS errors in browser console

### "createClient is not a function"
- Run `npm install @supabase/supabase-js`
- Restart dev server

---

## API Reference

### AuthService

```javascript
// Initialize (called automatically in App)
await AuthService.initAuth()

// Sign up
AuthService.signUp(email, password, name)

// Sign in
AuthService.signIn(email, password)

// Sign out
AuthService.signOut()

// Get current session
AuthService.getCurrentSession()

// Store user data
AuthService.storeUserData(userId, data)

// Get user data
AuthService.getUserData(userId)

// Check if using local auth
AuthService.isLocalAuth()
```

---

## Next Steps

- [ ] Deploy to Vercel with Supabase
- [ ] Add Google OAuth (in Supabase settings)
- [ ] Set up email verification
- [ ] Add password reset flow
- [ ] Implement 2FA (TOTP)
- [ ] Add session expiry

---

## Support

For issues:
1. Check `.env.local` is in `.gitignore` ✅
2. Check Supabase keys are valid
3. Check RLS policies in Supabase dashboard
4. Check browser console for errors
5. Try local auth first to isolate issues
