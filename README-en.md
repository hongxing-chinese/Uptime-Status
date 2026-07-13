<p align="center">
  <img src="public/logo.svg" width="100" height="100" alt="Status Monitor Logo">
</p>

<h1 align="center">Website Monitor</h1>

<p align="center">An Elegant Website Status Monitoring Dashboard</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/hongxing-chinese/Uptime-Status" title="Deploy with Vercel">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fhongxing-chinese%2FUptime-Status&output-directory=dist&install-command=npm%20install&build-command=npm%20run%20build" target="_blank" rel="noopener noreferrer">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy with EdgeOne Pages">
  </a>
  <a href="https://console.cloud.tencent.com/edgeone/pages?action=create" title="Deploy to Tencent Cloud EdgeOne Pages">
    <img src="https://img.shields.io/badge/-Deploy-00A4FF?style=for-the-badge&labelColor=00A4FF&color=00A4FF&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNi41IDIwcS0yLjI3NSAwLTMuODg3LTEuNTc1VDEgMTQuNTc1cTAtMS45NSAxLjE3NS0zLjQ3NVQ1LjI1IDkuMTVxLjYyNS0yLjMgMi41LTMuNzI1VDEyIDRxMi45MjUgMCA0Ljk2MyAyLjAzOFQxOSAxMXExLjcyNS4yIDIuODYzIDEuNDg4VDIzIDE1LjVxMCAxLjg3NS0xLjMxMiAzLjE4OFQxOC41IDIweiIvPjwvc3ZnPg==&borderRadius=6" alt="Deploy to Tencent Cloud EdgeOne" height="32" />
  </a>
  <a href="https://dash.cloudflare.com/" title="Deploy to Cloudflare Pages">
    <img src="https://img.shields.io/badge/-Deploy-F38020?style=for-the-badge&labelColor=F38020&color=F38020&logo=cloudflare&logoColor=white&borderRadius=6" alt="Deploy to Cloudflare Pages" height="32" />
  </a>
</p>

<p align="center">🎮 Live Demo:
  <a href="https://status.1949101.xyz" target="_blank">
    https://status.1949101.xyz
  </a>
</p>

<div align="center">
  <a href="./README.md">简体中文</a>|English
</div>

## 📖 Introduction

Website Monitor is a website status monitoring dashboard developed based on the UptimeRobot **v3 API**, supporting multi-website status monitoring, outage statistics and other functions. It features a clean and beautiful interface, responsive design, and supports light/dark theme switching.

> **Upgrade notice**: UptimeRobot has deprecated the legacy v2 endpoint (`.../v2/getMonitors`). If you are still on an older version, please pull the latest code and redeploy, otherwise data loading may fail or time out.

## ✨ Features

- 📊 Real-time Monitoring: Supports multiple monitoring methods
- 📱 Responsive Design: Adapts to mobile and desktop devices
- 🌓 Theme Switching: Supports light/dark mode
- 📈 Data Statistics: Visual display of uptime and response time (loaded on click)
- 🔔 Outage Records: Detailed downtime records and cause analysis
- 🔄 Auto-refresh: Automatically updates monitoring data (5-minute cache)
- 🔃 Sorting: Pin configured domains and switch between name, time, status, ascending, and descending order
- 💫 Smooth Animations: Fluid UI interaction experience

### UptimeRobot API Changes

UptimeRobot has fully migrated to the **v3 REST API**. The legacy v2 endpoint is no longer available:

| Item | v2 (deprecated) | v3 (current) |
|------|-----------------|--------------|
| URL | `https://api.uptimerobot.com/v2/getMonitors` | `https://api.uptimerobot.com/v3` |
| Auth | POST form + `api_key` | `Authorization: Bearer <key>` |
| Data | Single response | Paginated REST (monitors, incidents, etc.) |

This project connects to v3 through the `/api/status` server-side proxy. You do **not** need to call UptimeRobot directly from the frontend when deployed. Vercel reads Node.js environment variables, while Cloudflare Pages and EdgeOne Pages read edge-function bindings; both use the server-only `UPTIMEROBOT_API_KEY`. Proxy error responses use `no-store` so 4xx/5xx responses are not cached.

## ⚙️ Deployment & Configuration

### Requirements

