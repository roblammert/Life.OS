# EMOTIONAL_ENGINE.md  
**Emotional Insight Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Emotional Engine is responsible for detecting emotions, mood patterns, emotional granularity, emotional weather, and long‑term emotional trends across the user’s journal entries, notes, tasks, and numeric data. It is one of the core intelligence systems within Life.Coach and plays a major role in reviews, notifications, and Life Moments.

This document defines the emotional analysis model, detection rules, scoring algorithms, insight types, data sources, and integration with the Life Graph, Timeline, and Habit Engine.

---

# 1. Purpose and Responsibilities

The Emotional Engine helps users understand **how they feel**, how their emotions change over time, and what influences those changes.

### Core Responsibilities
- Detect emotions and mood from journal entries and notes.
- Score emotional intensity and granularity.
- Track emotional trends across days, weeks, and months.
- Identify emotional triggers and stabilizers.
- Generate emotional insights and summaries.
- Contribute to daily/weekly/monthly reviews.
- Detect emotional Life Moments.
- Integrate with cognitive, behavioral, and productivity insights.

### Why Emotional Intelligence?
Understanding emotional patterns helps users:
- Improve self‑awareness  
- Identify triggers  
- Build emotional resilience  
- Strengthen relationships  
- Make better decisions  
- Track long‑term well‑being  

---

# 2. Emotional Data Model

Emotional insights are stored in IndexedDB as part of the `coach_insights` table.

### `coach_insights` (emotional subset)
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source_module | string | journal, notes |
| source_id | string | Entity ID |
| insight_type | string | sentiment, mood, emotional_pattern |
| content | string | Insight text |
| metadata | object | Scores, tags, examples |
| created_at | number | Timestamp |

---

# 3. Emotional Categories

The Emotional Engine detects several categories of emotional signals.

## 3.1 Sentiment
- Positive  
- Neutral  
- Negative  

## 3.2 Mood States
- Calm  
- Anxious  
- Sad  
- Hopeful  
- Tired  
- Energized  
- Overwhelmed  
- Confident  
- Lonely  
- Motivated  

## 3.3 Emotional Granularity
Measures how precisely the user expresses emotions.

Low granularity:
- “I feel bad.”

High granularity:
- “I feel disappointed, frustrated, and mentally drained.”

## 3.4 Emotional Weather
Short‑term emotional climate:
- Stable  
- Volatile  
- Improving  
- Declining  
- Mixed  

---

# 4. Emotional Detection Pipeline

The Emotional Engine uses a multi‑stage pipeline.

## Stage 1 — Text Extraction
Sources:
- Journal entries  
- Notes  
- Task descriptions (optional)  

## Stage 2 — Preprocessing
- Remove Markdown  
- Normalize text  
- Chunk long entries  

## Stage 3 — Emotion Detection
Life.Coach identifies:
- Emotion words  
- Emotional tone  
- Emotional intensity  
- Mixed emotions  
- Emotional shifts  

## Stage 4 — Scoring
Each entry receives:
- Sentiment score  
- Mood tags  
- Emotional granularity score  
- Emotional intensity score  

## Stage 5 — Trend Analysis
Across time:
- Daily mood  
- Weekly emotional arcs  
- Monthly emotional patterns  
- Emotional volatility  

## Stage 6 — Insight Generation
Life.Coach generates:
- Emotional summaries  
- Emotional triggers  
- Emotional stabilizers  
- Emotional weather  
- Suggested journal prompts  

---

# 5. Emotional Scoring

Emotions are scored on multiple dimensions.

### 5.1 Sentiment Score
Range: **-1 to +1**

### 5.2 Emotional Intensity
Range: **0–100**

### 5.3 Emotional Granularity
Range: **0–100**

### 5.4 Emotional Volatility
Based on:
- Variance  
- Frequency of emotional shifts  
- Intensity swings  

---

# 6. Emotional Life Moments

Life.Coach detects emotional breakthroughs.

### Examples
- A sudden emotional shift  
- A major emotional realization  
- A breakthrough in journaling  
- A moment of clarity  
- A resolved emotional conflict  

These appear in:
- Life Timeline  
- Life Graph  
- Daily/weekly/monthly reviews  

---

# 7. Integration with Life Timeline

Emotional events appear as:
- emotion_detected  
- emotional_shift_detected  
- emotional_pattern_detected  
- emotional_breakthrough  

Users can:
- View emotional arcs  
- Explore emotional triggers  
- Jump to source entries  

---

# 8. Integration with Life Graph

Emotions become nodes in the Life Graph.

### Node Types
- **emotion**  
- **emotional_pattern**  
- **emotional_trigger**  

### Edges
- emotion → entry (derived_from)  
- emotion → habit (correlates_with)  
- emotion → cognitive_pattern (related_to)  
- emotion → task (influences)  

### Graph Insights
- Emotional clusters  
- Emotional–habit relationships  
- Emotional–productivity relationships  

---

# 9. Integration with Habit Engine

Emotions influence habits.

### Examples
- Anxiety → avoidance habits  
- Motivation → productivity habits  
- Fatigue → inconsistent routines  

The Habit Engine uses emotional insights to:
- Explain habit disruptions  
- Suggest emotional stabilizers  
- Detect habit loops  

---

# 10. Integration with Life.Coach

The Emotional Engine powers:
- Daily emotional summaries  
- Weekly emotional trends  
- Monthly emotional arcs  
- Suggested journal prompts  
- Emotional reframes  
- Emotional weather forecasts  

---

# 11. IndexedDB Schema

Tables:
- `coach_insights` (emotional subset)  

Indexes:
- `insight_type`  
- `source_module`  
- `created_at`  

---

# 12. Future Enhancements

- Multi‑modal emotion detection (voice, images)  
- Emotion forecasting  
- Emotion–identity mapping  
- Emotional resilience modeling  
- Personalized emotional regulation plans  

---

# 13. Summary

The Emotional Engine is the emotional intelligence layer of Life.OS. It detects emotions, tracks emotional patterns, identifies emotional triggers, and generates insights that help users understand and improve their emotional well‑being. Through deep integration with Life.Coach, the Life Graph, and the Life Timeline, the Emotional Engine provides powerful emotional awareness and long‑term emotional understanding.
