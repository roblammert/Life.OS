# LIFE_TIMELINE.md  
**Life Timeline Specification — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Life Timeline is a unified chronological view of the user’s activity across all modules in Life.OS. It provides a narrative, time‑based representation of journal entries, notes, tasks, workbook events, insights, and Life Moments. It is one of the core intelligence surfaces of the system, enabling reflection, pattern recognition, and long‑term understanding.

This document defines the timeline data model, event types, generation rules, UI requirements, and integration with Life.Coach and the Life Graph.

---

# 1. Purpose and Responsibilities

The Life Timeline provides a **single chronological record** of the user’s life as captured through Life.OS.

### Core Responsibilities
- Aggregate events from all modules into a unified timeline.
- Display entries, notes, tasks, metrics, insights, and Life Moments.
- Support daily, weekly, monthly, and yearly views.
- Provide summaries and narrative explanations via Life.Coach.
- Integrate with the Life Graph for contextual exploration.
- Enable users to navigate their personal history easily.

### Why a Timeline?
The timeline helps users:
- See how their thoughts, actions, and data evolve.
- Identify emotional, cognitive, and behavioral patterns.
- Understand cause‑and‑effect relationships.
- Reflect on progress and growth.
- Revisit important moments and insights.

---

# 2. Timeline Data Model

Timeline events are stored locally in IndexedDB.

## 2.1 Timeline Event Structure

### `timeline_events`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| event_type | string | Type of event |
| source_module | string | journal, notes, tasks, storage, coach |
| source_id | string | ID of the originating entity |
| timestamp | number | When the event occurred |
| metadata | object | Module‑specific metadata |

### Event Types
- **journal_entry_created**  
- **journal_entry_updated**  
- **note_created**  
- **note_updated**  
- **task_created**  
- **task_completed**  
- **task_updated**  
- **workbook_updated**  
- **metric_change_detected**  
- **life_moment_detected**  
- **insight_generated**  
- **review_generated** (daily/weekly/monthly)  

---

# 3. Event Generation Rules

Each module contributes events to the timeline.

## 3.1 Journal Events
Generated when:
- A journal entry is created  
- A journal entry is updated  
- Life.Coach detects a Life Moment from an entry  

Metadata includes:
- Sentiment  
- Mood  
- Topics  
- Word count  

## 3.2 Notes Events
Generated when:
- A note is created  
- A note is updated  
- Concepts or clusters change  

Metadata includes:
- Tags  
- Concepts  
- Related tasks  

## 3.3 Task Events
Generated when:
- A task is created  
- A task is completed  
- A task is updated  
- A project milestone is reached  

Metadata includes:
- Status  
- Priority  
- Effort  
- Energy level  

## 3.4 Storage Events
Generated when:
- A workbook cell changes  
- A chart is created  
- A metric trend is detected  

Metadata includes:
- Cell range  
- Chart type  
- Trend summary  

## 3.5 Life.Coach Events
Generated when:
- Daily digest is created  
- Weekly review is created  
- Monthly review is created  
- Life Moment is detected  
- Insight is generated  

Metadata includes:
- Insight type  
- Summary  
- Scores  

---

# 4. Timeline Views

The timeline supports multiple zoom levels.

## 4.1 Daily View
Shows:
- Journal entries  
- Notes  
- Tasks created/completed  
- Workbook changes  
- Insights  
- Life Moments  

## 4.2 Weekly View
Shows:
- Weekly review  
- Major events  
- Task progress  
- Mood trends  
- Concept clusters  

## 4.3 Monthly View
Shows:
- Monthly review  
- Emotional trends  
- Productivity patterns  
- Habit consistency  
- Major Life Moments  

## 4.4 Yearly View
Shows:
- Yearly reflection  
- Identity themes  
- Long‑term patterns  
- Graph evolution  

---

# 5. Timeline Navigation

### Features
- Infinite scroll  
- Jump to date  
- Filter by module  
- Filter by event type  
- Search events  
- Highlight Life Moments  

### Interactions
- Tap/click event → open source entity  
- Hover → preview metadata  
- Drag timeline scrubber (desktop)  

---

# 6. Integration with Life Graph

The timeline and graph are deeply connected.

### Timeline → Graph
- Clicking an event highlights related nodes.
- Timeline events can expand into graph neighborhoods.

### Graph → Timeline
- Selecting a node filters timeline to related events.
- Graph clusters can be explored chronologically.

---

# 7. Integration with Life.Coach

Life.Coach enhances the timeline with:

### Narrative Summaries
- Daily summaries  
- Weekly reviews  
- Monthly reflections  
- Yearly retrospectives  

### Pattern Detection
- Emotional trends  
- Cognitive patterns  
- Habit consistency  
- Productivity cycles  

### Life Moments
- Automatically added to timeline  
- Highlighted visually  
- Linked to source events  

---

# 8. IndexedDB Schema

Tables:
- `timeline_events`  

Indexes:
- `timestamp`  
- `event_type`  
- `source_module`  

---

# 9. Future Enhancements

- Timeline heatmap  
- Multi‑timeline layers (emotional, cognitive, behavioral)  
- AI‑generated narrative mode  
- Timeline bookmarks  
- “On this day” memory resurfacing  
- Cross‑year pattern detection  

---

# 10. Summary

The Life Timeline is the narrative backbone of Life.OS. It unifies all modules into a chronological story, enabling deep reflection, pattern recognition, and personal growth. Through integration with Life.Coach and the Life Graph, the timeline becomes a powerful tool for understanding the user’s life across time.
