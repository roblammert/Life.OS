# COGNITIVE_ENGINE.md  
**Cognitive Insight Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Cognitive Engine is responsible for detecting thinking patterns, cognitive distortions, strengths, reframes, and identity themes across the user’s journal entries, notes, tasks, and long‑term behavior. It is one of the core intelligence systems within Life.Coach and plays a major role in reviews, insights, and Life Moments.

This document defines the cognitive analysis model, detection rules, insight types, data sources, and integration with the Life Graph, Timeline, and Habit Engine.

---

# 1. Purpose and Responsibilities

The Cognitive Engine helps users understand **how they think**, not just what they do or feel.

### Core Responsibilities
- Detect cognitive distortions and unhelpful thinking patterns.
- Identify strengths, values, and constructive thinking habits.
- Generate reframes and alternative perspectives.
- Track cognitive patterns over time.
- Contribute to daily/weekly/monthly reviews.
- Detect cognitive Life Moments.
- Integrate with emotional, behavioral, and productivity insights.

### Why Cognitive Intelligence?
Understanding thinking patterns helps users:
- Reduce stress  
- Improve decision‑making  
- Strengthen resilience  
- Identify identity themes  
- Break unhelpful cycles  
- Build healthier thought habits  

---

# 2. Cognitive Data Model

Cognitive insights are stored in IndexedDB as part of the `coach_insights` table.

### `coach_insights` (cognitive subset)
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source_module | string | journal, notes |
| source_id | string | Entity ID |
| insight_type | string | cognitive_pattern, strength, reframe |
| content | string | Insight text |
| metadata | object | Pattern type, severity, examples |
| created_at | number | Timestamp |

---

# 3. Cognitive Pattern Categories

The Cognitive Engine detects several categories of patterns.

## 3.1 Cognitive Distortions
- Catastrophizing  
- Overgeneralization  
- Black‑and‑white thinking  
- Mind reading  
- Emotional reasoning  
- Personalization  
- Should statements  
- Filtering (discounting positives)  
- Fortune telling  

## 3.2 Thinking Styles
- Analytical  
- Reflective  
- Creative  
- Solution‑oriented  
- Narrative‑driven  
- Values‑driven  

## 3.3 Strengths
- Resilience  
- Empathy  
- Curiosity  
- Discipline  
- Optimism  
- Self‑awareness  

## 3.4 Identity Themes
- “I am someone who…” patterns  
- Core values  
- Repeated self‑descriptions  
- Long‑term narrative arcs  

---

# 4. Cognitive Detection Pipeline

The Cognitive Engine uses a multi‑stage pipeline.

## Stage 1 — Text Extraction
Sources:
- Journal entries  
- Notes  
- Task descriptions  
- Review summaries  

## Stage 2 — Preprocessing
- Remove Markdown  
- Normalize text  
- Chunk long entries  

## Stage 3 — Pattern Detection
Life.Coach identifies:
- Distortion markers  
- Repeated phrasing  
- Self‑referential statements  
- Value‑laden language  
- Cognitive triggers  

## Stage 4 — Scoring
Each pattern receives:
- Severity score  
- Frequency score  
- Recency score  
- Confidence score  

## Stage 5 — Insight Generation
Life.Coach generates:
- Pattern summaries  
- Examples from text  
- Reframes  
- Strengths  
- Suggestions  

---

# 5. Reframe Generation

Reframes are constructive alternative perspectives.

### Reframe Types
- Cognitive reframes  
- Emotional reframes  
- Behavioral reframes  
- Identity reframes  

### Example
**Pattern:** “I always mess things up.”  
**Reframe:** “You’ve handled similar situations well before. This is one moment, not a pattern.”

Reframes appear in:
- Insight drawers  
- Daily reviews  
- Weekly reviews  
- Life Moments  

---

# 6. Cognitive Life Moments

Life.Coach detects cognitive breakthroughs.

### Examples
- A major shift in self‑talk  
- A new value emerging  
- A resolved cognitive distortion  
- A breakthrough insight in journaling  
- A reframed identity statement  

These appear in:
- Life Timeline  
- Life Graph  
- Monthly reviews  

---

# 7. Integration with Life Timeline

Cognitive events appear as:
- cognitive_pattern_detected  
- cognitive_shift_detected  
- cognitive_reframe_generated  
- cognitive_breakthrough  

Users can:
- Jump from timeline → source entry  
- View cognitive arcs over time  

---

# 8. Integration with Life Graph

Cognitive patterns become nodes in the Life Graph.

### Node Types
- **cognitive_pattern**  
- **strength**  
- **identity_theme**  

### Edges
- pattern → entry (derived_from)  
- pattern → emotion (related_to)  
- pattern → habit (influences)  
- pattern → concept (related_to)  

### Graph Insights
- Cognitive clusters  
- Identity evolution  
- Pattern–emotion relationships  

---

# 9. Integration with Habit Engine

Cognitive patterns influence habits.

### Examples
- Catastrophizing → avoidance habits  
- Strength‑based thinking → productivity habits  
- Emotional reasoning → inconsistent routines  

The Habit Engine uses cognitive insights to:
- Explain habit disruptions  
- Suggest habit reframes  
- Detect habit loops  

---

# 10. Integration with Life.Coach

The Cognitive Engine powers:
- Daily reframes  
- Weekly cognitive summaries  
- Monthly identity themes  
- Yearly cognitive arcs  
- Suggested journal prompts  
- Suggested tasks  

---

# 11. IndexedDB Schema

Tables:
- `coach_insights` (cognitive subset)  

Indexes:
- `insight_type`  
- `source_module`  
- `created_at`  

---

# 12. Future Enhancements

- Cognitive trajectory forecasting  
- Identity modeling  
- Multi‑modal cognitive detection (voice, images)  
- Cognitive–behavioral loops  
- Personalized cognitive training plans  

---

# 13. Summary

The Cognitive Engine is the thinking‑pattern intelligence layer of Life.OS. It detects distortions, strengths, identity themes, and reframes — helping users understand how they think and how their thinking evolves. Through deep integration with Life.Coach, the Life Graph, and the Life Timeline, the Cognitive Engine provides powerful insights that support long‑term personal growth.
