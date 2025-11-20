# Blitz App - 测试用户快速指南

## 🚀 立即开始

### 三个测试账号

| 用户 | 邮箱 | 密码 | 排名 |
|------|------|------|------|
| Mike Johnson 🇺🇸 | mike.johnson@blitz.com | MikeBlitz2024! | #1 Platinum |
| Sarah Chen 🇺🇸 | sarah.chen@blitz.com | SarahGreen2024! | #2 Gold |
| 李明 🇨🇳 | li.ming@blitz.com | LiMing2024! | #4 Silver |

### 快速登录

1. 启动应用: `npm run dev`
2. 点击右下角 **"Test Users"** 按钮
3. 选择用户并点击 **"Quick Login"**

---

## 📁 文档结构

### 用户凭证文档
- **`/FINAL_USER_CREDENTIALS.md`** ⭐ - 完整用户信息（推荐阅读）
- **`/用户账号信息.md`** - 详细用户数据对比
- **`/TEST_USERS_CREDENTIALS.md`** - 用户凭证详细信息

### 数据库设置文档
- **`/DATABASE_SETUP_GUIDE.md`** ⭐ - 完整数据库设置指南
- **`/DATABASE_GUIDE.md`** - 数据库架构说明
- **`/BACKEND_ARCHITECTURE.md`** - 后端架构文档

### 脚本文件
- **`/scripts/create_database_schema.sql`** - 创建数据库表结构
- **`/scripts/insert_test_users.sql`** - 插入用户数据（需先替换UUID）
- **`/scripts/insertTestUsers.ts`** - TypeScript自动化脚本

### 数据源文件
- **`/data/seedUsers.ts`** - 用户数据定义
- **`/components/TestUserInfo.tsx`** - 测试用户信息组件

---

## 📊 用户数据概览

### Mike Johnson (高级骑手)
- 🚴 总里程: 2,156.8 km
- 🏆 排名: #1 (Platinum)
- 🎖️ 成就: 8个
- 🌍 语言: English
- 🚲 车型: BESV JF1

### Sarah Chen (周末骑手)
- 🚴 总里程: 1,434.2 km
- 🏆 排名: #2 (Gold)
- 🎖️ 成就: 6个
- 🌍 语言: English
- 🚲 车型: BESV TRS1 AM

### 李明 (通勤骑手)
- 🚴 总里程: 876.3 km
- 🏆 排名: #4 (Silver)
- 🎖️ 成就: 4个
- 🌍 语言: 中文
- 🚲 车型: BESV PSA1

---

## 🔧 数据库设置（可选）

如果需要将用户数据持久化到Supabase：

1. **创建表结构**
   ```bash
   # 在 Supabase SQL Editor 中运行
   /scripts/create_database_schema.sql
   ```

2. **创建认证用户**
   - 在 Supabase Dashboard > Authentication > Users
   - 为每个用户创建账号
   - 记录 UUID

3. **插入用户数据**
   ```bash
   # 替换 SQL 中的 USER_ID_1/2/3 为实际 UUID
   # 然后在 SQL Editor 中运行
   /scripts/insert_test_users.sql
   ```

详细步骤请参考: `/DATABASE_SETUP_GUIDE.md`

---

## ✨ 功能特性

每个测试用户都包含：

- ✅ 完整的个人资料
- ✅ 设备信息（车型、电量）
- ✅ 骑行统计数据
- ✅ 5条骑行历史记录
- ✅ 多个成就徽章
- ✅ 地标打卡记录
- ✅ 排名和徽章
- ✅ 好友和帖子数量

---

## 🎯 测试场景

### 测试英语界面
使用 Mike Johnson 或 Sarah Chen 账号

### 测试中文界面
使用 李明 账号

### 测试语言切换
登录后在设置中切换语言

### 测试不同活跃度
- 高活跃度: Mike Johnson
- 中活跃度: Sarah Chen
- 低活跃度: 李明

---

## 📞 需要帮助？

查看以下文档：
- 🔐 账号信息: `/FINAL_USER_CREDENTIALS.md`
- 💾 数据库设置: `/DATABASE_SETUP_GUIDE.md`
- 🏗️ 后端架构: `/BACKEND_ARCHITECTURE.md`

---

**祝测试顺利！** 🎉
