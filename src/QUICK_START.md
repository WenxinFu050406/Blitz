# ⚡ Blitz App - Quick Start Guide

## 🎯 Fix the 404 Error in 2 Minutes

If you're seeing **"Failed to fetch posts, status: 404"**, follow these simple steps:

### 📱 Step 1: Access Setup Page

On the login screen, look for the green box at the bottom that says:
- **"First time here?"**
- Click **"Open Setup Guide →"**

Or directly visit: `/setup.html`

### 👥 Step 2: Create Test Users

1. Click **"Create Test Users"** button
2. Wait 10-20 seconds for all 3 users to be created
3. You'll see green ✓ checkmarks when done

This creates:
- 👨 **Mike Johnson** - English user (Platinum rank, 2,156 km)
- 👩 **Sarah Chen** - English user (Gold rank, 1,434 km)
- 🧑 **李明** - Chinese user (Silver rank, 876 km)

### 📝 Step 3: Create Sample Posts

1. Click **"Create Sample Posts"** button
2. Wait for 5 posts to be created
3. You'll see green ✓ checkmarks when done

### 🔐 Step 4: Log In

Use any of these credentials:

```
Email: mike.johnson@blitz.com
Password: MikeBlitz2024!
```

```
Email: sarah.chen@blitz.com
Password: SarahGreen2024!
```

```
Email: li.ming@blitz.com
Password: LiMing2024!
```

### ✅ Step 5: Enjoy!

- Go to the **Community** tab
- You'll now see posts from all test users
- You can like, comment, and create your own posts
- All data persists in the database

---

## 🔧 What Just Happened?

The 404 error occurred because:
1. The backend API was working correctly ✓
2. But there was no data in the database yet ✗
3. The setup created all necessary data ✓

Now you have:
- ✅ 3 complete user accounts with authentication
- ✅ Full user profiles with stats and history
- ✅ Bike device information
- ✅ Sample community posts
- ✅ All data stored persistently in Supabase

---

## 📚 App Features

### 🏠 Home Page
- View bike battery and connection status
- See today's riding stats
- Swipe to unlock your bike
- Start new rides

### 📊 Statistics
- Track total distance, rides, and time
- Monitor carbon savings and energy points
- View weekly/monthly charts
- Check achievements and rankings

### 🎯 Activities
- Check in at landmarks
- View energy exchange stations
- Participate in carbon rankings
- Explore city locations

### 👥 Community
- View posts from other riders
- Create and share your riding stories
- Like and comment on posts
- Add friends and chat
- View leaderboard

### 👤 Me Page
- Edit your profile
- View ride history
- Manage settings
- Check notifications
- Access help and support

---

## 🌍 Language Support

Switch between English and Chinese anytime:
- Click the language selector in the top-right corner
- All content updates instantly
- User preferences are saved

---

## 💡 Tips

**Creating Posts:**
- Click the **+** button in Community page
- Share your riding experiences
- Posts are stored permanently

**Viewing Data:**
- All statistics update in real-time
- Swipe through different time periods
- Check detailed breakdowns

**Testing Features:**
- Try different test accounts
- Each has unique stats and history
- Switch languages to see translations

---

## ❓ Troubleshooting

**Still seeing 404?**
- Make sure you completed BOTH setup steps (users AND posts)
- Try logging out and back in
- Check browser console for detailed errors

**Can't create new posts?**
- Make sure you're logged in
- Check that your access token is valid
- Try refreshing the page

**Data not persisting?**
- This shouldn't happen - all data is in Supabase
- Check your internet connection
- Contact support if issue persists

---

## 🎉 You're All Set!

Enjoy exploring the Blitz e-bike companion app. Share your feedback and happy riding! 🚴‍♂️⚡

For more detailed documentation, see:
- `/SETUP_GUIDE.md` - Detailed setup instructions
- `/FIX_404_ERROR.md` - Troubleshooting guide
- `/DATABASE_GUIDE.md` - Database schema info
