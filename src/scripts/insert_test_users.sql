-- SQL Script to insert test users data into Supabase database
-- Run this in the Supabase SQL Editor

-- ========================================
-- User 1: Mike Johnson (English User)
-- Email: mike.johnson@blitz.com
-- Password: MikeBlitz2024!
-- ========================================

-- Note: Replace 'USER_ID_1' with the actual UUID after creating the user in Supabase Auth
-- You need to create the auth user first via Supabase Dashboard > Authentication > Add User

-- Insert profile for Mike Johnson
INSERT INTO profiles (id, username, avatar, location, bio, language, friends_count, posts_count, created_at)
VALUES (
  'USER_ID_1', -- Replace with actual user ID from auth.users
  'Mike Johnson',
  '👨',
  'San Francisco, CA',
  'Trail finder and coffee lover ☕🚴‍♂️',
  'en',
  52,
  31,
  NOW()
);

-- Insert device for Mike Johnson
INSERT INTO devices (user_id, bike_model, battery_level, is_connected, last_connected_at)
VALUES (
  'USER_ID_1',
  'BESV JF1',
  82,
  false,
  NOW()
);

-- Insert statistics for Mike Johnson
INSERT INTO statistics (user_id, total_distance, today_distance, total_rides, total_time, avg_speed, carbon_saved, energy_points, calories, elevation, updated_at)
VALUES (
  'USER_ID_1',
  2156.8,
  15.7,
  243,
  156.3,
  13.8,
  252.4,
  5820,
  42350,
  15680,
  NOW()
);

-- Insert ride history for Mike Johnson
INSERT INTO ride_history (user_id, date, distance, duration, avg_speed, calories)
VALUES
  ('USER_ID_1', '2024-11-19', 15.7, 1.2, 13.1, 285),
  ('USER_ID_1', '2024-11-18', 22.3, 1.6, 13.9, 412),
  ('USER_ID_1', '2024-11-17', 18.5, 1.3, 14.2, 356),
  ('USER_ID_1', '2024-11-16', 25.1, 1.8, 13.9, 478),
  ('USER_ID_1', '2024-11-15', 19.8, 1.4, 14.1, 389);

-- Insert achievements for Mike Johnson
INSERT INTO achievements (user_id, achievement_id, unlocked_at)
VALUES
  ('USER_ID_1', 'first_ride', NOW()),
  ('USER_ID_1', '100km', NOW()),
  ('USER_ID_1', '500km', NOW()),
  ('USER_ID_1', '1000km', NOW()),
  ('USER_ID_1', '2000km', NOW()),
  ('USER_ID_1', 'carbon_hero', NOW()),
  ('USER_ID_1', 'social_butterfly', NOW()),
  ('USER_ID_1', 'early_bird', NOW());

-- Insert check-ins for Mike Johnson
INSERT INTO check_ins (user_id, landmark_id, checked_in_at)
VALUES
  ('USER_ID_1', '1', NOW()),
  ('USER_ID_1', '2', NOW()),
  ('USER_ID_1', '3', NOW()),
  ('USER_ID_1', '4', NOW());

-- Insert ranking for Mike Johnson
INSERT INTO rankings (user_id, carbon_rank, badge, carbon_saved, updated_at)
VALUES (
  'USER_ID_1',
  1,
  'platinum',
  252.4,
  NOW()
);

-- ========================================
-- User 2: Sarah Chen (English User)
-- Email: sarah.chen@blitz.com
-- Password: SarahGreen2024!
-- ========================================

-- Insert profile for Sarah Chen
INSERT INTO profiles (id, username, avatar, location, bio, language, friends_count, posts_count, created_at)
VALUES (
  'USER_ID_2', -- Replace with actual user ID from auth.users
  'Sarah Chen',
  '👩',
  'Oakland, CA',
  'Weekend warrior on two wheels | Green commuter 🌱',
  'en',
  38,
  24,
  NOW()
);

-- Insert device for Sarah Chen
INSERT INTO devices (user_id, bike_model, battery_level, is_connected, last_connected_at)
VALUES (
  'USER_ID_2',
  'BESV TRS1 AM',
  65,
  false,
  NOW()
);

-- Insert statistics for Sarah Chen
INSERT INTO statistics (user_id, total_distance, today_distance, total_rides, total_time, avg_speed, carbon_saved, energy_points, calories, elevation, updated_at)
VALUES (
  'USER_ID_2',
  1434.2,
  8.4,
  178,
  98.7,
  14.5,
  167.9,
  3860,
  28120,
  9340,
  NOW()
);

