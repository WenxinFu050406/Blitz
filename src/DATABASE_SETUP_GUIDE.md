# Blitz App - 数据库设置完整指南

## 概述
本指南将帮助您完成 Blitz App 的 Supabase 数据库设置，包括创建表结构和插入三个测试用户的完整数据。

## 三个测试用户账户信息

### 📋 快速参考

| 用户 | 邮箱 | 密码 | 语言 | 车型 | 排名 |
|------|------|------|------|------|------|
| Mike Johnson | mike.johnson@blitz.com | MikeBlitz2024! | English | BESV JF1 | #1 (Platinum) |
| Sarah Chen | sarah.chen@blitz.com | SarahGreen2024! | English | BESV TRS1 AM | #2 (Gold) |
| 李明 | li.ming@blitz.com | LiMing2024! | 中文 | BESV PSA1 | #4 (Silver) |

---

## 步骤 1: 创建数据库表结构

### 1.1 登录 Supabase Dashboard
1. 访问 https://supabase.com/dashboard
2. 选择项目: `utvozryyrirwllumubqn`

### 1.2 运行表结构脚本
1. 在左侧菜单选择 **SQL Editor**
2. 点击 **New Query**
3. 复制 `/scripts/create_database_schema.sql` 的全部内容
4. 粘贴到 SQL 编辑器
5. 点击 **Run** 执行

### 1.3 验证表创建
运行以下查询验证所有表都已创建：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

应该看到以下表：
- ✅ profiles
- ✅ devices
- ✅ statistics
- ✅ ride_history
- ✅ achievements
- ✅ check_ins
- ✅ rankings
- ✅ posts
- ✅ friendships
- ✅ notifications

---

## 步骤 2: 创建测试用户账户

### 2.1 打开 Authentication 页面
1. 在左侧菜单选择 **Authentication**
2. 点击 **Users** 标签

### 2.2 创建用户 1: Mike Johnson
1. 点击 **Add user** → **Create new user**
2. 填写信息：
   - **Email**: mike.johnson@blitz.com
   - **Password**: MikeBlitz2024!
   - **Auto Confirm User**: ✅ 勾选
3. 点击 **Create user**
4. **重要**: 复制新创建用户的 UUID (在用户列表中点击用户查看)

### 2.3 创建用户 2: Sarah Chen
1. 重复上述步骤，使用：
   - **Email**: sarah.chen@blitz.com
   - **Password**: SarahGreen2024!
   - **Auto Confirm User**: ✅ 勾选
2. 复制此用户的 UUID

### 2.4 创建用户 3: 李明
1. 重复上述步骤，使用：
   - **Email**: li.ming@blitz.com
   - **Password**: LiMing2024!
   - **Auto Confirm User**: ✅ 勾选
2. 复制此用户的 UUID

---

## 步骤 3: 插入用户数据

### 3.1 准备 SQL 脚本
1. 打开 `/scripts/insert_test_users.sql`
2. 将以下占位符替换为实际的 UUID：
   - `USER_ID_1` → Mike Johnson 的 UUID
   - `USER_ID_2` → Sarah Chen 的 UUID
   - `USER_ID_3` → 李明的 UUID

### 3.2 运行插入脚本
1. 返回 **SQL Editor**
2. 创建新查询
3. 粘贴修改后的 `insert_test_users.sql` 内容
4. 点击 **Run** 执行

### 3.3 验证数据插入
运行以下查询验证数据：

```sql
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
```

应该看到三行数据，包含所有用户信息。

---

## 步骤 4: 测试登录

### 4.1 启动应用
```bash
npm run dev
```

### 4.2 测试每个用户
使用以下凭证依次登录测试：

#### 测试 1: Mike Johnson (高活跃度用户)
- 邮箱: mike.johnson@blitz.com
- 密码: MikeBlitz2024!
- 预期看到:
  - ✅ 主页显示 BESV JF1，电量 82%
  - ✅ 总里程 2,156.8 km
  - ✅ 碳减排排名 #1 (Platinum)
  - ✅ 8个成就徽章
  - ✅ 4个已打卡地标
  - ✅ 5条骑行历史记录

