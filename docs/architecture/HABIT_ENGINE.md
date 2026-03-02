# HABIT_ENGINE.md  
**Habit Intelligence Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Habit Engine is responsible for detecting habits, routines, behavioral patterns, and consistency trends across the user’s life. It integrates data from Journal, Tasks, Notes, Storage, and the Life Timeline to identify repeated behaviors, track progress, and generate actionable insights.

This document defines the habit detection model, data sources, scoring algorithms, insight types, UI surfaces, and integration with Life.Coach and the Life Graph.

---

# 1. Purpose and Responsibilities

The Habit Engine helps users understand their **behavioral patterns** and **routines**.

### Core Responsibilities
- Detect habits from journal entries, tasks, and numeric data.
- Track habit frequency, consistency, and streaks.
- Identify routines and recurring sequences.
- Detect habit–emotion and habit–productivity correlations.
- Generate habit insights and suggestions.
- Integrate with Life.Coach for coaching and reviews.
- Surface habits in dashboards, timeline, and graph.

### Why Habit Intelligence?
Habits shape:
- Emotional stability  
- Productivity  
- Health  
- Identity  
- Long‑term growth  

Life.OS uses habits as a foundation for personalized coaching.

---

# 2. Habit Data Model

Habits are stored locally in IndexedDB.

### `habits`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| name | string | Habit name |
| description | string | Optional |
| detected_from | string[] | Source IDs (entries, tasks, metrics) |
| frequency | object | Daily/weekly/monthly counts |
| streak | number | Current streak |
| longest_streak | number | Longest streak |
| consistency_score | number | 0–100 |
| correlations | object | Emotion/productivity correlations |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |

### `habit_events`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| habit_id | string | Habit reference |
| timestamp | number | When habit occurred |
| source_module | string | journal, tasks, storage |
| source_id | string | Entity ID |

---

# 3. Habit Detection Pipeline

Habits are detected automatically by Life.Coach.

## Stage 1 — Data Extraction
Sources:
- Journal entries  
- Task completions  
- Workbook metrics  
- Notes (optional)  

Extract:
- Actions  
- Behaviors  
- Routines  
- Repeated phrases  
- Numeric patterns  

## Stage 2 — Pattern Recognition
Life.Coach identifies:
- Repeated actions  
- Recurring time patterns  
- Behavioral clusters  
- Task categories  
- Numeric thresholds  

## Stage 3 — Habit Formation
A habit is formed when:
- A behavior repeats ≥ 3 times  
- Occurs across multiple days  
- Shows temporal consistency  

## Stage 4 — Scoring
Habits receive:
- **Frequency score**  
- **Consistency score**  
- **Streak score**  
- **Correlation score**  

## Stage 5 — Insight Generation
Life.Coach generates:
- Habit summaries  
- Strengths  
- Weak spots  
- Suggestions  
- Routines  

---

# 4. Habit Scoring

Habits are scored on a 0–100 scale.

### 4.1 Frequency Score
Based on:
- Number of occurrences  
- Distribution across time  

### 4.2 Consistency Score
Based on:
- Regularity  
- Variance  
- Streaks  

### 4.3 Correlation Score
Based on:
- Mood correlation  
- Productivity correlation  
- Cognitive pattern correlation  

### 4.4 Identity Score (future)
Based on:
- Long‑term alignment with values  
- Emotional resonance  

---

# 5. Habit Types

Life.OS detects several categories of habits.

## 5.1 Behavioral Habits
- Exercise  
- Reading  
- Meditation  
- Journaling  
- Creative work  

## 5.2 Productivity Habits
- Task batching  
- Morning planning  
- Deep work sessions  
- Project progress  

## 5.3 Emotional Habits
- Rumination  
- Gratitude  
- Self‑criticism  
- Positive reframing  

## 5.4 Cognitive Habits
- Overthinking  
- Catastrophizing  
- Strength‑based thinking  

## 5.5 Numeric Habits
From Storage:
- Sleep hours  
- Steps  
- Spending  
- Calories  
- Time tracking  

---

# 6. Routine Detection

Routines are sequences of habits.

### Example Routine
- Wake up  
- Journal  
- Plan tasks  
- Exercise  
- Deep work  

### Detection Rules
- Occur in sequence  
- Occur on multiple days  
- Occur within similar time windows  

### Routine Insights
- Routine stability  
- Routine disruptions  
- Suggested improvements  

---

# 7. Integration with Life Timeline

Habits appear on the timeline as:
- habit_event  
- habit_detected  
- habit_streak_started  
- habit_streak_broken  

Users can:
- View habit history  
- Explore habit–emotion correlations  
- Jump to source entries  

---

# 8. Integration with Life Graph

Habits become nodes in the Life Graph.

### Node Type
- **habit**

### Edges
- habit → entry (derived_from)  
- habit → task (derived_from)  
- habit → metric (correlates_with)  
- habit → concept (related_to)  

### Graph Insights
- Habit clusters  
- Habit–emotion relationships  
- Habit–productivity relationships  

---

# 9. Integration with Life.Coach

Life.Coach uses habits for:

### Coaching
- Suggested routines  
- Habit reinforcement  
- Habit reframing  
- Habit stacking  

### Reviews
- Daily: habit events  
- Weekly: consistency  
- Monthly: habit evolution  
- Yearly: identity themes  

### Notifications
- Habit reminders  
- Streak alerts  
- Habit suggestions  

---

# 10. IndexedDB Schema

Tables:
- `habits`  
- `habit_events`  

Indexes:
- `habit_id`  
- `timestamp`  
- `updated_at`  

---

# 11. Future Enhancements

- Habit forecasting  
- Habit difficulty modeling  
- Habit identity mapping  
- Habit‑based goal generation  
- AI‑generated habit plans  
- Habit loops (cue → routine → reward)  

---

# 12. Summary

The Habit Engine is the behavioral intelligence layer of Life.OS. It detects habits, tracks routines, identifies correlations, and provides actionable insights that help users build a more intentional life. Through deep integration with Life.Coach, the Life Graph, and the Life Timeline, habits become a powerful foundation for personal growth.
