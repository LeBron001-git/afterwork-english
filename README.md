# Afterwork English

面向上班族和英语基础薄弱人群的 Web 端英语学习 MVP。

## 当前能力

- Dashboard 学习首页
- 单词、音标、语法、短句、练习、场景、复习、进度、设置、Style Lab
- 5 套主题和明暗模式
- 学习打卡、XP、等级成长
- Command + K 查词
- 单词收藏、分类筛选、收藏视图
- 练习判题和错题记录
- 间隔重复复习队列
- 三套本地学习者档案
- PWA 基础 manifest

## 本地运行

```bash
pnpm install
pnpm dev
```

局域网访问：

```bash
pnpm dev:host
```

## 线上部署

Vercel 推荐流程：

```bash
pnpm install
pnpm build
pnpm deploy
```

首次部署会要求登录 Vercel 账号，并选择项目归属。部署成功后，把 Vercel 生成的网址发给朋友即可。

预览部署：

```bash
pnpm deploy:preview
```

## 当前数据策略

当前 MVP 使用浏览器 localStorage 保存学习数据。朋友在不同设备访问线上网站时，每个人的数据会保存在自己的浏览器里，不会互相同步。

商业化前建议升级为：

- 账号系统
- 云端数据库
- 用户学习数据同步
- 付费与订阅
- 内容管理后台
- 域名与隐私政策
- 数据备份与导出

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- lucide-react
- date-fns
- Vercel