#### 测试 2: Sarah Chen (中等活跃度用户)
- 邮箱: sarah.chen@blitz.com
- 密码: SarahGreen2024!
- 预期看到:
  - ✅ 主页显示 BESV TRS1 AM，电量 65%
  - ✅ 总里程 1,434.2 km
  - ✅ 碳减排排名 #2 (Gold)
  - ✅ 6个成就徽章
  - ✅ 3个已打卡地标
  - ✅ 5条骑行历史记录

#### 测试 3: 李明 (通勤用户)
- 邮箱: li.ming@blitz.com
- 密码: LiMing2024!
- 预期看到:
  - ✅ 主页显示 BESV PSA1，电量 58%
  - ✅ 总里程 876.3 km
  - ✅ 碳减排排名 #4 (Silver)
  - ✅ 4个成就徽章
  - ✅ 2个已打卡地标
  - ✅ 5条骑行历史记录
  - ✅ 界面显示为中文

---

## 故障排查

### 问题 1: 表创建失败
**错误**: "relation already exists"
**解决方案**: 
```sql
-- 删除现有表（谨慎操作！）
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS check_ins CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS ride_history CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 然后重新运行 create_database_schema.sql
```

### 问题 2: 无法创建用户
**错误**: "User already exists"
**解决方案**: 
1. 在 Authentication → Users 中查找现有用户
2. 删除重复的用户
3. 重新创建

### 问题 3: 数据插入失败
**错误**: "foreign key violation"
**解决方案**: 
1. 确认用户已在 Authentication 中创建
2. 确认 UUID 正确复制替换
3. 检查 `auth.users` 表中是否存在对应用户

### 问题 4: 登录后看不到数据
**解决方案**:
1. 检查 Row Level Security (RLS) 策略是否正确
2. 验证数据是否正确插入：
```sql
SELECT * FROM profiles WHERE username = 'Mike Johnson';
SELECT * FROM statistics WHERE user_id = 'YOUR_USER_ID';
```

---

## 高级选项

### 使用 Supabase CLI（推荐）

#### 安装 CLI
```bash
npm install -g supabase
```

#### 登录并链接项目
```bash
supabase login
supabase link --project-ref utvozryyrirwllumubqn
```

#### 运行迁移脚本
```bash
# 创建表结构
supabase db execute -f scripts/create_database_schema.sql

# 插入数据（先替换 USER_ID_1/2/3）
supabase db execute -f scripts/insert_test_users.sql
```

### 使用 TypeScript 脚本

#### 设置
1. 获取 Service Role Key:
   - Dashboard → Settings → API
   - 复制 `service_role` key
2. 在 `/scripts/insertTestUsers.ts` 中替换密钥

#### 运行
```bash
npx tsx scripts/insertTestUsers.ts
```

---

## 数据模型说明

### 用户 1: Mike Johnson
- **角色**: 经验丰富的骑行者
- **特点**: 高里程、多成就、社交活跃
- **用途**: 测试高级功能、排行榜第一名

### 用户 2: Sarah Chen
- **角色**: 环保倡导者
- **特点**: 中等活跃度、周末骑行
- **用途**: 测试中级用户体验

### 用户 3: 李明
- **角色**: 通勤用户
- **特点**: 稳定短途骑行、中文界面
- **用途**: 测试中文本地化、通勤场景

---

## 下一步

数据库设置完成后，您可以：

1. ✅ 测试用户认证流程
2. ✅ 验证数据在各页面正确显示
3. ✅ 测试语言切换功能
4. ✅ 测试排行榜和成就系统
5. ✅ 测试骑行历史和统计图表
6. ✅ 开发新功能和交互

---

## 联系支持

如有问题，请查看：
- `/DATABASE_GUIDE.md` - 数据库架构详细说明
- `/BACKEND_ARCHITECTURE.md` - 后端架构文档
- `/TEST_USERS_CREDENTIALS.md` - 用户凭证详细信息
