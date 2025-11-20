-- Blitz App - Complete Database Schema
-- Run this script in Supabase SQL Editor to create all required tables

-- ========================================
-- 1. Profiles Table (用户档案表)
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT,
  location TEXT,
  bio TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'zh')),
  friends_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- 2. Devices Table (设备信息表)
-- ========================================
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bike_model TEXT NOT NULL,
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  is_connected BOOLEAN DEFAULT false,
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own devices" ON devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" ON devices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices" ON devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 3. Statistics Table (统计数据表)
-- ========================================
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_distance DECIMAL(10, 2) DEFAULT 0,
  today_distance DECIMAL(10, 2) DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  total_time DECIMAL(10, 2) DEFAULT 0,
  avg_speed DECIMAL(10, 2) DEFAULT 0,
  carbon_saved DECIMAL(10, 2) DEFAULT 0,
  energy_points INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 0,
  elevation INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own statistics" ON statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON statistics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own statistics" ON statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 4. Ride History Table (骑行历史表)
-- ========================================
CREATE TABLE IF NOT EXISTS ride_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  distance DECIMAL(10, 2) NOT NULL,
  duration DECIMAL(10, 2) NOT NULL,
  avg_speed DECIMAL(10, 2),
  calories INTEGER,
  route_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ride_history_user_date ON ride_history(user_id, date DESC);

ALTER TABLE ride_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ride history" ON ride_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ride history" ON ride_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 5. Achievements Table (成就表)
-- ========================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_achievements_user ON achievements(user_id);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 6. Check-ins Table (打卡表)
-- ========================================
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  landmark_id TEXT NOT NULL,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  photo_url TEXT,
  UNIQUE(user_id, landmark_id)
);

CREATE INDEX idx_check_ins_user ON check_ins(user_id);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all check-ins" ON check_ins
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own check-ins" ON check_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 7. Rankings Table (排名表)
-- ========================================
CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  carbon_rank INTEGER,
  badge TEXT CHECK (badge IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  carbon_saved DECIMAL(10, 2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_rankings_carbon_rank ON rankings(carbon_rank);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all rankings" ON rankings
  FOR SELECT USING (true);

CREATE POLICY "Users can update own ranking" ON rankings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ranking" ON rankings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 8. Posts Table (社区帖子表)
-- ========================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user ON posts(user_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 9. Friendships Table (好友关系表)
-- ========================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships" ON friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friendships" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friendships" ON friendships
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ========================================
-- 10. Notifications Table (通知表)
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- Functions and Triggers
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Verification
-- ========================================
-- Verify all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
