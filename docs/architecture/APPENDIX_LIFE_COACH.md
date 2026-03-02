Here is **APPENDIX_LIFE_COACH.md** in clean, copy‑and‑paste‑ready Markdown, following the exact formatting you approved and ending with your separator.

---

# APPENDIX_LIFE_COACH.md  
**Life Coach — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Life Coach is the intelligence orchestrator of Life.OS. It synthesizes emotional, cognitive, behavioral, productivity, contextual, and conceptual signals to generate insights, reflections, recommendations, and Life Moments. It acts as the narrative and interpretive layer that helps the user understand themselves and grow intentionally.

## Purpose

The Life Coach transforms raw metadata from all engines into meaningful guidance. It identifies patterns, highlights important changes, explains why things happened, and supports personal development through reflective prompts and contextual coaching.

## Core Responsibilities

The Life Coach performs several high‑level functions:

- Generate insights across emotional, cognitive, habit, productivity, and contextual domains  
- Detect Life Moments and determine their significance  
- Produce daily, weekly, monthly, and yearly reviews  
- Provide contextual coaching based on the user’s current state  
- Maintain long‑term understanding of identity themes and life chapters  
- Integrate with the Life Graph to understand relationships between concepts, behaviors, and emotions  

## Life Coach Data Model

The engine produces structured coaching metadata:

- **insight_id** — unique identifier  
- **insight_type** — emotional, cognitive, habit, productivity, contextual, conceptual  
- **insight_text** — natural‑language explanation  
- **supporting_evidence** — metadata from other engines  
- **confidence_score** — 0–1 scale  
- **life_moment_flag** — whether the insight qualifies as a Life Moment  
- **life_moment_type** — breakthrough, low point, shift, milestone  
- **review_relevance** — daily, weekly, monthly, yearly  

## Insight Generation Pipeline

### Signal Aggregation
- Collect emotional, cognitive, habit, productivity, and context metadata  
- Normalize signals across modules  
- Identify significant changes or anomalies  

### Insight Detection
- Detect emotional shifts  
- Detect cognitive clarity or overload  
- Detect habit breakthroughs or regressions  
- Detect productivity bottlenecks or improvements  
- Detect contextual shifts  
- Detect conceptual breakthroughs  

### Insight Ranking
- Score insights by significance  
- Cluster related insights  
- Determine which insights qualify as Life Moments  

### Insight Narrative Generation
- Generate natural‑language explanations  
- Provide context for why the insight matters  
- Connect insights to long‑term patterns  

## Life Moments

Life Moments are the most meaningful events in the user’s personal development. They represent emotional breakthroughs, cognitive shifts, habit milestones, productivity transformations, or contextual turning points.

### Life Moment Types

- **Emotional Breakthrough** — major emotional shift or recovery  
- **Cognitive Breakthrough** — clarity spike or conceptual insight  
- **Habit Milestone** — streak achievement or habit collapse  
- **Productivity Shift** — major change in focus or energy  
- **Contextual Turning Point** — significant life pattern change  
- **Identity Moment** — theme‑level shift in self‑perception  

### Life Moment Metadata

- moment_id  
- moment_type  
- description  
- contributing_signals  
- related_entries  
- timeline_anchor  
- significance_score  

## Coaching Modes

The Life Coach adapts its behavior based on context:

### Reflective Mode
Used in journaling, reviews, and long‑form entries.  
Focuses on meaning, patterns, and emotional/cognitive interpretation.

### Action Mode
Used when interacting with tasks, habits, or productivity data.  
Focuses on bottlenecks, next steps, and execution clarity.

### Contextual Mode
Used when the Context Engine detects a shift.  
Focuses on situational awareness and adaptive guidance.

### Identity Mode
Used in monthly and yearly reviews.  
Focuses on themes, life chapters, and long‑term growth.

## Coaching Insights

The Life Coach generates insights such as:

- “Your emotional state improved significantly today after a difficult morning.”  
- “You showed strong cognitive clarity during your planning session.”  
- “Your habit consistency is stabilizing after a period of volatility.”  
- “Your productivity bottleneck appears to be emotional rather than logistical.”  
- “A new theme is emerging around personal growth and resilience.”  

Each insight is grounded in metadata from the intelligence engines.

## Integration With Other Engines

### Emotional Engine
- Interprets emotional arcs  
- Detects emotional breakthroughs  
- Provides emotional context for insights  

### Cognitive Engine
- Interprets clarity, reasoning patterns, and cognitive load  
- Detects cognitive breakthroughs  
- Supports conceptual coaching  

### Habit Engine
- Tracks habit strength, streaks, and consistency  
- Detects habit milestones  
- Supports behavioral coaching  

### Productivity Engine
- Tracks focus, energy, and task flow  
- Detects productivity shifts  
- Supports execution coaching  

### Context Engine
- Provides real‑time situational awareness  
- Enables adaptive coaching  

### Knowledge Engine
- Provides conceptual understanding  
- Supports identity‑level insights  

## Review Generation

The Life Coach orchestrates the Review Engine:

- Selects insights for each review  
- Determines narrative structure  
- Highlights Life Moments  
- Identifies arcs and themes  
- Generates reflective prompts  

## Life Graph Integration

The Life Coach uses the Life Graph to:

- Understand relationships between concepts, emotions, habits, and productivity  
- Detect cross‑domain patterns  
- Identify identity themes  
- Support long‑term narrative building  

## Performance

The Life Coach is optimized for:

- Real‑time insight generation  
- Low‑latency contextual coaching  
- Batch review generation  
- Incremental updates to identity themes and life chapters  

## Summary

The Life Coach is the interpretive and narrative intelligence of Life.OS. It synthesizes signals from all engines to generate insights, Life Moments, reviews, and personalized coaching. It helps the user understand themselves, grow intentionally, and navigate their life with clarity and meaning.
