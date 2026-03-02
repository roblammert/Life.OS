# SETTINGS_AND_PRIVACY.md  
**Settings, Privacy, and User Control — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

Life.OS is designed around privacy, user autonomy, and local‑first intelligence. The Settings & Privacy module provides the user with full control over data, sync, notifications, intelligence features, and the Local LLM. This document defines the settings architecture, privacy model, user controls, data retention rules, and integration with the broader Life.OS system.

---

# 1. Purpose and Responsibilities

The Settings & Privacy module ensures that users have **complete control** over their data, preferences, and intelligence features.

### Core Responsibilities
- Manage user preferences and configuration.
- Provide privacy controls for all modules.
- Manage Local LLM settings and model selection.
- Control sync behavior and backend connectivity.
- Manage notifications and quiet hours.
- Provide data export and deletion tools.
- Ensure transparency in how intelligence features work.

### Why This Matters
Life.OS is a personal operating system. Users must:
- Know what data exists  
- Control how it is used  
- Decide what is synced  
- Understand how intelligence works  
- Delete anything at any time  

---

# 2. Settings Architecture

Settings are stored in IndexedDB and cached in memory.

### Settings Categories
- General  
- Appearance  
- Notifications  
- Privacy  
- Sync  
- Intelligence  
- Local LLM  
- Data Management  
- About  

### Data Model: `settings`
| Field | Type | Description |
|-------|------|-------------|
| id | string | Always "global" |
| theme | string | light, dark, system |
| quiet_hours | object | start/end times |
| notifications_enabled | boolean | Global toggle |
| module_notifications | object | Per‑module toggles |
| sync_enabled | boolean | Whether sync is active |
| sync_interval | number | ms between syncs |
| llm_model | string | Selected model |
| llm_auto_unload | boolean | Unload when idle |
| intelligence_features | object | Feature toggles |
| privacy_mode | string | normal, strict |
| data_retention | object | Retention rules |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |

---

# 3. General Settings

### Includes
- Name  
- Time zone  
- Date/time format  
- Language  
- Default module on startup  
- Keyboard shortcuts  

### Behavior
- Updates apply instantly  
- Stored locally  
- Synced only if sync is enabled  

---

# 4. Appearance Settings

### Includes
- Theme (light/dark/system)  
- Accent color (future)  
- Font size  
- Reduced motion  
- High contrast mode  

### Integration
- Applies to all modules  
- Stored in IndexedDB  
- Cached for instant startup  

---

# 5. Notification Settings

### Global Controls
- Enable/disable notifications  
- Quiet hours  
- Notification preview text  

### Per‑Module Controls
- Journal prompts  
- Task reminders  
- Habit alerts  
- Insight notifications  
- Life Moment alerts  
- Review notifications  

### Quiet Hours
- Default: 10 PM – 7 AM  
- No notifications delivered during this window  
- Non‑urgent notifications are queued  

---

# 6. Privacy Settings

Privacy is the foundation of Life.OS.

### Privacy Modes
#### Normal Mode
- All intelligence features enabled  
- Local LLM fully active  
- Sync optional  

#### Strict Mode
- No sync  
- No external requests  
- No remote assets  
- Local LLM only  
- No telemetry  
- No analytics  
- No remote fonts or images  

### Data Isolation
- All data stored in IndexedDB  
- No cloud storage unless sync is enabled  
- No external AI calls  

### Transparency
Users can view:
- What data exists  
- What insights were generated  
- What the LLM processed  
- What was synced  

---

# 7. Sync Settings

### Controls
- Enable/disable sync  
- Sync interval  
- Manual sync button  
- Conflict resolution rules (future)  

### Sync Transparency
Users can view:
- Pending operations  
- Last sync time  
- Sync errors  
- Synced entities  

### Privacy Guarantee
Sync is **optional** and **off by default**.

---

# 8. Intelligence Settings

Users can control all intelligence features.

### Toggles
- Emotional insights  
- Cognitive insights  
- Behavioral insights  
- Productivity insights  
- Knowledge insights  
- Life Moments  
- Suggested tasks  
- Suggested notes  
- Suggested prompts  
- Daily/weekly/monthly/yearly reviews  

### Granular Controls
- Emotional granularity  
- Cognitive sensitivity  
- Habit detection sensitivity  
- Productivity analysis depth  

---

# 9. Local LLM Settings

### Model Selection
- Small embedding model  
- Medium insight model  
- Large review model  

### Controls
- Auto‑unload when idle  
- Background loading  
- Memory usage limits  
- GPU acceleration toggle  

### Transparency
Users can view:
- Model size  
- Memory usage  
- Load status  
- Last inference time  

---

# 10. Data Management

### Export Tools
- Export all data (JSON)  
- Export module‑specific data  
- Export insights  
- Export graph  
- Export timeline  

### Import Tools
- Import journal entries  
- Import notes  
- Import tasks  
- Import spreadsheets  

### Deletion Tools
- Delete individual entries  
- Delete module data  
- Delete insights  
- Delete graph  
- Delete timeline  
- Delete everything (factory reset)  

### Retention Rules
Users can configure:
- Auto‑delete old entries  
- Auto‑delete insights  
- Auto‑delete embeddings  
- Auto‑delete timeline events  

---

# 11. About & Transparency

### Includes
- Version number  
- IndexedDB schema version  
- LLM model version  
- Sync engine version  
- Changelog  
- Open‑source licenses (future)  

### Transparency Reports
- What the LLM processed  
- What insights were generated  
- What data was synced  
- What notifications were triggered  

---

# 12. Integration with Other Modules

### Life.Coach
- Intelligence toggles  
- Review scheduling  
- Insight sensitivity  

### Notification Engine
- Quiet hours  
- Per‑module toggles  

### Sync Engine
- Sync interval  
- Sync enable/disable  

### Local LLM
- Model selection  
- Auto‑unload  

### App Shell
- Theme  
- Language  
- Startup module  

---

# 13. Future Enhancements

- Multi‑profile support  
- Encrypted local storage  
- Passcode/biometric lock  
- Per‑entry privacy levels  
- Local LLM fine‑tuning  
- Privacy‑aware dashboards  
- Data residency controls  

---

# 14. Summary

The Settings & Privacy module gives users full control over their data, intelligence features, sync behavior, notifications, and the Local LLM. It ensures that Life.OS remains private, transparent, and user‑driven—empowering users to shape their personal operating system according to their needs and values.
