# Life.OS  
*A private, offline‑first personal operating system for your mind, behavior, and growth.*

Life.OS is a modular, privacy‑first platform that unifies journaling, notes, tasks, spreadsheets, and a local AI coach into a single Progressive Web Application (PWA). It helps users understand their lives, identify patterns, make better decisions, and grow intentionally — all while keeping their data fully under their control.

Life.OS runs offline, syncs when online, and performs all AI analysis locally using WebLLM. No personal data is ever sent to external AI services.

---

## Core Philosophy

Life.OS is built on five foundational principles:

- **Offline‑first** — All data is stored locally and fully accessible without internet.
- **Privacy‑first** — All AI analysis is performed locally using WebLLM.
- **Modular architecture** — Each functional area is a module: Journal, Notes, Assistant, Storage, Coach.
- **Cross‑module intelligence** — Insights, correlations, and recommendations span all modules.
- **Device‑aware PWA** — A single application that adapts to phone, tablet, and desktop layouts.

---

## Modules

### Life.OS (Core Orchestrator)
- Authentication  
- Sync engine  
- Global search  
- Dashboards & analytics  
- Data export/import  
- Notification center  
- Device‑aware layout  
- Life timeline & life graph  

### Life.Journal
- Markdown journaling  
- Sentiment, mood, and linguistic analysis  
- Cognitive pattern detection  
- Emotional granularity scoring  
- Import/export  
- Insight drawer powered by Life.Coach  

### Life.Notes
- Markdown notes  
- Tags, checklists, scratch pads  
- Idea clustering & concept extraction  
- Knowledge graph generation  
- Semantic search  
- Note‑to‑task and note‑to‑journal suggestions  

### Life.Assistant
- Task creation, tracking, scheduling  
- Priorities, due dates, statuses  
- Project detection  
- Energy‑based task suggestions  
- Procrastination pattern detection  
- Task breakdown via LLM  

### Life.Storage
- Spreadsheet‑like workbooks  
- Formulas, formatting, charts  
- Formula explanation via LLM  
- Data insights & chart suggestions  
- Natural language queries  

### Life.Coach (Local LLM Intelligence Layer)
- Local LLM via WebLLM  
- Embeddings & vector search  
- Daily/weekly/monthly reviews  
- Emotional weather forecasting  
- Cognitive bias detection  
- Habit extraction & routine building  
- Life Moments detection  
- Conversational coaching  

---

## Key Intelligence Features

Life.OS includes eleven advanced intelligence systems:

1. Unified Life Graph  
2. Automatic Cross‑Linking  
3. Life Timeline  
4. Personal Knowledge Management  
5. Productivity Intelligence  
6. Emotional Insight Engine  
7. Cognitive Insight Engine  
8. Habit Intelligence  
9. Context Awareness  
10. Advanced Visualization  
11. Magic Features (Life Moments, smart notifications, memory consolidation)

---

## Architecture Overview

### Frontend
- React + TypeScript  
- Vite  
- IndexedDB (Dexie)  
- WebLLM  
- Service worker  
- Responsive UI  

### Backend
- Node.js + TypeScript  
- NestJS or Express  
- MySQL  
- Prisma ORM  
- REST API  

### Sync Model
- Offline‑first  
- Local writes always succeed  
- Sync queue  
- Conflict resolution via timestamps  

---

## Repository Structure
```
life-os/ 
  backend/ 
  frontend/ 
  docs/ 
  LIFE_OS_SPEC.md 
  modules/
```
---

## Getting Started

### Backend
```
cd backend 
cp .env.example .env 
npm install 
npx prisma migrate dev 
npm run start:dev
```
### Frontend
```
cd frontend 
npm install 
npm run dev
```
---

## Documentation

- LIFE_OS_SPEC.md  
- FEATURE_MATRIX.md  
- INSTALL_GUIDE.md  
- CHANGELOG.md  
- Module documentation  

---

## License

Choose any license appropriate for your project (MIT recommended).

---

## Status

Life.OS is under active development.  
This repository contains the full architectural blueprint and documentation for Copilot‑assisted development.
