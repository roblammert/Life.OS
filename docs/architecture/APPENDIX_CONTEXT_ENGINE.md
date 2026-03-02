Here is **APPENDIX_CONTEXT_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown.  
No code fences.  
No commentary.  
Ends with your exact separator.

---

# APPENDIX_CONTEXT_ENGINE.md  
**Context Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Context Engine unifies temporal, emotional, cognitive, behavioral, environmental, and productivity signals into a single contextual model. It provides the real‑time situational awareness layer that powers adaptive insights, personalized coaching, and intelligent system behavior across Life.OS.

## Purpose

The Context Engine determines *what is happening right now* in the user’s life by synthesizing signals from all modules. It enables Life.OS to understand patterns, anticipate needs, and generate insights that are relevant to the user’s current state, not just historical data.

## Context Data Model

The engine produces structured context metadata:

- **temporal_context** — time of day, day of week, season, recency  
- **emotional_context** — current emotional state and recent shifts  
- **cognitive_context** — clarity, cognitive load, reasoning mode  
- **behavioral_context** — habits, routines, streaks, recent actions  
- **productivity_context** — focus, energy, task flow state  
- **environment_context** — location, device, activity window  
- **social_context** — people referenced, relationship patterns  
- **context_shift** — significant change in any dimension  
- **context_arc** — short-term trend classification  

## Context Processing Pipeline

### Temporal Context
- Detects time‑of‑day patterns  
- Identifies weekday vs. weekend behavior  
- Tracks recency of entries, tasks, habits  
- Detects seasonal patterns  

### Emotional Context
- Integrates Emotional Engine outputs  
- Tracks emotional arcs  
- Detects emotional triggers  
- Identifies emotional volatility  

### Cognitive Context
- Integrates Cognitive Engine outputs  
- Tracks clarity and cognitive load  
- Detects reasoning mode  
- Identifies cognitive bottlenecks  

### Behavioral Context
- Integrates Habit Engine outputs  
- Tracks streaks and routines  
- Detects habit triggers  
- Identifies behavioral drift  

### Productivity Context
- Integrates Productivity Engine outputs  
- Tracks focus and energy  
- Detects bottlenecks  
- Identifies productivity arcs  

### Environmental Context
- Tracks device usage patterns  
- Tracks location patterns (if enabled)  
- Detects context switches  

### Output Generation
- Context metadata  
- Context insights  
- Context Life Moments  

## Context Categories

The engine uses standardized context states:

- Stable  
- Volatile  
- Overloaded  
- Recovering  
- Focused  
- Drifting  
- Energized  
- Low‑energy  
- Emotionally charged  
- Cognitively strained  

Each state includes indicators from multiple engines.

## Context Insights

The engine generates structured insights:

- context_shift_detected  
- context_pattern_detected  
- overload_detected  
- recovery_detected  
- focus_window_detected  
- emotional_context_change  
- cognitive_context_change  
- productivity_context_change  

Each insight includes context metadata, contributing signals, and a confidence score.

## Context Life Moments

Triggered when:

- A major context shift occurs  
- A long period of overload ends  
- A new stable pattern emerges  
- A significant emotional‑cognitive interaction appears  
- A major productivity or habit shift occurs  

Life Moments include a description, context metadata, related entries, and a timeline anchor.

## Context Arcs

The engine identifies arcs:

- Stabilizing  
- Destabilizing  
- Recovering  
- Declining  
- Improving  
- Volatile  

Arcs appear in daily, weekly, monthly, and yearly reviews.

## Context Correlations

The engine correlates context with:

- Emotional states  
- Cognitive states  
- Habits  
- Tasks  
- Productivity  
- Concepts  
- People  
- Locations  

These correlations feed insights, Life Moments, graph edges, and review summaries.

## Context Graph Integration

The engine creates:

### Nodes
- context_state  
- context_pattern  
- context_shift  
- context_arc  

### Edges
- influenced_by  
- correlates_with  
- triggered_by  
- associated_with  

This enables context‑aware semantic search and pattern detection.

## Context Timeline Integration

The engine adds:

- Context events  
- Context arcs  
- Context Life Moments  
- Context summaries  

Timeline rendering includes context bars, stability indicators, and context arc overlays.

## Performance

The engine is optimized for real‑time updates, low‑latency context scoring, and incremental processing. It supports continuous context awareness without blocking user interactions.

## Summary

The Context Engine synthesizes emotional, cognitive, behavioral, productivity, and temporal signals into a unified situational model. It powers adaptive insights, personalized coaching, Life Moments, reviews, and the Life Graph.
