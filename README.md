# 个人账单管理系统

一个用于学习完整全栈开发流程的个人账单管理项目。

## 功能

- 邮箱和密码登录
- 登录会话与退出登录
- 未登录用户访问限制
- 新增、查询、编辑和删除账单
- 按账单标题筛选
- 表单验证与错误处理
- MySQL 数据持久化

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- MySQL
- Auth.js
- bcryptjs
- Zod

## 数据流

```text
浏览器
→ Next.js 页面和 API
→ Zod 数据验证
→ 参数化 SQL
→ MySQL
→ JSON 响应
→ React 更新页面

```

## 本地运行

安装依赖：

```bash
npm install
```

根据 `.env.example` 创建 `.env.local`，并填写本地数据库配置和 `AUTH_SECRET`。

启动开发服务器：

```bash
npm run dev
```

访问：

```text
http://localhost:3000
```

## 环境变量

项目需要以下环境变量：

```env
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
AUTH_SECRET=
```

不要把 `.env.local`、数据库密码或认证密钥提交到 GitHub。

## 安全措施

- 密码使用 bcrypt 哈希保存
- API 使用参数化 SQL
- 输入数据使用 Zod 验证
- 账单页面和 API 需要登录
- 敏感配置保存在环境变量中

## 当前限制

- 测试用户需要预先写入数据库
- 暂未提供公开注册功能
- 当前使用本地 MySQL
- 尚未完成云端部署