- Node.js >= 16.16.0
- NPM >= 8.15.0 or PNPM >= 8.0.0

### Get UptimeRobot API Key

1. Register/Log in to [UptimeRobot](https://uptimerobot.com/)
2. Go to [Integrations & API](https://dashboard.uptimerobot.com/integrations)
3. Scroll to the bottom and create a **Read-Only API Key** in the Main API keys section
4. Copy the generated API Key

### API Proxy Instructions

This project supports the following three deployment methods, all of which can automatically handle cross-origin requests:

1. **Tencent Cloud EdgeOne Pages**
   - Click the blue "Deploy" button above
   - Connect to GitHub and select the project
   - Select Vue as the framework preset and click Deploy
   - Use the default configuration `VITE_UPTIMEROBOT_API_URL = "/api/status"`
   - Add `UPTIMEROBOT_API_KEY` as a server-side environment variable or Secret

2. **Vercel**
   - Click the black "Deploy" button above
   - Connect to GitHub and select the project
   - Enter the project name and click Create
   - Use the default configuration `VITE_UPTIMEROBOT_API_URL = "/api/status"`
   - Add `UPTIMEROBOT_API_KEY` to the project environment variables

3. **Cloudflare Pages**
   - Click the orange "Deploy" button above
   - Navigate to the Workers & Pages section
   - Click Create, select Pages, connect to GitHub, select the project, and click Begin setup
   - Select Vue as the framework preset and click Save & Deploy
   - Use the default configuration `VITE_UPTIMEROBOT_API_URL = "/api/status"`
   - Add `UPTIMEROBOT_API_KEY` under Variables and Secrets for both Production and Preview

4. **Other Platforms**
   - Build your own API proxy targeting `https://api.uptimerobot.com/v3`
   - Set `VITE_UPTIMEROBOT_API_URL` to your proxy address in the `.env` file

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/hongxing-chinese/Uptime-Status.git
cd uptime-status
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

With pnpm 11, the committed `pnpm-workspace.yaml` allows only `esbuild` to run its install script. Commit this file when deploying with pnpm, otherwise installation may fail with `ERR_PNPM_IGNORED_BUILDS`.

3. Configure environment variables

Modify the following settings in the `.env` file:
```bash
# UptimeRobot API URL
# When deploying to Vercel / Cloudflare Pages / EdgeOne:
VITE_UPTIMEROBOT_API_URL = "/api/status"

# For local development with direct v3 access:
# VITE_UPTIMEROBOT_API_URL = "https://api.uptimerobot.com/v3"

# Website Title
VITE_APP_TITLE = "Status Page By 山人"

# Default monitor sort: friendly_name / create_datetime / status
VITE_UPTIMEROBOT_STATUS_SORT = "create_datetime"

# Optional custom domain order (comma-separated)
# Full URLs and domain names are supported; matches are pinned in this order
VITE_CUSTOM_DOMAIN_ORDER = "https://www.example.com,api.example.com"
```

Add the read-only Key to the deployment platform's server-side environment variables or Secrets:

```bash
UPTIMEROBOT_API_KEY = "your Read-Only API Key"
```

Do not configure `VITE_UPTIMEROBOT_API_KEY` in production: every `VITE_` variable is bundled into the frontend. Only use it temporarily in the Git-ignored `.env.local` when debugging a direct local v3 connection.

On the first visit, monitors in `VITE_CUSTOM_DOMAIN_ORDER` are pinned in the configured order. Unlisted monitors follow them and use `VITE_UPTIMEROBOT_STATUS_SORT`. Clicking the direction button or selecting time/status temporarily disables custom-domain ordering and sorts the entire list using the UI selection. Selecting name again restores custom-domain ordering. The active mode and UI preference are saved in the browser.

4. Development & Debugging
```bash
pnpm dev
# or
npm run dev
```

5. Build & Deploy
```bash
pnpm build
# or
npm run build
```
The built files are in the `dist` directory. Deploy the `dist` directory to your server.

## 📝 License

This project is open-source under the [MIT License](LICENSE). Please comply with the license when using it.

## 🙏 Acknowledgments

- [UptimeRobot](https://uptimerobot.com/) - Provides monitoring API support
- [Vue.js](https://vuejs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Charting library