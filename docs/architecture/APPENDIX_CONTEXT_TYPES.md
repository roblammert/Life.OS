# APPENDIX_CONTEXT_TYPES.md  
**Context Types Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix catalogs all context types used by the Context Engine. Context is a foundational intelligence layer in Life.OS, enabling the system to understand *when*, *how*, and *why* the user is operating in a particular state. Context powers suggestions, prompts, notifications, insights, and cross‑module intelligence.

---

# 1. Purpose of the Context Engine

The Context Engine enables Life.OS to:

- Understand the user’s current emotional, cognitive, behavioral, and productivity state  
- Detect temporal patterns and rhythms  
- Provide context‑aware suggestions  
- Trigger smart notifications  
- Enhance Life Moments and insights  
- Improve semantic search relevance  
- Personalize journaling prompts and task recommendations  

Context is computed locally, never sent to the cloud, and always user‑controlled.

---

# 2. Context Data Model

### Structure
```
{ time_context: object, emotional_context: object, cognitive_context: object, behavioral_context: object, productivity_context: object, knowledge_context: object, environmental_context: object (future), composite_context: object }
```

### Stored In
Context is **not** stored permanently. It is computed on demand and cached in memory.

---

# 3. Time‑Based Context

Time context captures temporal patterns.

### time_of_day
- morning  
- afternoon  
- evening  
- night  

### day_of_week
- weekday  
- weekend  
- specific day patterns  

### date_context
- holidays  
- anniversaries  
- personal milestones  

### recency_context
- last entry time  
- last task completion  
- last habit event  

### streak_context
- journaling streak  
- habit streak  
- productivity streak  

**Used for:**  
- task suggestions  
- journaling prompts  
- habit reminders  
- productivity cycle detection  

---

# 4. Emotional Context

Emotional context captures the user’s current emotional state.

### mood_state
- positive  
- neutral  
- negative  

### emotional_intensity
0–1 scale

### emotional_granularity
0–1 scale

### emotional_trend
- rising  
- falling  
- stable  

### emotional_weather
Short‑term emotional climate.

### emotional_trigger_context
Topics or habits affecting mood.

**Used for:**  
- emotional prompts  
- journaling suggestions  
- habit correlations  
- Life Moments  

---

# 5. Cognitive Context

Cognitive context captures thinking patterns.

### cognitive_distortion_state
Presence of distortions.

### cognitive_theme
Recurring cognitive patterns.

### identity_context
Self‑descriptions and identity themes.

### cognitive_shift_context
Recent reframes or breakthroughs.

**Used for:**  
- cognitive prompts  
- reframing suggestions  
- Life Moments  
- review generation  

---

# 6. Behavioral Context

Behavioral context captures routines and habits.

### habit_state
- active  
- inactive  
- forming  
- breaking  

### habit_streak_state
- continuing  
- broken  
- restarting  

### routine_context
Patterns in daily behavior.

### behavioral_trigger_context
Situations preceding behaviors.

**Used for:**  
- habit suggestions  
- routine insights  
- behavioral Life Moments  

---

# 7. Productivity Context

Productivity context captures task‑related patterns.

### productivity_state
- high  
- medium  
- low  

### procrastination_state
- rising  
- falling  
- stable  

### energy_state
0–1 scale

### productivity_cycle
Daily/weekly rhythms.

### project_context
Active or stalled projects.

**Used for:**  
- task suggestions  
- productivity prompts  
- project momentum insights  

---

# 8. Knowledge Context

Knowledge context captures conceptual and topic‑based patterns.

### concept_focus
Most active concepts.

### topic_focus
Most active topics.

### knowledge_evolution_state
- emerging  
- stabilizing  
- shifting  

### knowledge_gap_context
Underdeveloped areas.

**Used for:**  
- note prompts  
- concept suggestions  
- topic evolution insights  

---

# 9. Environmental Context (Future)

Planned future context types.

### location_context
Home, work, travel.

### device_context
Phone, tablet, desktop.

### weather_context
Weather patterns affecting mood or productivity.

### social_context
People mentioned frequently.

**Used for:**  
- environmental prompts  
- location‑aware habits  
- social insights  

---

# 10. Composite Context

Composite context merges multiple context types.

### emotional_productivity_context
Mood ↔ productivity relationship.

### cognitive_emotional_context
Thinking ↔ emotion relationship.

### habit_emotion_context
Habits ↔ mood relationship.

### knowledge_emotion_context
Topics ↔ emotional state.

### multi_context_state
A combined state across 3+ dimensions.

**Used for:**  
- cross‑module insights  
- Life Moments  
- advanced suggestions  
- review synthesis  

---

# 11. Context‑Driven Suggestions

Context powers:

- Journaling prompts  
- Task recommendations  
- Habit suggestions  
- Note prompts  
- Emotional/cognitive nudges  
- Productivity guidance  
- Review highlights  
- Smart notifications  

Suggestions always include:

- Context type  
- Reasoning  
- Suggested action  

---

# 12. Summary

This appendix defines all context types used by the Context Engine. By standardizing temporal, emotional, cognitive, behavioral, productivity, knowledge, and composite contexts, Life.OS gains a powerful, extensible foundation for context‑aware intelligence, suggestions, insights, and Life Moments.
