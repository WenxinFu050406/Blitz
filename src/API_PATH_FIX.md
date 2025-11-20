# API Path Fix - November 20, 2024

## Problem
应用出现 "Error refreshing user: TypeError: Failed to fetch" 错误，这是由于API端点URL配置错误导致的。

## Root Cause
多个文件中的 API_BASE 配置有误，包含了重复的 `/server` 路径部分：

**错误格式：**
```
https://{projectId}.supabase.co/functions/v1/server/server/make-server-8ab7634a
```

**正确格式：**
```
https://{projectId}.supabase.co/functions/v1/server/make-server-8ab7634a
```

## Fixed Files

修复了以下6个文件中的API路径配置：

1. **/context/AuthContext.tsx** (Line 35)
   - 修复了用户认证和刷新功能的API路径
   - 这是导致 "Error refreshing user" 的主要原因

2. **/utils/api.ts** (Line 3)
   - 修复了通用API调用的基础路径

3. **/utils/communityApi.ts** (Line 3)
   - 修复了社区功能（帖子、评论、点赞）的API路径

4. **/components/AuthPage.tsx** (Line 20)
   - 修复了登录和注册页面的API路径

5. **/scripts/seed-test-users-api.ts** (Line 4)
   - 修复了测试用户种子数据脚本的API路径

6. **/setup.html** (Line 266)
   - 修复了设置页面中的API路径

## Impact
这次修复解决了：
- ✅ 用户登录后刷新失败的问题
- ✅ 用户认证token验证失败的问题
- ✅ 社区帖子加载404错误
- ✅ 所有需要API调用的功能

## Testing
修复后，所有API调用应该能够正常工作：
- 用户登录/注册
- 用户资料刷新
- 社区帖子查看/创建
- 评论和点赞功能
- 测试用户创建

## Note
所有API端点现在都使用正确的URL格式：
`https://{projectId}.supabase.co/functions/v1/server/make-server-8ab7634a/{endpoint}`
