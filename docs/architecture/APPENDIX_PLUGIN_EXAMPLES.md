# APPENDIX_PLUGIN_EXAMPLES.md  
**Plugin Examples — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix provides reference implementations of plugins to demonstrate best practices.

---

# 1. Example: Fitness Tracker Plugin

## Manifest
```
{ "id": "plugin.fitness", "name": "Fitness Tracker", "version": "1.0.0", "entrypoint": "main.js", "permissions": [ "storage.write", "timeline.write", "graph.write", "ui.panels" ] }
```

## Entrypoint
```
export function onActivate(lifeOS) { lifeOS.ui.registerPanel("fitnessPanel", FitnessPanel) }
```

## Timeline Event
```
lifeOS.timeline.addEvent({ type: "fitness_session_logged", timestamp: Date.now(), metadata: { duration: 45 } })
```

---

# 2. Example: Concept Highlighter Plugin

## Manifest
```
{ "id": "plugin.concepts", "name": "Concept Highlighter", "version": "1.0.0", "entrypoint": "main.js", "permissions": [ "storage.read", "graph.write", "insights.generate" ] }
```

## Insight Generation
```
lifeOS.insights.create( "concept_detected", "Detected concept: resilience", { concept: "resilience" } )
```

---

# 3. Example: Custom Dashboard Plugin

## Manifest
```
{ "id": "plugin.dashboard", "name": "Custom Dashboard", "version": "1.0.0", "entrypoint": "main.js", "permissions": ["ui.panels"] }
```

## UI Panel
```
lifeOS.ui.registerPanel("customDashboard", DashboardComponent)
```

---

# 4. Summary

These examples illustrate how plugins interact with storage, graph, timeline, insights, and UI APIs while respecting sandbox and permission boundaries.