-- Insert ride history for Sarah Chen
INSERT INTO ride_history (user_id, date, distance, duration, avg_speed, calories)
VALUES
  ('USER_ID_2', '2024-11-19', 8.4, 0.6, 14.0, 162),
  ('USER_ID_2', '2024-11-17', 16.2, 1.1, 14.7, 298),
  ('USER_ID_2', '2024-11-16', 12.8, 0.9, 14.2, 235),
  ('USER_ID_2', '2024-11-15', 20.5, 1.4, 14.6, 378),
  ('USER_ID_2', '2024-11-14', 14.3, 1.0, 14.3, 265);

-- Insert achievements for Sarah Chen
INSERT INTO achievements (user_id, achievement_id, unlocked_at)
VALUES
  ('USER_ID_2', 'first_ride', NOW()),
  ('USER_ID_2', '100km', NOW()),
  ('USER_ID_2', '500km', NOW()),
  ('USER_ID_2', '1000km', NOW()),
  ('USER_ID_2', 'eco_warrior', NOW()),
  ('USER_ID_2', 'weekend_rider', NOW());

-- Insert check-ins for Sarah Chen
INSERT INTO check_ins (user_id, landmark_id, checked_in_at)
VALUES
  ('USER_ID_2', '1', NOW()),
  ('USER_ID_2', '3', NOW()),
  ('USER_ID_2', '5', NOW());

-- Insert ranking for Sarah Chen
INSERT INTO rankings (user_id, carbon_rank, badge, carbon_saved, updated_at)
VALUES (
  'USER_ID_2',
  2,
  'gold',
  167.9,
  NOW()
);

-- ========================================
-- User 3: 李明 (Chinese User)
-- Email: li.ming@blitz.com
-- Password: LiMing2024!
-- ========================================

-- Insert profile for 李明
INSERT INTO profiles (id, username, avatar, location, bio, language, friends_count, posts_count, created_at)
VALUES (
  'USER_ID_3', -- Replace with actual user ID from auth.users
  '李明',
  '🧑',
  '上海市',
  '上班通勤 | BESV 爱好者 🚴',
  'zh',
  25,
  15,
  NOW()
);

-- Insert device for 李明
INSERT INTO devices (user_id, bike_model, battery_level, is_connected, last_connected_at)
VALUES (
  'USER_ID_3',
  'BESV PSA1',
  58,
  false,
  NOW()
);

-- Insert statistics for 李明
INSERT INTO statistics (user_id, total_distance, today_distance, total_rides, total_time, avg_speed, carbon_saved, energy_points, calories, elevation, updated_at)
VALUES (
  'USER_ID_3',
  876.3,
  5.2,
  132,
  67.4,
  13.0,
  102.6,
  2340,
  17180,
  5620,
  NOW()
);

-- Insert ride history for 李明
INSERT INTO ride_history (user_id, date, distance, duration, avg_speed, calories)
VALUES
  ('USER_ID_3', '2024-11-19', 5.2, 0.4, 13.0, 98),
  ('USER_ID_3', '2024-11-18', 6.8, 0.5, 13.6, 128),
  ('USER_ID_3', '2024-11-17', 5.5, 0.4, 13.8, 105),
  ('USER_ID_3', '2024-11-16', 7.2, 0.6, 12.0, 135),
  ('USER_ID_3', '2024-11-15', 6.1, 0.5, 12.2, 115);

-- Insert achievements for 李明
INSERT INTO achievements (user_id, achievement_id, unlocked_at)
VALUES
  ('USER_ID_3', 'first_ride', NOW()),
  ('USER_ID_3', '100km', NOW()),
  ('USER_ID_3', '500km', NOW()),
  ('USER_ID_3', 'daily_commuter', NOW());

-- Insert check-ins for 李明
INSERT INTO check_ins (user_id, landmark_id, checked_in_at)
VALUES
  ('USER_ID_3', '1', NOW()),
  ('USER_ID_3', '2', NOW());

-- Insert ranking for 李明
INSERT INTO rankings (user_id, carbon_rank, badge, carbon_saved, updated_at)
VALUES (
  'USER_ID_3',
  4,
  'silver',
  102.6,
  NOW()
);

-- ========================================
-- Verification Query
-- ========================================
-- Run this to verify all data was inserted correctly
SELECT 
  p.username,
  p.location,
  p.language,
  d.bike_model,
  d.battery_level,
  s.total_distance,
  s.carbon_saved,
  r.carbon_rank,
  r.badge
FROM profiles p
LEFT JOIN devices d ON p.id = d.user_id
LEFT JOIN statistics s ON p.id = s.user_id
LEFT JOIN rankings r ON p.id = r.user_id
WHERE p.username IN ('Mike Johnson', 'Sarah Chen', '李明')
ORDER BY r.carbon_rank;
