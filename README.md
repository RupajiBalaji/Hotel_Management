# Hotel_Management

> **HotelMind AI** — Autonomous Multi-Agent Hotel Operations & Guest Experience Platform.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

---

## 🌟 Overview

**HotelMind AI** is an intelligent, multi-agent hospitality operating prototype designed to enhance guest experience, streamline front-desk and back-of-house operations, and maximize RevPAR (Revenue per Available Room).

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Google Gemini 2.0 / 1.5 Flash models** with intelligent key and model rotation.

---

## ✨ Key Features

- 🤖 **Multi-Agent Hotel Engine**:
  - **Concierge AI**: Instant guest assistance, room service, dining recommendations, and ticket escalation.
  - **Dynamic Pricing & Revenue Agent**: Real-time ADR, RevPAR, and occupancy yield optimization.
  - **Housekeeping & Turnaround Agent**: Intelligent room cleaning queues and inspection tracking.
  - **Guest Feedback & Sentiment Agent**: Proactive sentiment analysis and VIP recovery alerts.
- 📱 **Guest Self-Service Portal**:
  - Live interactive guest assistant with quick actions (room service, late checkout, housekeeping, valet).
  - Multi-theme support (Dark & Light modes).
- 📊 **Executive Hotel Operations Dashboard**:
  - Real-time occupancy, revenue, and guest satisfaction metrics.
  - Live agent dispatch logs and simulated event triggers.
- 🔄 **Fault-Tolerant AI Engine**:
  - Multi-key rotation pool with auto-fallback to alternative models (`gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
  - Seamless offline rule-based fallback if network or quota is exhausted.

---

## 🏗️ Architecture & Project Structure

```text
Hotel_Management/
├── package.json              # Root build & start scripts
├── render.yaml               # Render Blueprint (Static Site / Web Service)
├── DEPLOY_RENDER.md          # Step-by-step deployment guide
├── README.md                 # Project documentation
│
└── hotelmind-ai/             # Frontend & Production Web Server
    ├── src/                  # React 19 application
    │   ├── components/       # UI modules & agent dashboards
    │   ├── context/          # Hotel & Theme state management
    │   ├── services/         # Multi-agent orchestrator & Gemini API
    │   └── types/            # TypeScript data models
    ├── server.js             # High-performance Node production HTTP server
    └── vite.config.ts        # Vite configuration
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/RupajiBalaji/Hotel_Management.git
cd Hotel_Management

# Install dependencies and start development server
npm run install-deps
npm run dev
```

The application will run locally at `http://localhost:5173`.

---

## 🌐 Deploy to Render

### Option A: Render Static Site (Free & Instant CDN)
1. Fork or push this repository to your GitHub account.
2. In [Render Dashboard](https://dashboard.render.com/), click **New +** ➔ **Static Site**.
3. Select your repository.
4. Settings:
   - **Root Directory**: `hotelmind-ai`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Under **Redirects/Rewrites**, add:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`

### Option B: 1-Click Render Blueprint
In Render Dashboard, select **New +** ➔ **Blueprint** and connect your repository. Render will automatically read `render.yaml` and configure everything for you.

---

## 📄 License
MIT License. Created for hospitality AI innovation.
