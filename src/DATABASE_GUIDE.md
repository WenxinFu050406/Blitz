# Blitz 数据库集成指南 / Database Integration Guide

## 概述 / Overview

Blitz应用现已集成Supabase数据库，支持完整的用户认证和数据持久化功能。每个用户的数据（包括个人信息、骑行统计、打卡记录等）都独立存储在数据库中。

The Blitz app now integrates with Supabase database, supporting complete user authentication and data persistence. Each user's data (including personal information, riding statistics, check-in records, etc.) is stored independently in the database.

## 技术架构 / Technical Architecture

### 后端 / Backend
- **框架**: Hono (Edge Functions)
- **认证**: Supabase Auth
- **存储**: Supabase KV Store
- **路径**: `/supabase/functions/server/index.tsx`

### 前端 / Frontend
- **认证管理**: `/context/AuthContext.tsx`
- **登录/注册页面**: `/components/AuthPage.tsx`
- **API工具**: `/utils/api.ts`

## 数据存储结构 / Data Storage Structure

所有用户数据都存储在Supabase KV Store中，使用以下键值结构：

All user data is stored in Supabase KV Store using the following key-value structure:

```
user:{userId}:profile    - 用户基本信息 / User profile
user:{userId}:stats      - 骑行统计数据 / Riding statistics
user:{userId}:checkins   - 城市打卡记录 / City check-ins
```

### 用户配置文件 / User Profile
```typescript
{
  id: string;          // 用户ID / User ID
  email: string;       // 邮箱 / Email
  phone?: string;      // 手机号 / Phone
  username: string;    // 用户名 / Username
  name: string;        // 显示名称 / Display name
  avatar: string;      // 头像URL / Avatar URL
  location: string;    // 位置 / Location
  bio: string;         // 个人简介 / Bio
  createdAt: string;   // 创建时间 / Creation time
}
```

### 用户统计 / User Statistics
```typescript
{
  totalDistance: number;    // 总里程(km) / Total distance (km)
  totalRides: number;       // 总骑行次数 / Total rides
  totalTime: number;        // 总骑行时间(分钟) / Total time (minutes)
  avgSpeed: number;         // 平均速度(km/h) / Average speed (km/h)
  carbonSaved: number;      // 碳减排量(kg) / Carbon saved (kg)
  friendsCount: number;     // 好友数量 / Friends count
  posts: number;            // 帖子数量 / Posts count
  greenEnergy: number;      // 绿能积分 / Green energy points
}
```

## API端点 / API Endpoints

### 认证 / Authentication

#### 注册 / Sign Up
```typescript
POST /make-server-8ab7634a/signup
Body: {
  email?: string;
  phone?: string;
  password: string;
  username: string;
  avatar: string;
  contactType: 'email' | 'phone';
}
Response: { success: true, user: User }
```

#### 登录 / Sign In
```typescript
POST /make-server-8ab7634a/signin
Body: {
  email?: string;
  phone?: string;
  password: string;
}
Response: { 
  success: true, 
  accessToken: string,
  user: User 
}
```

### 用户数据 / User Data

所有以下端点都需要认证（需要在Authorization头中传递accessToken）：
All following endpoints require authentication (accessToken must be passed in Authorization header):

#### 获取用户信息 / Get User Profile
```typescript
GET /make-server-8ab7634a/user/profile
Headers: { Authorization: "Bearer {accessToken}" }
Response: { success: true, user: User }
```

#### 更新用户信息 / Update User Profile
```typescript
PUT /make-server-8ab7634a/user/profile
Headers: { Authorization: "Bearer {accessToken}" }
Body: { name?: string, bio?: string, avatar?: string, ... }
Response: { success: true, user: User }
```

#### 更新用户统计 / Update User Stats
```typescript
PUT /make-server-8ab7634a/user/stats
Headers: { Authorization: "Bearer {accessToken}" }
Body: { totalDistance?: number, carbonSaved?: number, ... }
Response: { success: true, stats: Stats }
```

#### 获取打卡记录 / Get Check-ins
```typescript
GET /make-server-8ab7634a/user/checkins
Headers: { Authorization: "Bearer {accessToken}" }
Response: { success: true, checkIns: CheckIn[] }
```

#### 添加打卡记录 / Add Check-in
```typescript
POST /make-server-8ab7634a/user/checkins
Headers: { Authorization: "Bearer {accessToken}" }
Body: { landmarkId: string, landmarkName: string, ... }
Response: { success: true, checkIn: CheckIn }
```

## 在组件中使用 / Usage in Components

### 获取认证信息 / Get Authentication Info
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, accessToken, isAuthenticated } = useAuth();
  
  // currentUser 包含所有用户数据
  // accessToken 用于API调用
  // isAuthenticated 指示用户是否登录
}
```

### 使用API工具 / Using API Utilities
```typescript
import { userApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { accessToken, refreshUser } = useAuth();
  
  const handleUpdateStats = async () => {
    try {
      await userApi.updateStats(accessToken!, {
        totalDistance: 100,
        carbonSaved: 25
      });
      
      // 刷新用户数据 / Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };
}
```

### 更新用户信息 / Update User Profile
```typescript
import { useAuth } from '../context/AuthContext';

function EditProfile() {
  const { updateProfile } = useAuth();
  
  const handleSave = async () => {
    try {
      await updateProfile({
        name: 'New Name',
        bio: 'Updated bio'
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
}
```

## 数据隔离 / Data Isolation

每个用户的数据完全独立存储，确保：
- ✅ 用户只能访问自己的数据
- ✅ 所有API调用都需要验证accessToken
- ✅ 每个用户登录时看到的是自己的信息
- ✅ 数据持久化，刷新页面不会丢失

Each user's data is stored completely independently, ensuring:
- ✅ Users can only access their own data
- ✅ All API calls require accessToken validation
- ✅ Each user sees their own information when logged in
- ✅ Data persists, won't be lost on page refresh

## 测试账号 / Test Accounts

您可以创建多个测试账号来验证数据隔离：

You can create multiple test accounts to verify data isolation:

1. 使用不同的邮箱或手机号注册多个账号
2. 在每个账号中添加不同的数据（打卡、统计等）
3. 切换账号登录，验证每个账号看到的是独立的数据

1. Register multiple accounts with different emails or phone numbers
2. Add different data (check-ins, statistics, etc.) in each account
3. Switch between accounts to verify each sees independent data

## 注意事项 / Notes

⚠️ **重要提醒 / Important Reminder**:
- Figma Make主要用于原型开发 / Figma Make is primarily for prototype development
- 不适合处理高度敏感的个人信息 / Not suitable for highly sensitive personal information
- 生产环境需要额外的安全措施 / Production environments require additional security measures

## 下一步扩展 / Future Extensions

可以轻松添加更多功能：
- 好友系统（存储为 `user:{userId}:friends`）
- 骑行历史记录（存储为 `user:{userId}:rides`）
- 成就系统（存储为 `user:{userId}:achievements`）
- 社区帖子（存储为 `user:{userId}:posts`）

More features can be easily added:
- Friend system (store as `user:{userId}:friends`)
- Ride history (store as `user:{userId}:rides`)
- Achievement system (store as `user:{userId}:achievements`)
- Community posts (store as `user:{userId}:posts`)
