# 社区功能数据库指南 / Community Database Guide

## 概述 / Overview

社区功能现在支持完整的数据持久化，包括：
- 帖子发布和存储
- 评论功能
- 点赞系统（帖子和评论）
- 用户个性化内容

Community features now support full data persistence, including:
- Post creation and storage
- Comments functionality
- Like system (for both posts and comments)
- User-specific content

---

## 数据库设置 / Database Setup

### 1. 运行数据库架构脚本 / Run Database Schema Script

在Supabase SQL Editor中执行以下脚本：
Run the following script in Supabase SQL Editor:

```sql
-- 首先运行主数据库架构 / First run the main database schema
/scripts/create_database_schema.sql

-- 然后运行社区功能扩展 / Then run the community extensions
/scripts/community_database_schema.sql
```

### 2. 数据库表结构 / Database Tables Structure

#### Posts Table (帖子表)
```sql
posts
  - id: UUID (primary key)
  - user_id: UUID (foreign key to auth.users)
  - content: TEXT (帖子内容)
  - image_url: TEXT (可选图片)
  - likes_count: INTEGER (点赞数)
  - comments_count: INTEGER (评论数)
  - created_at: TIMESTAMPTZ
  - updated_at: TIMESTAMPTZ
```

#### Comments Table (评论表)
```sql
comments
  - id: UUID (primary key)
  - post_id: UUID (foreign key to posts)
  - user_id: UUID (foreign key to auth.users)
  - content: TEXT (评论内容)
  - likes_count: INTEGER (点赞数)
  - created_at: TIMESTAMPTZ
  - updated_at: TIMESTAMPTZ
```

#### Post Likes Table (帖子点赞表)
```sql
post_likes
  - id: UUID (primary key)
  - post_id: UUID (foreign key to posts)
  - user_id: UUID (foreign key to auth.users)
  - created_at: TIMESTAMPTZ
  - UNIQUE(post_id, user_id)
```

#### Comment Likes Table (评论点赞表)
```sql
comment_likes
  - id: UUID (primary key)
  - comment_id: UUID (foreign key to comments)
  - user_id: UUID (foreign key to auth.users)
  - created_at: TIMESTAMPTZ
  - UNIQUE(comment_id, user_id)
```

---

## API端点 / API Endpoints

所有API端点需要在请求头中包含认证令牌：
All API endpoints require authentication token in request headers:

```
Authorization: Bearer <access_token>
```

### 帖子相关 / Posts

#### 1. 获取所有帖子 / Get All Posts
```
GET /make-server-8ab7634a/posts
```

**响应示例 / Response Example:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "1234567890-user-id",
      "userId": "user-id",
      "userName": "John Doe",
      "userAvatar": "👨",
      "content": "Great ride today!",
      "image": "https://...",
      "likes": 5,
      "comments": 2,
      "timestamp": "2024-11-20T10:30:00Z",
      "isLiked": false
    }
  ]
}
```

#### 2. 创建新帖子 / Create New Post
```
POST /make-server-8ab7634a/posts
Content-Type: application/json

{
  "content": "Amazing trail today! 🚴‍♂️",
  "image": "https://example.com/image.jpg" // optional
}
```

#### 3. 点赞/取消点赞帖子 / Like/Unlike Post
```
POST /make-server-8ab7634a/posts/{postId}/like
```

**响应示例 / Response Example:**
```json
{
  "success": true,
  "isLiked": true,
  "likesCount": 6
}
```

### 评论相关 / Comments

#### 4. 获取帖子的评论 / Get Post Comments
```
GET /make-server-8ab7634a/posts/{postId}/comments
```

#### 5. 添加评论 / Add Comment
```
POST /make-server-8ab7634a/posts/{postId}/comments
Content-Type: application/json

