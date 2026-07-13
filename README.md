<p align="center">
  <img src="public/logo.svg" width="100" height="100" alt="Status Monitor Logo">
</p>

<h1 align="center">站点监测</h1>

<p align="center">优雅的站点状态监控面板</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/hongxing-chinese/Uptime-Status" title="使用 Vercel 部署">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fhongxing-chinese%2FUptime-Status&output-directory=dist&install-command=npm%20install&build-command=npm%20run%20build" target="_blank" rel="noopener noreferrer">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy with EdgeOne Pages">
  </a>
  <a href="https://console.cloud.tencent.com/edgeone/pages?action=create" title="使用腾讯云 EdgeOne Pages 部署">
    <img src="https://img.shields.io/badge/-Deploy-00A4FF?style=for-the-badge&labelColor=00A4FF&color=00A4FF&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNi41IDIwcS0yLjI3NSAwLTMuODg3LTEuNTc1VDEgMTQuNTc1cTAtMS45NSAxLjE3NS0zLjQ3NVQ1LjI1IDkuMTVxLjYyNS0yLjMgMi41LTMuNzI1VDEyIDRxMi45MjUgMCA0Ljk2MyAyLjAzOFQxOSAxMXExLjcyNS4yIDIuODYzIDEuNDg4VDIzIDE1LjVxMCAxLjg3NS0xLjMxMiAzLjE4OFQxOC41IDIweiIvPjwvc3ZnPg==&borderRadius=6" alt="部署到腾讯云 EdgeOne" height="32" />
  </a>
  <a href="https://dash.cloudflare.com/" title="使用 Cloudflare Pages 部署">
    <img src="https://img.shields.io/badge/-Deploy-F38020?style=for-the-badge&labelColor=F38020&color=F38020&logo=cloudflare&logoColor=white&borderRadius=6" alt="部署到 Cloudflare Pages" height="32" />
  </a>
</p>

<p align="center">🎮 在线演示：
  <a href="https://status.1949101.xyz" target="_blank">
    https://status.1949101.xyz
  </a>
</p>

<div align="center">
  简体中文|<a href="./README-en.md">English</a>
</div>

## 📖 简介

站点监测是一个基于 UptimeRobot **v3 API** 开发的站点状态监控面板，支持多站点状态监控、故障统计等功能。界面简洁美观，响应式设计，支持亮暗主题切换。

> **升级提示**：UptimeRobot 已停用旧版 v2 接口（`.../v2/getMonitors`）。若你仍在使用旧版代码，请拉取最新版本并重新部署，否则会出现加载失败或请求超时。

## ✨ 特性

- 📊 实时监控：支持多种监控方式
- 📱 响应式设计：适配移动端和桌面端
- 🌓 主题切换：支持亮色/暗色主题
- 📈 数据统计：可视化展示可用率和响应时间（响应时间点击后加载）
- 🔔 故障记录：详细的宕机记录和原因分析
- 🔄 自动刷新：定时自动更新监控数据（5 分钟缓存）
- 🔃 排序切换：支持自定义域名置顶，以及名称、时间、状态和升降序切换
- 💫 平滑动画：流畅的用户界面交互体验

### UptimeRobot API 变更说明

UptimeRobot 已全面切换到 **v3 REST API**，旧版 v2 接口已不可用。主要变化：

| 项目 | v2（已停用） | v3（当前） |
|------|-------------|-----------|
| 地址 | `https://api.uptimerobot.com/v2/getMonitors` | `https://api.uptimerobot.com/v3` |
| 认证 | POST 表单 + `api_key` | `Authorization: Bearer <key>` |
| 数据 | 单次返回 | 分页 REST（monitors、incidents 等） |

本项目已通过 `/api/status` 服务端代理对接 v3，部署时 **无需** 在前端直连 UptimeRobot。Vercel 使用 Node.js 环境变量，Cloudflare Pages 与 EdgeOne Pages 使用边缘函数环境变量；两类运行时统一读取服务端 `UPTIMEROBOT_API_KEY`。代理错误响应使用 `no-store`，避免 4xx/5xx 被缓存。

## ⚙️ 部署配置

### 环境要求

- Node.js >= 16.16.0
- NPM >= 8.15.0 或 PNPM >= 8.0.0

### 获取 UptimeRobot API Key

