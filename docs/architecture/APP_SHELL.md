# APP_SHELL.md  
**Application Shell Architecture — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The App Shell is the structural foundation of the Life.OS PWA. It defines the global layout, navigation model, offline behavior, module integration, and UI framework that supports all Life.OS features. The App Shell ensures fast startup, smooth navigation, and a unified experience across Journal, Notes, Tasks, Storage, Life.Coach, Timeline, Graph, and Settings.

This document defines the App Shell architecture, routing model, UI components, offline strategy, state management, and integration with the broader Life.OS system.

---

# 1. Purpose and Responsibilities

The App Shell provides the **persistent UI framework** that wraps all modules.

### Core Responsibilities
- Provide global navigation and layout.
- Load instantly using PWA caching.
- Manage module routing and transitions.
- Maintain global state (user, settings, theme, context).
- Provide offline‑first behavior.
- Integrate with the Notification Engine.
- Surface Life.Coach insights across modules.
- Provide consistent UI patterns across devices.

### Why an App Shell?
- Instant startup  
- Offline capability  
- Consistent UX  
- Modular architecture  
- Clear separation of concerns  

---

# 2. App Shell Structure

The App Shell consists of:

### 2.1 Global Layout
- Top bar (desktop/tablet)
- Bottom navigation (phone)
- Side navigation (desktop)
- Floating action button (contextual)
- Notification center
- Quick actions panel
- Global search bar

### 2.2 Module Viewport
A single viewport where modules render:
- Journal  
- Notes  
- Tasks  
- Storage  
- Life Timeline  
- Life Graph  
- Life.Coach  
- Settings  

### 2.3 Persistent Components
- App header  
- Navigation bar  
- Sync indicator  
- Theme controller  
- Context Engine hooks  
- Notification badge  

---

# 3. Navigation Model

Life.OS uses a hybrid navigation model optimized for PWA behavior.

### 3.1 Primary Navigation
- Journal  
- Notes  
- Tasks  
- Storage  
- Life.Coach  
- Timeline  
- Graph  
- Settings  

### 3.2 Secondary Navigation
- Search  
- Notifications  
- Quick actions  
- Recent items  

### 3.3 Routing
- Client‑side routing (React Router or equivalent)
- Lazy‑loaded modules
- Preloading for frequently used modules

### 3.4 Deep Linking
Supports:
- Entry links  
- Note links  
- Task links  
- Graph node links  
- Timeline event links  
- Review links  

---

# 4. Offline‑First Architecture

The App Shell is cached using a service worker.

### Offline Capabilities
- App Shell loads instantly offline  
- IndexedDB stores all data  
- Sync Engine queues operations  
- Local LLM runs offline  
- Visualizations work offline  
- Graph and timeline work offline  

### Service Worker Responsibilities
- Cache App Shell  
- Cache static assets  
- Cache module bundles  
- Handle offline fallback  
- Manage updates  

---

# 5. Global State Management

The App Shell manages global state shared across modules.

### Global State Includes
- User profile  
- Theme (light/dark/system)  
- Context Engine state  
- Sync status  
- Notification count  
- Recent items  
- App settings  
- LLM status  

### State Management Options
- Zustand  
- Redux Toolkit  
- Recoil  
- Jotai  

Life.OS favors **Zustand** for simplicity and modularity.

---

# 6. UI Framework & Design System

Life.OS uses a unified design system.

### Components
- Buttons  
- Cards  
- Lists  
- Modals  
- Drawers  
- Tabs  
- Chips  
- Graph nodes  
- Timeline events  
- Insight cards  

### Design Principles
- Calm  
- Minimal  
- Accessible  
- Data‑rich  
- Emotionally supportive  

### Theming
- Light mode  
- Dark mode  
- High‑contrast mode  
- Dynamic color accents (future)  

---

# 7. Global Search

The App Shell includes a universal search bar.

### Search Capabilities
- Journal entries  
- Notes  
- Tasks  
- Projects  
- Concepts  
- Topics  
- People  
- Life Moments  
- Graph nodes  

### Search Features
- Semantic search (embeddings)
- Keyword search
- Filters by module
- Recent searches
- Search suggestions

---

# 8. Notification Center

The App Shell includes a persistent notification center.

### Features
- List of notifications  
- Mark as read  
- Snooze  
- Clear all  
- Open source entity  

### Integration
- Notification Engine  
- Life.Coach  
- Context Engine  

---

# 9. Quick Actions

Quick actions provide fast access to common tasks.

### Examples
- New journal entry  
- New note  
- New task  
- New workbook  
- Quick capture  
- Voice note (future)  

### Trigger Points
- Floating action button  
- Keyboard shortcuts  
- Command palette  

---

# 10. Module Integration

Each module plugs into the App Shell via:

### Module Contract
- Route definition  
- Module icon  
- Module name  
- Module viewport component  
- Module actions  
- Module search provider  
- Module insight provider  

### Cross‑Module Integration
- Life.Coach insights appear across modules  
- Graph nodes link to module entities  
- Timeline events link to module entities  
- Search results span modules  

---

# 11. Performance Strategy

The App Shell is optimized for speed.

### Techniques
- Code splitting  
- Lazy loading  
- Preloading frequent modules  
- GPU‑accelerated graph rendering  
- Virtualized lists  
- Cached visualizations  

### Startup Sequence
1. Load App Shell  
2. Load global state  
3. Load IndexedDB metadata  
4. Load small embedding model  
5. Render UI  
6. Load modules on demand  

---

# 12. Security & Privacy

The App Shell enforces:
- Local‑only data processing  
- No external API calls  
- No telemetry  
- No remote logging  
- Optional sync (user‑controlled)  

---

# 13. Future Enhancements

- Multi‑window support  
- Split‑screen mode  
- Customizable dashboards  
- Plugin system  
- Theme editor  
- Voice‑driven navigation  

---

# 14. Summary

The App Shell is the structural backbone of Life.OS. It provides the global layout, navigation, offline behavior, and state management that unify all modules into a seamless, fast, and deeply personal experience. Through integration with the Local LLM, Life.Coach, the Graph, and the Timeline, the App Shell enables Life.OS to feel like a cohesive personal operating system.
