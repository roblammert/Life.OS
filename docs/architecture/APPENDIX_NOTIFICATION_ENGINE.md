Here is **APPENDIX_NOTIFICATION_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown, matching the exact formatting you’ve been using and ending with your separator.

---

# APPENDIX_NOTIFICATION_ENGINE.md  
**Notification Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Notification Engine manages all user-facing alerts, reminders, prompts, and nudges across Life.OS. It ensures that insights, tasks, habits, reviews, and context-aware coaching reach the user at the right time, in the right way, without overwhelming or distracting them.

## Purpose

The Notification Engine provides a unified, intelligent system for delivering timely and meaningful notifications. It balances usefulness with minimal interruption, adapting to user preferences, context, and behavioral patterns.

## Notification Architecture

The engine uses a layered architecture:

- **Event layer** — receives triggers from all engines  
- **Relevance layer** — scores importance and urgency  
- **Context layer** — evaluates timing, focus, emotional state  
- **Delivery layer** — chooses channel and format  
- **Rate‑limit layer** — prevents overload  
- **Preference layer** — respects user settings  

This architecture ensures notifications are helpful, not intrusive.

## Notification Data Model

The engine stores:

- **notification_id** — unique identifier  
- **notification_type** — reminder, insight, review, habit, task, context shift  
- **content** — text or structured payload  
- **source_engine** — which engine generated it  
- **urgency** — low, medium, high  
- **relevance_score** — computed from context and metadata  
- **delivery_channel** — in‑app, widget, system notification  
- **timestamp_created**  
- **timestamp_delivered**  
- **dismissed**, **snoozed**, or **acted_on** flags  

## Notification Types

The engine supports multiple categories:

- **Task reminders** — due dates, overdue tasks, priority tasks  
- **Habit reminders** — scheduled habits, streak protection  
- **Insight notifications** — emotional, cognitive, productivity insights  
- **Life Moment alerts** — significant events detected  
- **Review notifications** — daily, weekly, monthly, yearly reviews  
- **Context-aware prompts** — focus windows, overload detection  
- **Automation notifications** — workflow results or confirmations  
- **Graph or concept notifications** — theme emergence, conceptual shifts  

Each type uses different relevance and timing rules.

## Relevance Scoring

Notifications are scored using:

- **Urgency** — deadlines, emotional spikes, context shifts  
- **Importance** — habit streaks, major insights, Life Moments  
- **Context fit** — time of day, focus level, emotional state  
- **User behavior** — responsiveness, dismissal patterns  
- **Historical patterns** — when the user prefers to engage  

Low‑relevance notifications may be batched or suppressed.

## Context-Aware Delivery

The engine adapts notifications based on:

- **Emotional state** — avoid sending demanding prompts during distress  
- **Cognitive load** — avoid complex insights during overload  
- **Productivity state** — avoid interruptions during deep focus  
- **Time of day** — respect sleep and quiet hours  
- **Location** — optional, if enabled  
- **Device** — desktop vs. mobile vs. wearable  

This ensures notifications feel supportive, not disruptive.

## Delivery Channels

The engine supports:

- **In‑app banners**  
- **System notifications**  
- **Lock‑screen summaries**  
- **Widgets**  
- **Daily digest emails (optional)**  
- **Review cards**  
- **Automation confirmations**  

Users can customize channels per notification type.

## Rate Limiting

To prevent overload, the engine enforces:

- **Global rate limits** — max notifications per hour/day  
- **Category limits** — e.g., only one emotional insight per hour  
- **Context limits** — suppress during deep focus or distress  
- **Batching** — combine low‑urgency notifications into digests  
- **Quiet hours** — user-defined or automatically inferred  

Rate limits adapt to user behavior.

## Notification Lifecycle

The engine manages:

- **Creation** — triggered by engines or automations  
- **Scoring** — relevance and urgency  
- **Scheduling** — immediate or delayed  
- **Delivery** — chosen channel  
- **User interaction** — dismiss, snooze, act  
- **Feedback loop** — update relevance models  

All interactions improve future notification quality.

## Integration With Other Engines

The Notification Engine integrates with:

- **Task Engine** — due dates, priority tasks  
- **Habit Engine** — streak protection, habit reminders  
- **Emotional Engine** — emotional insights and warnings  
- **Cognitive Engine** — clarity or overload prompts  
- **Productivity Engine** — focus windows, bottleneck alerts  
- **Context Engine** — context-aware timing  
- **Life Coach** — insight and Life Moment delivery  
- **Review Engine** — review availability  
- **Automation Engine** — workflow results  

Notifications are the primary user-facing output of many engines.

## Performance

The engine is optimized for:

- Low-latency delivery  
- Efficient batching  
- Minimal battery and CPU usage  
- Scalable notification volume  
- Real-time context evaluation  

It ensures timely delivery without draining resources.

## Summary

The Notification Engine ensures that Life.OS communicates intelligently with the user. It delivers insights, reminders, reviews, and context-aware prompts in a timely, meaningful, and non-intrusive way, adapting to the user’s behavior, preferences, and current state.
