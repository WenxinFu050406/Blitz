# 🎉 Blitz App - 三个测试用户账号信息

## ✅ 已完成

您现在拥有三个完整配置的测试用户，每个用户都有：
- ✅ 账户凭证（邮箱和密码）
- ✅ 完整的个人资料
- ✅ 设备信息（车型和电量）
- ✅ 统计数据（里程、骑行次数、碳减排等）
- ✅ 骑行历史记录
- ✅ 成就徽章
- ✅ 地标打卡记录
- ✅ 排名信息

---

## 🔐 三个用户账号信息

### 👤 用户 1: Mike Johnson (英语 - 高级骑手)

```
📧 邮箱: mike.johnson@blitz.com
🔑 密码: MikeBlitz2024!
🌍 语言: English
```

**个人信息**
- 用户名: Mike Johnson
- 位置: San Francisco, CA
- 简介: Trail finder and coffee lover ☕🚴‍♂️
- 头像: 👨

**设备信息**
- 车型: BESV JF1
- 电量: 82%

**统计数据**
- 总里程: 2,156.8 km
- 今日骑行: 15.7 km
- 总骑行次数: 243 次
- 总时间: 156.3 小时
- 平均速度: 13.8 km/h
- 碳减排: 252.4 kg
- 能量积分: 5,820 点
- 卡路里: 42,350
- 爬升: 15,680 米

**排名 & 成就**
- 🏆 排名: #1 (Platinum)
- 🎖️ 成就: 8个
- 📍 打卡地标: 4个
- 👥 好友: 52人
- 📝 帖子: 31篇

---

### 👤 用户 2: Sarah Chen (英语 - 环保骑手)

```
📧 邮箱: sarah.chen@blitz.com
🔑 密码: SarahGreen2024!
🌍 语言: English
```

**个人信息**
- 用户名: Sarah Chen
- 位置: Oakland, CA
- 简介: Weekend warrior on two wheels | Green commuter 🌱
- 头像: 👩

**设备信息**
- 车型: BESV TRS1 AM
- 电量: 65%

**统计数据**
- 总里程: 1,434.2 km
- 今日骑行: 8.4 km
- 总骑行次数: 178 次
- 总时间: 98.7 小时
- 平均速度: 14.5 km/h
- 碳减排: 167.9 kg
- 能量积分: 3,860 点
- 卡路里: 28,120
- 爬升: 9,340 米

**排名 & 成就**
- 🥇 排名: #2 (Gold)
- 🎖️ 成就: 6个
- 📍 打卡地标: 3个
- 👥 好友: 38人
- 📝 帖子: 24篇

---

### 👤 用户 3: 李明 (中文 - 通勤骑手)

```
📧 邮箱: li.ming@blitz.com
🔑 密码: LiMing2024!
🌍 语言: 简体中文
```

**个人信息**
- 用户名: 李明
- 位置: 上海市
- 简介: 上班通勤 | BESV 爱好者 🚴
- 头像: 🧑

**设备信息**
- 车型: BESV PSA1
- 电量: 58%

**统计数据**
- 总里程: 876.3 km
- 今日骑行: 5.2 km
- 总骑行次数: 132 次
- 总时间: 67.4 小时
- 平均速度: 13.0 km/h
- 碳减排: 102.6 kg
- 能量积分: 2,340 点
- 卡路里: 17,180
- 爬升: 5,620 米

**排名 & 成就**
- 🥈 排名: #4 (Silver)
- 🎖️ 成就: 4个
- 📍 打卡地标: 2个
- 👥 好友: 25人
- 📝 帖子: 15篇

---

## 🚀 如何使用

### 方法 1: 快速登录按钮（推荐）

1. 启动应用
2. 在登录页面，点击右下角的 **"Test Users"** 按钮
3. 浮窗会显示所有三个用户的信息
4. 点击任意用户的 **"Quick Login"** 按钮即可自动登录

### 方法 2: 手动输入

1. 在登录页面选择"邮箱"登录
2. 复制上面任一用户的邮箱和密码
3. 粘贴到登录表单
4. 点击"登录"按钮

### 方法 3: 复制粘贴

