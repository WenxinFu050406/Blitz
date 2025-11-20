# 🚀 Blitz App Setup Guide

## Quick Start

The Blitz app is now connected to a Supabase backend. To get started with test data and sample users, follow these steps:

### Step 1: Initialize Test Data

Open the setup page in your browser:
```
/setup.html
```

Or navigate to it directly in your application.

### Step 2: Create Test Users

Click the **"Create Test Users"** button on the setup page. This will:
- Create 3 test users (Mike Johnson, Sarah Chen, and 李明)
- Initialize their profiles with complete statistics
- Set up their device information
- Add ride history and achievements

### Step 3: Create Sample Posts

After the test users are created, click **"Create Sample Posts"** to:
- Add initial community posts from the test users
- Populate the community feed with sample content

### Step 4: Log In

Use any of these test accounts to log in:

**User 1: Mike Johnson** (English, High Activity)
- Email: `mike.johnson@blitz.com`
- Password: `MikeBlitz2024!`
- Bike: BESV JF1
- Stats: 2,156 km • Rank #1 • Platinum Badge

**User 2: Sarah Chen** (English, Moderate Activity)
- Email: `sarah.chen@blitz.com`
- Password: `SarahGreen2024!`
- Bike: BESV TRS1 AM
- Stats: 1,434 km • Rank #2 • Gold Badge

**User 3: 李明** (Chinese, Daily Commuter)
- Email: `li.ming@blitz.com`
- Password: `LiMing2024!`
- Bike: BESV PSA1
- Stats: 876 km • Rank #4 • Silver Badge

## Features

Once logged in, you can:

✅ View and interact with community posts
✅ Create your own posts
✅ Like and comment on posts
✅ View user statistics and ride history
✅ Check in at landmarks
✅ View the leaderboard
✅ Add friends and chat
✅ Switch between English and Chinese languages

## Troubleshooting

### 404 Error when fetching posts

This means the backend doesn't have any data yet. Run the setup process above to create test users and sample posts.

### "No access token" error

This means you need to log in first. Use one of the test user credentials above.

### User already exists

If you see "User already exists" errors, that's okay! The setup script will skip creating duplicate users and just get their access tokens for creating posts.

## Backend Architecture

The Blitz app uses:
- **Supabase Auth** for user authentication
- **Supabase Edge Functions** for API endpoints
- **KV Store** for data persistence
- **Real-time updates** for community features

All data is stored persistently and will survive page refreshes.

## Next Steps

After setup, explore the app:

1. **Home Page** - View your bike stats, unlock your bike, start rides
2. **Statistics** - Track your riding metrics and achievements
3. **Activities** - Check in at landmarks, view energy exchange stations
4. **Community** - Connect with other riders, share posts
5. **Me Page** - Manage your profile, view ride history, access settings

Enjoy riding with Blitz! ⚡🚴‍♂️