1. 注册/登录 [UptimeRobot](https://uptimerobot.com/)
2. 进入 [Integrations & API](https://dashboard.uptimerobot.com/integrations)
3. 下拉到最底部在 Main API keys 部分创建 **Read-Only API Key**
4. 复制生成的 API Key

### API 代理说明

本项目支持以下三种部署方式,均可实现自动处理跨域请求:

1. **腾讯云 EdgeOne Pages**
   - 点击上方蓝色 "Deploy" 按钮
   - 连接到GitHub，选择项目
   - 框架预设选择Vue，点击开始部署
   - 使用默认配置 `VITE_UPTIMEROBOT_API_URL = "/api/status"`
   - 在服务端环境变量中添加 `UPTIMEROBOT_API_KEY`

2. **Vercel**
   - 点击上方黑色 "Deploy" 按钮
   - 连接到GitHub，选择项目
   - 填写项目名称，点击Create
   - 使用默认配置 `VITE_UPTIMEROBOT_API_URL = "/api/status"`
   - 在项目环境变量中添加 `UPTIMEROBOT_API_KEY`

3. **Cloudflare Pages**
   - 点击上方橙色 "Deploy" 按钮
   - 找到计算(worker) 部分
   - 点击创建，选择Pages，连接到GitHub，选择项目，点击开始创建
   - 框架预设选择Vue，点击保持并部署
   - 使用默认配置 `VITE_UPTIMEROBOT_API_URL = "/api/status"`
   - 在 Production 和 Preview 的 Variables and Secrets 中添加 `UPTIMEROBOT_API_KEY`

4. **其他平台**
   - 自行搭建 API 代理，代理目标为 `https://api.uptimerobot.com/v3`
   - 在 `.env` 文件中设置 `VITE_UPTIMEROBOT_API_URL` 为你的 API 代理地址

### 快速开始

1. 克隆项目
```bash
git clone https://github.com/hongxing-chinese/Uptime-Status.git
cd uptime-status
```

2. 安装依赖
```bash
pnpm install
# 或
npm install
```

使用 pnpm 11 时，仓库中的 `pnpm-workspace.yaml` 仅允许 `esbuild` 执行安装脚本。使用 pnpm 部署时应一并提交该文件，否则可能出现 `ERR_PNPM_IGNORED_BUILDS`。

3. 配置环境变量

在 `.env` 文件中修改以下配置：
```bash
# UptimeRobot API URL
# 部署到 Vercel / Cloudflare Pages / EdgeOne 等平台时使用：
VITE_UPTIMEROBOT_API_URL = "/api/status"

# 本地开发直连 v3 时可改为：
# VITE_UPTIMEROBOT_API_URL = "https://api.uptimerobot.com/v3"

# 站点名称
VITE_APP_TITLE = "Status Page By 山人"

# 监控列表默认排序字段：friendly_name / create_datetime / status
VITE_UPTIMEROBOT_STATUS_SORT = "create_datetime"

# 自定义域名顺序（可选，多个地址用逗号分隔）
# 支持完整 URL 或域名；匹配项会按配置顺序置顶
VITE_CUSTOM_DOMAIN_ORDER = "https://www.example.com,status.example.com"
```

在部署平台的服务端环境变量或 Secrets 中添加只读 Key：

```bash
UPTIMEROBOT_API_KEY = "你的 Read-Only API Key"
```

不要在生产环境配置 `VITE_UPTIMEROBOT_API_KEY`：所有 `VITE_` 变量都会进入前端产物。只有本地直连 v3 调试时，才可在被 Git 忽略的 `.env.local` 中临时配置该变量。

首次访问时，`VITE_CUSTOM_DOMAIN_ORDER` 中的监控项按配置顺序置顶，未配置项紧随其后并按 `VITE_UPTIMEROBOT_STATUS_SORT` 排序。点击升降序按钮或选择时间、状态后，自定义域名顺序暂时失效，整个列表使用页面排序；重新选择名称时恢复自定义域名顺序。当前模式和页面排序偏好会保存在浏览器中。

4. 开发调试
```bash
pnpm dev
# 或
npm run dev
```

5. 构建部署
```bash
pnpm build
# 或
npm run build
```
构建的文件在 `dist` 目录下，将 `dist` 目录部署到服务器即可。

## 📝 开源协议

本项目基于 [MIT License](LICENSE) 开源，使用时请遵守开源协议。

## 🙏 致谢

- [UptimeRobot](https://uptimerobot.com/) - 提供监控 API 支持
- [Vue.js](https://vuejs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Chart.js](https://www.chartjs.org/) - 图表库 
