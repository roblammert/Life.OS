# APPENDIX_ARCHITECTURE_GLOSSARY.md  
**Architecture Glossary — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This glossary defines the core terms, concepts, engines, data structures, and intelligence components used throughout the Life.OS architecture. It provides a shared vocabulary for understanding how the system works, how modules interact, and how intelligence flows across the platform.

---

## Core System Terms

### Life.OS  
The unified personal operating system that integrates journaling, tasks, habits, notes, routines, reviews, intelligence engines, and a local AI coach into a single, privacy‑preserving ecosystem.

### Module  
A functional component of Life.OS (e.g., Entries, Tasks, Habits, Notes, Reviews). Modules store data and provide user‑facing features.

### Engine  
A computational subsystem that performs analysis, modeling, or intelligence work (e.g., Emotional Engine, Goal Engine, Identity Engine). Engines operate on data from modules and other engines.

### Intelligence Layer  
The collection of engines that generate insights, recommendations, reflections, summaries, and long‑term patterns.

### Local AI  
All intelligence runs locally on the user’s device using WebLLM and local embeddings. No cloud inference or external data sharing.

---

## Data and Modeling Terms

### Entry  
A journal entry or note written by the user. The richest data object in the system.

### Task  
A unit of work with status, priority, and optional due dates.

### Habit  
A recurring behavior tracked over time with streaks and consistency metrics.

### Insight  
A system‑generated observation about emotional, cognitive, behavioral, contextual, or conceptual patterns.

### Life Moment  
A significant event or shift detected by the system, anchored on the timeline.

### Review  
A structured summary of a period (daily, weekly, monthly, yearly) with insights, patterns, and recommendations.

### Embedding  
A vector representation of text, concepts, or objects used for semantic search and clustering.

### Concept  
A semantic idea extracted from entries, tasks, habits, or insights.

### Theme  
A higher‑level conceptual cluster representing recurring ideas or identity patterns.

### Pattern  
A recurring emotional, cognitive, behavioral, or conceptual signal.

### Arc  
A long‑term trajectory or curve (emotional, cognitive, behavioral, conceptual, identity).

### Chapter  
A major life phase identified through conceptual, emotional, and behavioral shifts.

### Memory Record  
A long‑term identity or behavioral pattern stored by the Memory Engine.

---

## System Architecture Terms

### Event  
A structured signal representing a change in the system (entry created, task completed, habit updated, insight generated).

### Event Engine  
The central event bus that captures, normalizes, and dispatches events across all modules and engines.

### Timeline Engine  
The subsystem that organizes all events into a chronological narrative with arcs, chapters, and context overlays.

### Search Engine  
Provides keyword, semantic, concept, graph, and context‑aware search across all data.

### Indexing Engine  
Maintains keyword, semantic, temporal, graph, and metadata indexes for fast retrieval.

### Graph Engine  
Manages the Life Graph: nodes (concepts, themes, patterns) and edges (relationships).

### Knowledge Engine  
Extracts concepts, themes, and conceptual clusters from entries and insights.

### Context Engine  
Models real‑time emotional, cognitive, behavioral, productivity, environmental, and social context.

### Review Engine  
Generates daily, weekly, monthly, and yearly reviews using multi‑engine signals.

### Life Coach  
The orchestrator that synthesizes insights, recommendations, reflections, summaries, and Life Moments.

---

## Intelligence Engine Terms

### Emotional Engine  
Analyzes emotional intensity, valence, variability, and patterns.

### Cognitive Engine  
Analyzes clarity, load, reasoning mode, and cognitive cycles.

### Habit Engine  
Models habit consistency, streaks, and behavioral arcs.

### Productivity Engine  
Analyzes focus cycles, bottlenecks, and task patterns.

### Personality Engine  
Models stable traits, tendencies, communication style, and motivational drivers.

### Identity Engine  
Models values, roles, identity themes, narratives, chapters, and long‑term arcs.

### Goal Engine  
Models explicit, implicit, and identity‑aligned goals across time horizons.

### Routine Engine  
Models daily and weekly rhythms, routines, and stabilizers.

### Reflection Engine  
Generates context‑aware reflection prompts and questions.

### Summary Engine  
Generates concise, meaningful summaries of entries, patterns, and reviews.

### Alignment Engine  
Evaluates coherence across values, identity, goals, behaviors, routines, and context.

### Recommendation Engine  
Generates personalized, context‑aware suggestions for actions, habits, reflections, and improvements.

---

## Context and State Terms

### Emotional State  
Current emotional intensity, valence, and variability.

### Cognitive State  
Current clarity, load, and reasoning mode.

### Productivity State  
Current focus, energy, and bottleneck patterns.

### Behavioral State  
Current habit and routine patterns.

### Environmental Context  
Location, time of day, device, and environmental cues.

### Social Context  
People, relationships, and social patterns referenced in entries or tasks.

---

## Workflow Terms

### Trigger  
An event or condition that activates an automation or insight.

### Condition  
A rule that must be met for an automation or recommendation to run.

### Action  
A system behavior triggered by an event or condition (e.g., generate insight, send notification).

### Notification  
A user‑facing message containing insights, reminders, or recommendations.

### Automation  
A user‑defined or system‑suggested workflow that reacts to events.

---

## Privacy and Safety Terms

### Local‑Only Processing  
All intelligence runs on the user’s device. No cloud inference.

### Redaction  
User‑controlled removal of sensitive data from insights, reviews, or summaries.

### Visibility  
Controls whether an object is private, protected, shared, or redacted.

### Schema Version  
Ensures compatibility across updates and migrations.

---

## Summary

This glossary defines the shared vocabulary of Life.OS. It provides clarity across modules, engines, data structures, and intelligence layers—ensuring the entire architecture remains coherent, extensible, and understandable as the system evolves.
