import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8ab7634a/health", (c) => {
  return c.json({ status: "ok" });
});

// User Registration
app.post("/make-server-8ab7634a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, phone, password, username, avatar, contactType, seedData } = body;

    if (!password || (!email && !phone) || !username) {
      return c.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create user with Supabase Auth
    const authData: any = {
      password,
      email_confirm: true,
      user_metadata: { username, avatar, contactType }
    };

    if (email) {
      authData.email = email;
    }
    if (phone) {
      authData.phone = phone;
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser(authData);

    if (error) {
      console.log('Signup error during user creation:', error);
      return c.json({ error: error.message || 'Failed to create user' }, { status: 400 });
    }

    const userId = data.user.id;

    // Store user profile in KV store
    const userProfile = {
      id: userId,
      email: email || '',
      phone: phone || '',
      username,
      name: username,
      avatar,
      location: seedData?.location || 'Downtown Area',
      bio: seedData?.bio || 'BESV rider 🚴‍♂️',
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${userId}:profile`, userProfile);

    // Initialize user stats (use seed data if provided)
    const userStats = {
      totalDistance: seedData?.totalDistance || 0,
      totalRides: seedData?.totalRides || 0,
      totalTime: seedData?.totalTime || 0,
      avgSpeed: seedData?.avgSpeed || 0,
      carbonSaved: seedData?.carbonSaved || 0,
      friendsCount: seedData?.friendsCount || 0,
      posts: seedData?.posts || 0,
      greenEnergy: seedData?.energyPoints || 0,
      calories: seedData?.calories || 0,
      elevation: seedData?.elevation || 0,
      todayDistance: seedData?.todayDistance || 0,
      carbonRank: seedData?.carbonRank || 0,
      badge: seedData?.badge || 'bronze',
      achievements: seedData?.achievements || [],
      notifications: seedData?.notifications || 0,
    };

    await kv.set(`user:${userId}:stats`, userStats);

    // Initialize device info (use seed data if provided)
    const deviceInfo = {
      model: seedData?.bikeModel || 'BESV TRS1 AM',
      battery: seedData?.battery || 100,
      totalDistance: seedData?.totalDistance || 0,
      todayDistance: seedData?.todayDistance || 0,
      speed: 0,
      status: 'parked'
    };

    await kv.set(`user:${userId}:device`, deviceInfo);

    // Initialize check-ins (use seed data if provided)
    const checkIns = seedData?.visitedLandmarks?.map((landmarkId: string) => ({
      id: `${landmarkId}-${Date.now()}`,
      landmarkId: landmarkId,
      timestamp: new Date().toISOString(),
      points: 50
    })) || [];

    await kv.set(`user:${userId}:checkins`, checkIns);
    
    // Initialize ride history (use seed data if provided)
    const rideHistory = seedData?.recentRides || [];
    await kv.set(`user:${userId}:rides`, rideHistory);

    return c.json({ 
      success: true, 
      user: { ...userProfile, ...userStats }
    });

  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, { status: 500 });
  }
});

// User Login
app.post("/make-server-8ab7634a/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, phone, password } = body;

    if (!password || (!email && !phone)) {
      return c.json({ error: 'Missing email/phone or password' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let authResult;
    if (email) {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResult = await supabase.auth.signInWithPassword({ phone, password });
    }

    const { data, error } = authResult;

    if (error || !data.session) {
      console.log('Signin error during authentication:', error);
      return c.json({ error: error?.message || 'Invalid credentials' }, { status: 401 });
    }

    const userId = data.user.id;
    const accessToken = data.session.access_token;

    // Retrieve user profile from KV store
    const userProfile = await kv.get(`user:${userId}:profile`);
    const userStats = await kv.get(`user:${userId}:stats`);

    if (!userProfile) {
      console.log('Signin error: User profile not found for userId:', userId);
      return c.json({ error: 'User profile not found' }, { status: 404 });
    }

    return c.json({ 
      success: true, 
      accessToken,
      user: { ...userProfile, ...userStats }
    });

  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Internal server error during signin' }, { status: 500 });
  }
});

// Get User Profile
app.get("/make-server-8ab7634a/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Profile fetch error during authentication:', error);
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const userProfile = await kv.get(`user:${userId}:profile`);
    const userStats = await kv.get(`user:${userId}:stats`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, { status: 404 });
    }

    return c.json({ 
      success: true, 
      user: { ...userProfile, ...userStats }
    });

  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, { status: 500 });
  }
});

// Update User Profile
app.put("/make-server-8ab7634a/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Profile update error during authentication:', error);
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const updates = await c.req.json();
    
    const currentProfile = await kv.get(`user:${userId}:profile`);
    if (!currentProfile) {
      return c.json({ error: 'User profile not found' }, { status: 404 });
    }

    const updatedProfile = { ...currentProfile, ...updates };
    await kv.set(`user:${userId}:profile`, updatedProfile);

    return c.json({ 
      success: true, 
      user: updatedProfile
    });

  } catch (error) {
    console.log('Profile update error:', error);
    return c.json({ error: 'Internal server error while updating profile' }, { status: 500 });
  }
});

// Update User Stats
app.put("/make-server-8ab7634a/user/stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Stats update error during authentication:', error);
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const updates = await c.req.json();
    
    const currentStats = await kv.get(`user:${userId}:stats`);
    if (!currentStats) {
      return c.json({ error: 'User stats not found' }, { status: 404 });
    }

    const updatedStats = { ...currentStats, ...updates };
    await kv.set(`user:${userId}:stats`, updatedStats);

    return c.json({ 
      success: true, 
      stats: updatedStats
    });

  } catch (error) {
    console.log('Stats update error:', error);
    return c.json({ error: 'Internal server error while updating stats' }, { status: 500 });
  }
});

// Get User Check-ins
app.get("/make-server-8ab7634a/user/checkins", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const checkIns = await kv.get(`user:${userId}:checkins`) || [];

    return c.json({ 
      success: true, 
      checkIns
    });

  } catch (error) {
    console.log('Check-ins fetch error:', error);
    return c.json({ error: 'Internal server error while fetching check-ins' }, { status: 500 });
  }
});

// Add User Check-in
app.post("/make-server-8ab7634a/user/checkins", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const checkInData = await c.req.json();
    
    const checkIns = await kv.get(`user:${userId}:checkins`) || [];
    const newCheckIn = {
      ...checkInData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    checkIns.push(newCheckIn);
    await kv.set(`user:${userId}:checkins`, checkIns);

    return c.json({ 
      success: true, 
      checkIn: newCheckIn
    });

  } catch (error) {
    console.log('Check-in add error:', error);
    return c.json({ error: 'Internal server error while adding check-in' }, { status: 500 });
  }
});

// Get User Device Info
app.get("/make-server-8ab7634a/user/device", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const deviceInfo = await kv.get(`user:${userId}:device`) || {
      model: 'BESV TRS1 AM',
      battery: 100,
      totalDistance: 0,
      todayDistance: 0,
      speed: 0,
      status: 'parked'
    };

    return c.json({ 
      success: true, 
      device: deviceInfo
    });

  } catch (error) {
    console.log('Device info fetch error:', error);
    return c.json({ error: 'Internal server error while fetching device info' }, { status: 500 });
  }
});

// Get User Ride History
app.get("/make-server-8ab7634a/user/rides", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const rides = await kv.get(`user:${userId}:rides`) || [];

    return c.json({ 
      success: true, 
      rides
    });

  } catch (error) {
    console.log('Ride history fetch error:', error);
    return c.json({ error: 'Internal server error while fetching ride history' }, { status: 500 });
  }
});

// ========================================
// Community Posts API
// ========================================

// Get all posts (feed)
app.get("/make-server-8ab7634a/posts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Get all posts from KV store
    const allPostsKey = 'community:posts';
    const postIds = await kv.get(allPostsKey) || [];
    
    const posts = [];
    for (const postId of postIds) {
      const post = await kv.get(`post:${postId}`);
      if (post) {
        // Check if current user has liked this post
        const userLikes = await kv.get(`user:${userId}:likes`) || [];
        const isLiked = userLikes.includes(postId);
        
        posts.push({
          ...post,
          isLiked
        });
      }
    }

    // Sort by timestamp (newest first)
    posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({ 
      success: true, 
      posts
    });

  } catch (error) {
    console.log('Posts fetch error:', error);
    return c.json({ error: 'Internal server error while fetching posts' }, { status: 500 });
  }
});

// Create a new post
app.post("/make-server-8ab7634a/posts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { content, image } = await c.req.json();

    if (!content || content.trim() === '') {
      return c.json({ error: 'Content is required' }, { status: 400 });
    }

    // Get user profile
    const userProfile = await kv.get(`user:${userId}:profile`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Create new post
    const postId = `${Date.now()}-${userId}`;
    const newPost = {
      id: postId,
      userId: userId,
      userName: userProfile.username || userProfile.name,
      userAvatar: userProfile.avatar,
      content: content.trim(),
      image: image || null,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
    };

    // Save post
    await kv.set(`post:${postId}`, newPost);

    // Add to global posts list
    const allPostsKey = 'community:posts';
    const postIds = await kv.get(allPostsKey) || [];
    postIds.unshift(postId); // Add to beginning
    await kv.set(allPostsKey, postIds);

    // Add to user's posts
    const userPosts = await kv.get(`user:${userId}:posts`) || [];
    userPosts.unshift(postId);
    await kv.set(`user:${userId}:posts`, userPosts);

    // Update user stats
    const userStats = await kv.get(`user:${userId}:stats`);
    if (userStats) {
      userStats.posts = (userStats.posts || 0) + 1;
      await kv.set(`user:${userId}:stats`, userStats);
    }

    return c.json({ 
      success: true, 
      post: { ...newPost, isLiked: false }
    });

  } catch (error) {
    console.log('Post creation error:', error);
    return c.json({ error: 'Internal server error while creating post' }, { status: 500 });
  }
});

// Like/Unlike a post
app.post("/make-server-8ab7634a/posts/:postId/like", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const postId = c.req.param('postId');

    // Get post
    const post = await kv.get(`post:${postId}`);
    if (!post) {
      return c.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get user's likes
    const userLikes = await kv.get(`user:${userId}:likes`) || [];
    const isLiked = userLikes.includes(postId);

    if (isLiked) {
      // Unlike
      const updatedLikes = userLikes.filter(id => id !== postId);
      await kv.set(`user:${userId}:likes`, updatedLikes);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      userLikes.push(postId);
      await kv.set(`user:${userId}:likes`, userLikes);
      post.likes += 1;
    }

    // Update post
    await kv.set(`post:${postId}`, post);

    return c.json({ 
      success: true, 
      isLiked: !isLiked,
      likesCount: post.likes
    });

  } catch (error) {
    console.log('Post like error:', error);
    return c.json({ error: 'Internal server error while liking post' }, { status: 500 });
  }
});

// Get comments for a post
app.get("/make-server-8ab7634a/posts/:postId/comments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const postId = c.req.param('postId');

    // Get comments for this post
    const postComments = await kv.get(`post:${postId}:comments`) || [];
    
    const comments = [];
    for (const commentId of postComments) {
      const comment = await kv.get(`comment:${commentId}`);
      if (comment) {
        // Check if current user has liked this comment
        const userCommentLikes = await kv.get(`user:${userId}:comment-likes`) || [];
        const isLiked = userCommentLikes.includes(commentId);
        
        comments.push({
          ...comment,
          isLiked
        });
      }
    }

    return c.json({ 
      success: true, 
      comments
    });

  } catch (error) {
    console.log('Comments fetch error:', error);
    return c.json({ error: 'Internal server error while fetching comments' }, { status: 500 });
  }
});

// Add a comment to a post
app.post("/make-server-8ab7634a/posts/:postId/comments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const postId = c.req.param('postId');
    const { content } = await c.req.json();

    if (!content || content.trim() === '') {
      return c.json({ error: 'Content is required' }, { status: 400 });
    }

    // Get post
    const post = await kv.get(`post:${postId}`);
    if (!post) {
      return c.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get user profile
    const userProfile = await kv.get(`user:${userId}:profile`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Create comment
    const commentId = `${Date.now()}-${userId}`;
    const newComment = {
      id: commentId,
      postId: postId,
      userId: userId,
      userName: userProfile.username || userProfile.name,
      userAvatar: userProfile.avatar,
      content: content.trim(),
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    // Save comment
    await kv.set(`comment:${commentId}`, newComment);

    // Add to post's comments list
    const postComments = await kv.get(`post:${postId}:comments`) || [];
    postComments.push(commentId);
    await kv.set(`post:${postId}:comments`, postComments);

    // Update post comments count
    post.comments = postComments.length;
    await kv.set(`post:${postId}`, post);

    return c.json({ 
      success: true, 
      comment: { ...newComment, isLiked: false }
    });

  } catch (error) {
    console.log('Comment creation error:', error);
    return c.json({ error: 'Internal server error while creating comment' }, { status: 500 });
  }
});

// Like/Unlike a comment
app.post("/make-server-8ab7634a/comments/:commentId/like", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const commentId = c.req.param('commentId');

    // Get comment
    const comment = await kv.get(`comment:${commentId}`);
    if (!comment) {
      return c.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Get user's comment likes
    const userCommentLikes = await kv.get(`user:${userId}:comment-likes`) || [];
    const isLiked = userCommentLikes.includes(commentId);

    if (isLiked) {
      // Unlike
      const updatedLikes = userCommentLikes.filter(id => id !== commentId);
      await kv.set(`user:${userId}:comment-likes`, updatedLikes);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Like
      userCommentLikes.push(commentId);
      await kv.set(`user:${userId}:comment-likes`, userCommentLikes);
      comment.likes += 1;
    }

    // Update comment
    await kv.set(`comment:${commentId}`, comment);

    return c.json({ 
      success: true, 
      isLiked: !isLiked,
      likesCount: comment.likes
    });

  } catch (error) {
    console.log('Comment like error:', error);
    return c.json({ error: 'Internal server error while liking comment' }, { status: 500 });
  }
});

Deno.serve(app.fetch);