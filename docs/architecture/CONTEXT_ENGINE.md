# CONTEXT_ENGINE.md  
**Context Awareness Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Context Engine is responsible for understanding the user’s temporal, behavioral, emotional, and environmental context in order to deliver intelligent, timely, and relevant insights. It powers context‑aware suggestions, notifications, task recommendations, journaling prompts, and cross‑module intelligence.

This document defines the context model, detection rules, context layers, insight types, data sources, and integration with Life.Coach, the Notification Engine, and the Review System.

---

# 1. Purpose and Responsibilities

The Context Engine helps Life.OS understand **what is happening around and within the user**, enabling more relevant and timely intelligence.

### Core Responsibilities
- Detect temporal context (time of day, day of week, season).
- Detect behavioral context (recent activity, routines).
- Detect emotional context (recent mood patterns).
- Detect cognitive context (recent thinking patterns).
- Detect productivity context (energy cycles, task patterns).
- Provide context to Life.Coach for insight generation.
- Power context‑aware notifications and suggestions.
- Support context‑aware journaling prompts and task recommendations.

### Why Context Awareness?
Context helps Life.OS:
- Suggest the right task at the right time  
- Provide emotionally relevant prompts  
- Detect patterns tied to time or behavior  
- Improve accuracy of insights  
- Personalize the user experience  

---

# 2. Context Data Model

Context is not stored as a single table; instead, it is derived from multiple sources and cached in memory.

### Context Layers
- **Temporal context** — time, date, season  
- **Behavioral context** — recent tasks, habits, routines  
- **Emotional context** — recent mood/emotion patterns  
- **Cognitive context** — recent thinking patterns  
- **Productivity context** — energy cycles, completion patterns  
- **Environmental context** — optional (location, weather)  

### Cached Context Object
```
{ temporal: { ... }, behavioral: { ... }, emotional: { ... }, cognitive: { ... }, productivity: { ... }, environmental: { ... } }
```

---

# 3. Temporal Context

Temporal context is the foundation of context awareness.

### Components
- Time of day (morning, afternoon, evening, night)
- Day of week (weekday vs. weekend)
- Month and season
- Recurring cycles (e.g., “Mondays are low‑energy days”)

### Uses
- Morning task suggestions  
- Evening journaling prompts  
- Weekly review timing  
- Habit detection  
- Productivity cycle detection  

---

# 4. Behavioral Context

Behavioral context is derived from:
- Recent tasks  
- Habit events  
- Routines  
- Notes created  
- Journal entries written  

### Behavioral Signals
- “You’ve been writing more frequently this week.”  
- “You tend to complete tasks in the afternoon.”  
- “Your journaling streak is strong.”  

### Uses
- Habit suggestions  
- Routine reinforcement  
- Task recommendations  

---

# 5. Emotional Context

Emotional context is derived from the Emotional Engine.

### Emotional Signals
- Recent mood  
- Emotional volatility  
- Emotional granularity  
- Emotional triggers  
- Emotional stabilizers  

### Uses
- Emotion‑aware journaling prompts  
- Emotional weather notifications  
- Task suggestions based on emotional state  

---

# 6. Cognitive Context

Cognitive context is derived from the Cognitive Engine.

### Cognitive Signals
- Recent cognitive distortions  
- Strength‑based thinking  
- Identity themes  
- Cognitive shifts  

### Uses
- Cognitive reframes  
- Suggested journal prompts  
- Suggested tasks  
- Life Moments detection  

---

# 7. Productivity Context

Productivity context is derived from the Productivity Engine.

### Productivity Signals
- Energy cycles  
- Task completion patterns  
- Procrastination patterns  
- Project momentum  

### Uses
- Energy‑based task suggestions  
- Productivity notifications  
- Project insights  

---

# 8. Environmental Context (Optional)

Environmental context is optional and privacy‑controlled.

### Possible Signals
- Location (if user enables it)  
- Weather (if user enables it)  
- Device type (phone/tablet/desktop)  

### Uses
- Location‑aware journaling prompts  
- Weather‑aware mood correlations  
- Device‑aware UI adjustments  

---

# 9. Context Detection Pipeline

The Context Engine uses a multi‑stage pipeline.

## Stage 1 — Data Collection
Collect from:
- Journal entries  
- Notes  
- Tasks  
- Habits  
- Timeline events  
- Emotional/Cognitive/Productivity engines  

## Stage 2 — Temporal Analysis
- Time of day  
- Day of week  
- Seasonal patterns  

## Stage 3 — Behavioral Analysis
- Recent actions  
- Routines  
- Streaks  

## Stage 4 — Emotional/Cognitive/Productivity Analysis
- Recent emotional patterns  
- Recent cognitive patterns  
- Recent productivity patterns  

## Stage 5 — Context Assembly
- Merge all context layers  
- Cache in memory  
- Provide to Life.Coach  

---

# 10. Context‑Aware Suggestions

The Context Engine powers:

### Journaling Prompts
- Based on mood  
- Based on time of day  
- Based on recent cognitive patterns  

### Task Suggestions
- Based on energy  
- Based on emotional state  
- Based on recent productivity patterns  

### Note Suggestions
- Based on concept clusters  
- Based on recent topics  

### Habit Suggestions
- Based on routines  
- Based on emotional triggers  

---

# 11. Integration with Notification Engine

Context determines:
- When notifications should be delivered  
- Which notifications are relevant  
- How notifications should be phrased  

Examples:
- “You seem energized this morning — consider tackling a high‑effort task.”  
- “Your mood has been low — here’s a gentle journaling prompt.”  

---

# 12. Integration with Life.Coach

Life.Coach uses context to:
- Generate more accurate insights  
- Personalize reviews  
- Detect Life Moments  
- Provide context‑aware coaching  

---

# 13. Integration with Life Timeline

Context events appear as:
- context_shift_detected  
- energy_cycle_detected  
- emotional_weather_change  
- routine_detected  

Users can explore:
- How context influences behavior  
- How context shifts over time  

---

# 14. Future Enhancements

- Context forecasting  
- Multi‑modal context detection  
- Personalized context models  
- Context‑aware habit loops  
- Context‑aware project planning  

---

# 15. Summary

The Context Engine is the situational intelligence layer of Life.OS. It integrates temporal, emotional, cognitive, behavioral, and productivity signals to deliver deeply personalized insights, suggestions, and notifications. Through integration with Life.Coach, the Notification Engine, and the Review System, it helps Life.OS understand the user’s world and respond intelligently.
