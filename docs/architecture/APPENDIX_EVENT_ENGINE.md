Here is **APPENDIX_EVENT_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown, matching the exact formatting you’ve been using and ending with your separator.

---

# APPENDIX_EVENT_ENGINE.md  
**Event Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Event Engine manages the creation, normalization, categorization, and propagation of events across Life.OS. It acts as the central event bus, ensuring that all modules—intelligence engines, UI, automations, notifications, graph, analytics, and storage—receive consistent, structured signals whenever something meaningful happens in the system.

## Purpose

The Event Engine provides a unified, reliable mechanism for broadcasting changes. It ensures that when the user writes an entry, completes a task, updates a habit, experiences a context shift, or triggers an automation, every relevant engine receives the event in a structured, predictable format.

## Event Architecture

The engine uses a layered architecture:

- **Capture layer** — receives raw events from user actions, engines, plugins  
- **Normalization layer** — converts raw events into standardized event objects  
- **Categorization layer** — assigns event types and metadata  
- **Dispatch layer** — routes events to subscribed modules  
- **Logging layer** — stores events for analytics and debugging  
- **Rate‑limit layer** — prevents event storms  

This architecture ensures consistency and reliability.

## Event Data Model

The engine stores:

- **event_id** — unique identifier  
- **event_type** — entry_created, task_completed, habit_updated, insight_generated, etc.  
- **source** — user, engine, plugin, automation  
- **payload** — structured metadata  
- **timestamp**  
- **priority** — low, normal, high  
- **context_snapshot** — emotional, cognitive, productivity, and temporal metadata  
- **dispatch_log** — which modules received the event  

Events are immutable once created.

## Event Types

The engine supports a wide range of event categories:

- **Entry events** — created, updated, deleted  
- **Task events** — created, completed, postponed, updated  
- **Habit events** — incremented, streak reset, consistency updated  
- **Insight events** — generated, updated  
- **Life Moment events** — detected, updated  
- **Review events** — generated, published  
- **Context events** — shift detected, arc updated  
- **Graph events** — node created, edge created, cluster updated  
- **Embedding events** — embedding created, cluster updated  
- **Automation events** — triggered, executed, failed  
- **Notification events** — delivered, dismissed, snoozed  
- **Plugin events** — installed, enabled, disabled  
- **System events** — startup, shutdown, sync, backup  

Each event type includes a standardized payload schema.

## Event Normalization

The engine normalizes raw events by:

- Assigning a canonical event type  
- Extracting metadata  
- Attaching timestamps  
- Capturing context state  
- Validating payload structure  
- Ensuring compatibility with the Unified Data Model  

Normalization ensures all modules receive consistent data.

## Event Dispatching

The engine routes events to:

- Intelligence engines  
- UI Engine  
- Automation Engine  
- Notification Engine  
- Graph Engine  
- Analytics Engine  
- Storage Engine  
- Plugin Engine  
- Memory Engine  

Dispatching is asynchronous and non‑blocking.

## Event Subscriptions

Modules can subscribe to:

- Specific event types  
- Event categories  
- Pattern‑based subscriptions  
- Context‑aware subscriptions  
- Priority‑based subscriptions  

Subscriptions are declared statically or dynamically.

## Event Prioritization

Events are prioritized based on:

- **User actions** — highest priority  
- **Context shifts** — high priority  
- **Insights** — medium priority  
- **Background updates** — low priority  
- **Batch operations** — lowest priority  

Priority affects dispatch order and rate‑limiting.

## Event Logging

The engine logs:

- Event creation  
- Event dispatch  
- Module responses  
- Errors or failures  
- Rate‑limit triggers  

Logs support debugging, analytics, and transparency.

## Event Rate Limiting

To prevent overload, the engine enforces:

- **Per‑module rate limits**  
- **Global event caps**  
- **Batching of low‑priority events**  
- **Backpressure mechanisms**  

This ensures stability even during high activity.

## Event Replay

The engine supports replaying events for:

- Debugging  
- Rebuilding the graph  
- Recomputing embeddings  
- Regenerating analytics  
- Plugin initialization  

Replay respects privacy and visibility rules.

## Integration With Other Engines

The Event Engine integrates with:

- **Storage Engine** — persists events  
- **Automation Engine** — triggers workflows  
- **Notification Engine** — sends alerts  
- **Graph Engine** — updates nodes and edges  
- **Analytics Engine** — computes metrics  
- **Life Coach** — generates insights  
- **Review Engine** — aggregates events into reviews  
- **Context Engine** — updates context state  
- **Plugin Engine** — provides event hooks  

The Event Engine is the backbone of system reactivity.

## Performance

The engine is optimized for:

- Low‑latency dispatch  
- Efficient batching  
- Scalable event throughput  
- Minimal overhead for idle modules  
- Real‑time responsiveness  

It supports years of event history without degradation.

## Summary

The Event Engine is the central nervous system of Life.OS. It captures, normalizes, categorizes, and dispatches events across all modules, enabling real‑time intelligence, automation, analytics, and UI updates.
