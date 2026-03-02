Here is **APPENDIX_HABIT_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown, matching the exact format you approved and ending with your separator.

---

# APPENDIX_HABIT_ENGINE.md  
**Habit Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Habit Engine detects, tracks, and analyzes habits, routines, and behavioral patterns across Life.OS. It integrates data from tasks, journaling, timeline events, and user-defined habits to understand consistency, streaks, triggers, and long-term behavioral trends.

## Purpose

The Habit Engine provides the behavioral intelligence layer of Life.OS. It identifies patterns in user behavior, detects emerging habits, evaluates consistency, and generates insights about routines, triggers, and long-term change.

## Habit Data Model

The engine produces structured habit metadata:

- **habit_id** — unique identifier  
- **habit_name** — user-defined or system-detected  
- **habit_type** — binary, duration-based, count-based, qualitative  
- **frequency** — daily, weekly, monthly, custom  
- **streak** — current streak length  
- **longest_streak** — historical maximum  
- **consistency_score** — normalized 0–1 score  
- **habit_strength** — weak → strong  
- **habit_trigger** — contextual trigger (time, location, emotion, task)  
- **habit_context** — metadata describing when/why it occurs  
- **habit_arc** — improving, declining, stable  

## Habit Detection Pipeline

### Preprocessing
- Parse tasks, timeline events, and journal entries  
- Extract behavioral signals  
- Identify repeated patterns  

### Pattern Detection
- Frequency clustering  
- Time-of-day clustering  
- Day-of-week clustering  
- Contextual clustering (emotion, location, people)  

### Habit Identification
- Detect emerging habits  
- Confirm recurring behaviors  
- Merge similar patterns  
- Assign habit type  

### Habit Evaluation
- Calculate streaks  
- Calculate consistency  
- Detect habit strength  
- Detect habit decay  

### Output Generation
- Habit metadata  
- Habit insights  
- Habit Life Moments  

## Habit Categories

The engine supports multiple habit types:

- **Binary habits** — done/not done  
- **Duration habits** — minutes/hours  
- **Count habits** — repetitions  
- **Qualitative habits** — mood, clarity, energy  
- **System-detected habits** — inferred from behavior  

## Habit Insights

The engine generates structured insights:

- habit_streak_started  
- habit_streak_broken  
- habit_consistency_improving  
- habit_consistency_declining  
- habit_trigger_detected  
- habit_decay_detected  
- habit_breakthrough  
- habit_regression  

Each insight includes habit metadata, contextual metadata, and a confidence score.

## Habit Life Moments

Triggered when:

- A major streak milestone is reached  
- A long streak is broken  
- A new habit emerges  
- A habit collapses  
- A habit breakthrough occurs  

Life Moments include a description, habit metadata, related entries, and a timeline anchor.

## Habit Arcs

The engine identifies arcs:

- Strengthening  
- Weakening  
- Stable  
- Volatile  
- Recovering  
- Declining  

Arcs appear in daily, weekly, monthly, and yearly reviews.

## Habit Correlations

The engine correlates habits with:

- Emotional states  
- Cognitive states  
- Productivity  
- Tasks  
- Concepts  
- People  
- Locations  

These correlations feed insights, Life Moments, graph edges, and review summaries.

## Habit Graph Integration

The engine creates:

### Nodes
- habit  
- habit_pattern  
- habit_trigger  
- habit_arc  

### Edges
- triggered_by  
- associated_with  
- improves  
- worsens  
- correlates_with  

This enables habit-based semantic search and behavioral modeling.

## Habit Timeline Integration

The engine adds:

- Habit events  
- Streak markers  
- Habit arcs  
- Habit Life Moments  
- Habit summaries  

Timeline rendering includes streak bars, consistency indicators, and habit arc overlays.

## Performance

The engine is optimized for incremental updates, low-latency pattern detection, and background processing. It supports real-time streak updates and habit detection.

## Summary

The Habit Engine models user behavior over time, identifying habits, routines, and patterns. It powers habit insights, streak tracking, Life Moments, reviews, and the Life Graph.
