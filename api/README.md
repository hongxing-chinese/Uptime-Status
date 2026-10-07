# API 目录说明

本目录 (`api/`) 包含 Vercel Serverless Functions 的 API 代理实现，对接 UptimeRobot **v3 API**。

## 文件说明

### status.js

运行在 Vercel 平台上的 Serverless Function，主要功能：

- 转发请求到 `https://api.uptimerobot.com/v3`
- 处理 CORS（跨域）请求
- 服务端缓存（5 分钟）与 429 限流响应

## 接口说明

| 路由 | 说明 |
|------|------|
| `GET /api/status` | 获取监控列表及近 30 天事件 |
| `GET /api/status?refresh=1` | 强制刷新，跳过服务端缓存 |
| `GET /api/status?monitorId=xxx` | 获取指定监控的响应时间统计 |

后端实际调用的 UptimeRobot v3 端点：

- `GET /monitors?limit=200`
- `GET /incidents?started_after=...`
- `GET /monitors/{id}/stats/response-time?includeTimeSeries=true`

## 请求处理

1. **OPTIONS**：返回 CORS 头部
2. **GET / POST**：转发到 UptimeRobot v3（Bearer Token 认证）
3. **429**：返回 `{ error, retryAfter }`
4. **其他错误**：返回统一错误响应

## 环境变量

在 Vercel 项目环境变量中配置服务端只读 Key：

```bash
UPTIMEROBOT_API_KEY = "你的 Read-Only API Key"
```

前端构建配置使用 `VITE_UPTIMEROBOT_API_URL = "/api/status"`。不要在生产环境设置 `VITE_UPTIMEROBOT_API_KEY`，因为 `VITE_` 变量会进入前端构建产物。

## 部署说明

- 专用于 **Vercel** 平台部署
- 路由 `/api/status` 由 Vercel 自动映射到 `api/status.js`
- 无需额外路由配置

> 旧版 v2 接口（`.../v2/getMonitors`）已停用，请勿再使用。