{
  "content": "Nice photo!"
}
```

#### 6. 点赞/取消点赞评论 / Like/Unlike Comment
```
POST /make-server-8ab7634a/comments/{commentId}/like
```

---

## 前端使用 / Frontend Usage

### 使用 Community API 工具 / Using Community API Utilities

```typescript
import * as communityApi from '../utils/communityApi';
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { accessToken } = useAuth();

  // 获取帖子 / Get posts
  const posts = await communityApi.getPosts(accessToken);

  // 创建帖子 / Create post
  const newPost = await communityApi.createPost(
    accessToken,
    "My riding story...",
    "https://image-url.jpg"
  );

  // 点赞帖子 / Like post
  const result = await communityApi.togglePostLike(accessToken, postId);

  // 获取评论 / Get comments
  const comments = await communityApi.getComments(accessToken, postId);

  // 添加评论 / Add comment
  const comment = await communityApi.addComment(
    accessToken,
    postId,
    "Great post!"
  );

  // 点赞评论 / Like comment
  const commentResult = await communityApi.toggleCommentLike(
    accessToken,
    commentId
  );
}
```

---

## 数据持久化特性 / Data Persistence Features

### ✅ 已实现的功能 / Implemented Features

1. **帖子持久化 / Post Persistence**
   - 用户创建的所有帖子都存储在数据库中
   - 每次登录都能看到之前的帖子
   - All user posts are stored in the database
   - Previous posts are visible on each login

2. **评论持久化 / Comment Persistence**
   - 评论与帖子关联存储
   - 支持多级评论显示
   - Comments are stored associated with posts
   - Supports multi-level comment display

3. **点赞记录 / Like Records**
   - 点赞状态持久化
   - 防止重复点赞
   - Like states are persisted
   - Prevents duplicate likes

4. **用户关联 / User Association**
   - 所有内容与用户账号绑定
   - 支持查看自己和他人的内容
   - All content is tied to user accounts
   - Supports viewing own and others' content

### 🔄 自动更新机制 / Auto-Update Mechanisms

1. **点赞计数自动更新 / Auto-Update Like Counts**
   ```sql
   -- 数据库触发器自动维护点赞数
   -- Database triggers automatically maintain like counts
   CREATE TRIGGER update_post_likes_count_trigger
   ```

2. **评论计数自动更新 / Auto-Update Comment Counts**
   ```sql
   -- 添加/删除评论时自动更新帖子的评论数
   -- Automatically updates post comment count when adding/deleting comments
   CREATE TRIGGER update_post_comments_count_trigger
   ```

---

## 数据迁移 / Data Migration

### 从Mock数据迁移 / Migrating from Mock Data

如果你有现有的mock数据想要迁移到数据库：
If you have existing mock data to migrate to the database:

1. **导出现有帖子数据 / Export existing post data**
2. **使用API批量创建 / Bulk create using API**
3. **验证数据完整性 / Verify data integrity**

### 示例迁移脚本 / Example Migration Script

```typescript
async function migrateMockPosts(accessToken: string) {
  for (const mockPost of communityPosts) {
    await communityApi.createPost(
      accessToken,
      mockPost.content,
      mockPost.image
    );
  }
}
```

---

## 性能优化 / Performance Optimization

### 1. 乐观更新 / Optimistic Updates

前端组件使用乐观更新策略，提供即时反馈：
Frontend components use optimistic update strategy for instant feedback:

```typescript
// 立即更新UI / Immediately update UI
setPosts(updatedPosts);

// 后台调用API / Call API in background
const result = await communityApi.togglePostLike(accessToken, postId);

// 如果失败，回滚更新 / Rollback if failed
if (!result) {
  setPosts(previousPosts);
}
```

### 2. 分页加载 / Pagination Loading

未来可以添加分页功能以提高性能：
Pagination can be added in the future for better performance:

```typescript
// 建议的分页实现 / Suggested pagination implementation
const posts = await communityApi.getPosts(accessToken, {
  page: 1,
  limit: 20
});
```

---

## 安全性 / Security

### Row Level Security (RLS) 策略 / RLS Policies

所有表都启用了RLS，确保：
All tables have RLS enabled to ensure:

1. ✅ 用户��能查看公开内容 / Users can only view public content
2. ✅ 用户只能修改自己的内容 / Users can only modify their own content
3. ✅ 所有操作都需要认证 / All operations require authentication

### 数据验证 / Data Validation

- 后端验证所有输入 / Backend validates all inputs
- 防止SQL注入 / Prevents SQL injection
- 限制内容长度 / Limits content length

---

## 故障排除 / Troubleshooting

### 常见问题 / Common Issues

#### 1. "Unauthorized" 错误
- 检查accessToken是否有效 / Check if accessToken is valid
- 确认用户已登录 / Confirm user is logged in
- 验证API请求头 / Verify API request headers

#### 2. 点赞状态不同步
- 刷新用户数据 / Refresh user data
- 清除本地缓存 / Clear local cache
- 检查网络连接 / Check network connection

#### 3. 评论不显示
- 确认帖子ID正确 / Confirm post ID is correct
- 检查数据库连接 / Check database connection
- 查看浏览器控制台错误 / Check browser console for errors

---

## 未来增强 / Future Enhancements

### 计划功能 / Planned Features

1. 🔄 **实时更新 / Real-time Updates**
   - 使用Supabase Realtime订阅
   - 自动刷新新帖子和评论

2. 📸 **图片上传 / Image Upload**
   - 集成Supabase Storage
   - 支持多图片上传

3. 🔔 **通知系统 / Notification System**
   - 点赞通知
   - 评论通知
   - 好友动态通知

4. 🔍 **搜索功能 / Search Functionality**
   - 全文搜索帖子
   - 按用户筛选
   - 按标签分类

5. 📊 **内容分析 / Content Analytics**
   - 帖子浏览量
   - 用户互动统计
   - 热门内容排名

---

## 支持 / Support

如有问题，请查看：
For issues, please check:

- 📖 DATABASE_GUIDE.md - 数据库使用指南
- 🔧 BACKEND_ARCHITECTURE.md - 后端架构文档
- 💬 GitHub Issues - 报告问题和功能请求

---

**最后更新 / Last Updated:** 2024-11-20
**版本 / Version:** 1.0.0
