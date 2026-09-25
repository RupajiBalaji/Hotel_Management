# 🚀 Deploying HotelMind AI on Render

This project is fully structured and pre-configured for **Render** (supporting both **Render Static Site** — *recommended free tier* — and **Render Web Service**).

---

## 📁 Repository Structure Overview

The repository is structured with fail-safe flexibility so you can deploy either from the repository root or from the `hotelmind-ai` directory:

```text
Hotel management/
├── package.json              <-- Root orchestrator (runs npm build/start across hotelmind-ai)
├── render.yaml               <-- Render Blueprint (zero-config 1-click deployment)
├── .gitignore                <-- Ignores node_modules, build artifacts, .env
├── .env.example              <-- Example environment config
├── DEPLOY_RENDER.md          <-- This guide
│
└── hotelmind-ai/             <-- Vite + React 19 Frontend & Node Server
    ├── package.json          <-- Contains "dev", "build", "start" (node server.js)
    ├── render.yaml           <-- Blueprint if deploying directly from hotelmind-ai
    ├── server.js             <-- Zero-dependency Node HTTP production server (SPA fallback & caching)
    ├── vite.config.ts        <-- Vite configuration
    ├── index.html            <-- HTML entry point
    ├── src/                  <-- React application & AI Agent orchestrator
    └── dist/                 <-- Production bundle output (generated on build)
```

---

## ⚡ Method 1: Render Static Site (Recommended — 100% Free & Fast CDN)

Deploying as a **Static Site** on Render provides instant global CDN hosting, automatic HTTPS, and zero server spin-down delays.

### Step 1: Push Code to GitHub
Open your terminal in `E:\Hotel management` and initialize git:

```bash
git init
git add .
git commit -m "feat: setup hotelmind-ai for render deployment"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### Step 2: Create Static Site on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `hotelmind-ai`
   - **Branch**: `main`
   - **Root Directory**: `hotelmind-ai` *(or leave blank if deploying whole repo)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` *(or `hotelmind-ai/dist` if Root Directory was left blank)*
4. **Important for Single Page Apps (SPA Routing)**:
   - Scroll to **Redirects/Rewrites** and click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
   *(This ensures refreshing on `/dashboard`, `/guest-portal`, `/agents`, etc. never returns 404).*
5. Click **Create Static Site**.

---

## 🌐 Method 2: Render Web Service (Node.js Container)

If you prefer deploying as a Node Web Service using the included high-performance [`server.js`](file:///E:/Hotel%20management/hotelmind-ai/server.js):

1. On [Render Dashboard](https://dashboard.render.com/), click **New +** -> **Web Service**.
2. Connect your repository.
3. Fill in the parameters:
   - **Environment**: `Node`
   - **Root Directory**: `hotelmind-ai`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (or `node server.js`)
   - **Plan**: `Free`
4. Click **Create Web Service**.

`server.js` automatically binds to `0.0.0.0` and listens on Render's dynamic `process.env.PORT`.

---

## 🪄 Method 3: 1-Click Render Blueprint (`render.yaml`)

We have already included [`render.yaml`](file:///E:/Hotel%20management/render.yaml) in the repository:
1. In the Render Dashboard, click **New +** -> **Blueprint**.
2. Connect this repository.
3. Render will read `render.yaml` and configure the build commands, publish paths, and SPA rewrite rules automatically!

---

## 🔑 Environment Variables (Optional)

The application already works out-of-the-box with built-in multi-key rotating pools and offline fallback. If you wish to override them in the Render Environment Variables tab:

| Variable | Description |
| :--- | :--- |
| `NODE_VERSION` | Set to `20.x` |
| `VITE_GEMINI_API_KEYS` | Optional comma-separated Gemini API keys for quota rotation |
| `VITE_GEMINI_MODELS` | Optional comma-separated models (e.g. `gemini-2.0-flash,gemini-1.5-flash`) |
