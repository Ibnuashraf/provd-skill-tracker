-- Provd Supabase Database Setup
-- Run these SQL queries in your Supabase SQL Editor
-- Go to: https://app.supabase.com → Your Project → SQL Editor → New Query

-- ============================================
-- 1. CREATE USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CREATE USER DATA TABLE (Progress, Skills, etc)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- ============================================
-- 3. CREATE SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. CREATE EVIDENCE LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.evidence_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'built', 'solved', 'taught', 'read'
  description TEXT,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. CREATE ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. CREATE SKILL BUDDY TABLE (for sharing)
-- ============================================
CREATE TABLE IF NOT EXISTS public.skill_buddies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buddy_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode VARCHAR(50) DEFAULT 'observer', -- 'observer' or 'competitor'
  invite_link VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (user_id != buddy_user_id)
);

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_buddies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. CREATE RLS POLICIES - Users Table
-- ============================================
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 9. CREATE RLS POLICIES - User Data Table
-- ============================================
CREATE POLICY "Users can read own data"
  ON public.user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON public.user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON public.user_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON public.user_data FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 10. CREATE RLS POLICIES - Skills Table
-- ============================================
CREATE POLICY "Users can read own skills"
  ON public.skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON public.skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON public.skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON public.skills FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 11. CREATE RLS POLICIES - Evidence Logs
-- ============================================
CREATE POLICY "Users can read own evidence logs"
  ON public.evidence_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evidence logs"
  ON public.evidence_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own evidence logs"
  ON public.evidence_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 12. CREATE RLS POLICIES - Achievements
-- ============================================
CREATE POLICY "Users can read own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 13. CREATE RLS POLICIES - Skill Buddies
-- ============================================
CREATE POLICY "Users can read own buddy relationships"
  ON public.skill_buddies FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = buddy_user_id);

CREATE POLICY "Users can create buddy invites"
  ON public.skill_buddies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete buddy relationships"
  ON public.skill_buddies FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = buddy_user_id);

-- ============================================
-- 14. CREATE INDEXES (Performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON public.evidence_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_skill_id ON public.evidence_logs(skill_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_buddies_user_id ON public.skill_buddies(user_id);

-- ============================================
-- 15. SETUP COMPLETE ✅
-- ============================================
-- All tables and policies are now ready!
-- Your app can now:
-- ✅ Store user profiles
-- ✅ Save user progress data
-- ✅ Track skills and levels
-- ✅ Log evidence of learning
-- ✅ Manage achievements
-- ✅ Share progress with buddies
