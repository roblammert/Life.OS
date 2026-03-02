Here is **APPENDIX_REVIEW_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown, matching the exact formatting you approved and ending with your separator.

---

# APPENDIX_REVIEW_ENGINE.md  
**Review Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Review Engine generates daily, weekly, monthly, and yearly reviews by synthesizing emotional, cognitive, behavioral, productivity, and contextual signals. It produces narrative summaries, highlights patterns, and identifies Life Moments that define the user’s personal story.

## Purpose

The Review Engine transforms raw metadata from all intelligence engines into coherent, meaningful reflections. It helps the user understand what happened, why it mattered, and how their life is evolving over time.

## Review Types

The engine supports four review levels:

- **Daily Review** — short-term emotional, cognitive, and productivity patterns  
- **Weekly Review** — habit consistency, themes, arcs, and key shifts  
- **Monthly Review** — long-term patterns, breakthroughs, regressions  
- **Yearly Review** — identity themes, major arcs, life chapters  

Each review type uses different data windows, weighting rules, and narrative structures.

## Review Data Model

The engine produces structured review metadata:

- **summary_text** — narrative summary  
- **key_events** — important timeline events  
- **life_moments** — emotional, cognitive, habit, or productivity milestones  
- **patterns_detected** — recurring behaviors or themes  
- **arcs_detected** — emotional, cognitive, habit, productivity arcs  
- **themes_detected** — conceptual or identity themes  
- **recommendations** — optional reflective prompts  
- **review_period** — time window covered  

## Review Processing Pipeline

### Data Aggregation
- Collect entries, tasks, habits, insights, and timeline events  
- Filter by review period  
- Normalize metadata across modules  

### Pattern Detection
- Identify emotional, cognitive, and productivity arcs  
- Detect habit consistency and streaks  
- Identify recurring concepts and themes  
- Detect contextual shifts  

### Life Moment Selection
- Rank Life Moments by significance  
- Select top moments for the review  
- Cluster related moments into themes  

### Narrative Generation
- Generate structured summaries  
- Highlight key patterns  
- Describe arcs and shifts  
- Integrate Life Moments into narrative flow  

### Output Generation
- Review metadata  
- Review narrative  
- Review insights  

## Daily Review Structure

Daily reviews focus on short-term patterns:

- Emotional state and shifts  
- Cognitive clarity and load  
- Productivity and focus  
- Habit performance  
- Key events  
- Suggested focus for tomorrow  

Daily reviews are concise and actionable.

## Weekly Review Structure

Weekly reviews highlight medium-term patterns:

- Habit consistency and streaks  
- Emotional and cognitive arcs  
- Productivity cycles  
- Emerging themes  
- Life Moments  
- Behavioral correlations  

Weekly reviews emphasize progress and course correction.

## Monthly Review Structure

Monthly reviews identify long-term patterns:

- Theme evolution  
- Habit strength changes  
- Emotional and cognitive stability  
- Productivity arcs  
- Major breakthroughs or regressions  
- Identity-related patterns  

Monthly reviews emphasize growth and transformation.

## Yearly Review Structure

Yearly reviews provide a narrative of the user’s year:

- Identity themes  
- Major life chapters  
- Emotional and cognitive evolution  
- Habit and productivity transformations  
- Key Life Moments  
- Conceptual growth  
- Long-term arcs  

Yearly reviews emphasize meaning, identity, and personal story.

## Review Correlations

The engine correlates review content with:

- Emotional states  
- Cognitive states  
- Habits  
- Tasks  
- Productivity  
- Concepts  
- People  
- Locations  

These correlations enrich the narrative and highlight deeper patterns.

## Review Graph Integration

The engine creates:

### Nodes
- review  
- review_theme  
- review_pattern  
- review_arc  

### Edges
- summarizes  
- highlights  
- correlates_with  
- evolves_from  

This enables semantic navigation of life chapters and patterns.

## Review Timeline Integration

The engine adds:

- Review events  
- Review summaries  
- Review arcs  
- Review Life Moments  

Timeline rendering includes review markers and arc overlays.

## Performance

The engine is optimized for batch processing, incremental updates, and efficient narrative generation. It supports real-time daily reviews and scheduled weekly/monthly/yearly reviews.

## Summary

The Review Engine transforms raw life data into meaningful stories. It identifies patterns, arcs, and themes across time, powering daily reflections, weekly insights, monthly transformations, and yearly life chapters.
