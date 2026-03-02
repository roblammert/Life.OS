# INSTALL_GUIDE.md  
*A complete installation, maintenance, and upgrade guide for Life.OS.*

Life.OS is a modular, offline‑first PWA with a Node.js/TypeScript backend, MySQL database, and a React/TypeScript frontend powered by IndexedDB and WebLLM. This guide walks through installation, configuration, development setup, and long‑term maintenance.

---

# 1. Prerequisites

Before installing Life.OS, ensure the following tools are installed and available on your system:

## Required Software
- **Node.js (LTS recommended)**  
  Verify with: `node -v`
- **npm or pnpm**  
  Verify with: `npm -v`
- **MySQL Server (8.x recommended)**  
  Verify with: `mysql --version`
- **Git**
- **VS Code** with:
  - GitHub Copilot Pro
  - ESLint extension
  - Prettier extension
  - Prisma extension
  - React/TypeScript extensions

## Optional (Recommended)
- **Docker Desktop** (for containerized MySQL)
- **nvm** (Node version manager)
- **mkcert** (for local HTTPS development)

---

# 2. Repository Structure Overview

Life.OS uses a two‑directory architecture:
life-os/ backend/     
# Node.js + NestJS/Express + Prisma + MySQL frontend/    
# React + TypeScript + Vite + IndexedDB + WebLLM docs/        

# Specifications, module docs, prompt library

Each part must be installed and configured separately.

---

# 3. Backend Installation

The backend provides authentication, sync endpoints, and structured data storage.

## Step 1 — Configure Environment Variables

Navigate to the backend directory:
'''
cd backend 
cp .env.example .env
'''
Edit `.env` and set:
'''
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/life_os" JWT_SECRET="your-secret-key" PORT=3001
'''

## Step 2 — Install Dependencies
'''
npm install
'''

## Step 3 — Initialize the Database
'''
Run Prisma migrations:
npx prisma migrate dev
'''

This will create the database schema defined in `prisma/schema.prisma`.

## Step 4 — Start the Backend Server
'''
npm run start:dev
'''
The backend will run at:
'''
http://localhost:3001
'''

---

# 4. Frontend Installation

The frontend is a PWA built with React, TypeScript, Vite, IndexedDB, and WebLLM.

## Step 1 — Install Dependencies
'''
cd frontend npm install
'''
## Step 2 — Start the Development Server
'''
npm run dev
'''
The frontend will run at:
'''
http://localhost:5173
'''

## Step 3 — Install the PWA (Optional)

Open the app in your browser and choose **Install App** from the browser menu.  
This enables offline mode, local caching, and native‑like behavior.

---

# 5. Database Setup (MySQL)

## Option A — Local MySQL Installation

1. Install MySQL Server.
2. Create a database:

CREATE DATABASE life_os;

3. Update `.env` with your credentials.

## Option B — Dockerized MySQL

Run:
'''
docker run --name lifeos-mysql -e MYSQL_ROOT_PASSWORD=yourpassword 
-e MYSQL_DATABASE=life_os -p 3306:3306 -d mysql:8
'''
Update `.env` accordingly.

---

# 6. IndexedDB Setup (Frontend Local Database)

The frontend automatically initializes IndexedDB on first load.

Tables include:

- `journal_entries`
- `notes`
- `tasks`
- `workbooks`, `sheets`, `cells`
- `coach_insights`, `coach_sessions`
- `embeddings`
- `life_graph_nodes`, `life_graph_edges`
- `sync_queue`

No manual setup is required.

---

# 7. Sync Engine Setup

The sync engine synchronizes local IndexedDB data with the backend MySQL database.

## Sync Triggers
- On app startup (if online)
- On configurable interval
- On user action (“Sync Now”)
- After authentication refresh

## Required Backend Endpoints
- `POST /sync/push`
- `POST /sync/pull`
- `GET /sync/status`

Ensure these endpoints are implemented before enabling sync.

---

# 8. WebLLM Setup (Local LLM)

Life.OS uses WebLLM for all AI analysis.

## Requirements
- Browser with WebGPU support (Chrome, Edge, or Safari Technology Preview)
- Model files stored locally or loaded via CDN

## Initialization
The frontend automatically:
- Loads the model
- Initializes the tokenizer
- Creates embedding and inference contexts

No backend configuration is required.

---

# 9. Building for Production

## Frontend Build
'''
cd frontend 
npm run build
'''
Output is generated in `dist/`.

## Backend Build
'''
cd backend 
npm run build 
npm run start:prod
'''
---

# 10. Deployment

## Backend Deployment Options
- Docker container
- VPS (Node.js + PM2)
- Managed Node hosting (Render, Railway, Fly.io)
- Self‑hosted server

## Frontend Deployment Options
- Static hosting (Netlify, Vercel, Cloudflare Pages)
- Self‑hosted Nginx/Apache
- PWA installation on user devices

## HTTPS Requirement
PWA installation requires HTTPS in production.

---

# 11. Maintenance

## Updating Dependencies
'''
npm update
'''
## Running Prisma Migrations
'''
npx prisma migrate deploy
'''
## Clearing Local IndexedDB (for debugging)

Open DevTools → Application → IndexedDB → Delete database.

## Backups
- Backend: MySQL dumps  
- Frontend: IndexedDB export (optional future feature)

---

# 12. Upgrading Life.OS

When upgrading to a new version:

1. Pull latest changes  
2. Review `CHANGELOG.md`  
3. Apply new Prisma migrations  
4. Rebuild backend  
5. Rebuild frontend  
6. Clear service worker cache (if needed)  
7. Reinstall PWA (if major UI changes)

---

# 13. Troubleshooting

## Backend fails to start
- Check `.env` values  
- Ensure MySQL is running  
- Run `npx prisma migrate dev`  

## Frontend fails to load
- Clear browser cache  
- Disable service worker in DevTools  
- Reinstall dependencies  

## Sync issues
- Ensure backend endpoints are reachable  
- Check network tab for failed requests  
- Inspect `sync_queue` in IndexedDB  

---

# 14. Development Workflow

1. Open VS Code  
2. Start backend (`npm run start:dev`)  
3. Start frontend (`npm run dev`)  
4. Keep module docs open for Copilot context  
5. Commit changes frequently  
6. Update documentation as features evolve  

---

# 15. Next Steps

- Review module documentation in `docs/modules/`  
- Review the master specification in `LIFE_OS_SPEC.md`  
- Begin implementing backend scaffolding  
- Begin implementing frontend shell and IndexedDB schema  
