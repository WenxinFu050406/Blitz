# 🔧 Fix 404 Error - Community Posts Not Found

## Problem
You're seeing "Failed to fetch posts, status: 404" when trying to view the Community page. This happens because the database doesn't have any users or posts yet.

## Solution (Quick Fix - 2 Minutes)

### Step 1: Open Setup Page
Click on **"Open Setup Guide →"** link on the login page, or navigate to:
```
/setup.html
```

### Step 2: Create Test Users
1. Click the **"Create Test Users"** button
2. Wait for all 3 users to be created (Mike Johnson, Sarah Chen, 李明)
3. You'll see ✓ success marks when complete

### Step 3: Create Sample Posts
1. Click the **"Create Sample Posts"** button
2. Wait for 5 sample posts to be created
3. You'll see ✓ success marks when complete

### Step 4: Log In
Use any of these test accounts:

**English User:**
- Email: `mike.johnson@blitz.com`
- Password: `MikeBlitz2024!`

**中文用户:**
- Email: `li.ming@blitz.com`
- Password: `LiMing2024!`

### Step 5: View Community
Now when you go to the Community page, you'll see posts from all three test users!

---

## What This Does

The setup process:
1. ✅ Creates 3 complete user accounts with authentication
2. ✅ Initializes user profiles with stats and ride history
3. ✅ Sets up bike device information
4. ✅ Creates sample community posts
5. ✅ Stores everything persistently in the database

## Troubleshooting

**"User already exists" warning**
- This is OK! The script will skip creating duplicate users

**Still getting 404 after setup**
- Make sure you completed Step 3 (Create Sample Posts)
- Try logging out and back in
- Check browser console for more detailed errors

**Can't access /setup.html**
- The file should be in your project root
- Try refreshing the page

---

## Technical Details

The 404 error occurs because:
- The Community API endpoint `/posts` exists and works correctly
- But there's no data in the KV store yet
- The backend returns 404 when no posts are found
- The setup creates the initial data structure

After running setup, the KV store will contain:
- User profiles and authentication data
- Community posts with proper associations
- Like/comment data structures
- All necessary relationships

---

Need more help? Check `/SETUP_GUIDE.md` for detailed documentation.