```bash
# 英语用户1 (高级骑手)
mike.johnson@blitz.com
MikeBlitz2024!

# 英语用户2 (环保骑手)
sarah.chen@blitz.com
SarahGreen2024!

# 中文用户 (通勤骑手)
li.ming@blitz.com
LiMing2024!
```

---

## 📊 用户对比表

| 特征 | Mike Johnson | Sarah Chen | 李明 |
|------|--------------|------------|------|
| **语言** | English | English | 中文 |
| **用户类型** | 高级骑手 | 周末骑手 | 通勤族 |
| **总里程** | 2,156.8 km 🔥 | 1,434.2 km | 876.3 km |
| **排名** | #1 👑 | #2 🥇 | #4 |
| **徽章** | Platinum ⭐⭐⭐⭐ | Gold ⭐⭐⭐ | Silver ⭐⭐ |
| **活跃度** | 非常高 | 中等 | 低-中等 |
| **成就数** | 8个 | 6个 | 4个 |
| **好友数** | 52人 | 38人 | 25人 |
| **电量** | 82% ⚡ | 65% | 58% |

---

## 💾 数据库设置

如需将这些用户数据插入到Supabase数据库，请按以下步骤操作：

### 📝 步骤 1: 创建数据库表

1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 运行 `/scripts/create_database_schema.sql`

### 👥 步骤 2: 创建用户账户

1. 进入 Authentication → Users
2. 为每个用户点击 "Add user" → "Create new user"
3. 输入邮箱和密码（见上方列表）
4. ✅ 勾选 "Auto Confirm User"
5. 记录每个用户的 UUID

### 📊 步骤 3: 插入用户数据

1. 打开 `/scripts/insert_test_users.sql`
2. 将 `USER_ID_1`, `USER_ID_2`, `USER_ID_3` 替换为实际 UUID
3. 在 SQL Editor 中运行修改后的脚本

### ✅ 步骤 4: 验证

运行以下 SQL 验证数据：

```sql
SELECT 
  p.username,
  p.language,
  d.bike_model,
  s.total_distance,
  r.carbon_rank
FROM profiles p
LEFT JOIN devices d ON p.id = d.user_id
LEFT JOIN statistics s ON p.id = s.user_id
LEFT JOIN rankings r ON p.id = r.user_id
ORDER BY r.carbon_rank;
```

---

## 📚 相关文档

- 📖 `/DATABASE_SETUP_GUIDE.md` - 完整数据库设置指南
- 💾 `/scripts/create_database_schema.sql` - 数据库表结构
- 📊 `/scripts/insert_test_users.sql` - 用户数据插入脚本
- 🔧 `/scripts/insertTestUsers.ts` - TypeScript 自动化脚本
- 📋 `/用户账号信息.md` - 详细用户信息表
- 📝 `/data/seedUsers.ts` - 用户数据源文件

---

## 🎯 测试建议

### 测试 Mike Johnson（英语 - 高活跃度）
- ✅ 最高排名显示
- ✅ 大量统计数据和图表
- ✅ 多个成就徽章
- ✅ 完整的骑行历史
- ✅ 社交功能（好友、帖子）

### 测试 Sarah Chen（英语 - 中等活跃度）
- ✅ 金牌徽章显示
- ✅ 中等数据量
- ✅ 周末骑行模式
- ✅ 环保主题功能

### 测试 李明（中文 - 通勤用户）
- ✅ 完整中文界面
- ✅ 通勤场景数据
- ✅ 中文排行榜
- ✅ 语言切换功能

---

## ⚠️ 重要提示

1. **仅用于测试**: 这些账号密码仅用于开发和测试环境
2. **不要用于生产**: 请勿在生产环境使用这些凭证
3. **密码安全**: 生产环境应使用强密码和适当的安全措施
4. **数据隔离**: 每个用户的数据完全独立，互不影响

---

## 🎉 开始使用

1. 运行应用: `npm run dev`
2. 打开浏览器访问应用
3. 点击 "Test Users" 按钮
4. 选择任一用户快速登录
5. 享受测试！

---

**最后更新**: 2024-11-19
**版本**: 1.0
**状态**: ✅ 就绪
