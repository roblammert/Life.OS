# APPENDIX_MODULE_SPEC_TEMPLATES.md  
**Module Specification Templates Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix provides reusable templates for defining new Life.OS modules. Every module—journal, notes, tasks, habits, spreadsheets, or future additions—follows a consistent architectural pattern. These templates ensure clarity, maintainability, and alignment with the Life.OS intelligence ecosystem.

---

# 1. Purpose of Module Specification Templates

Module specs ensure:

- Consistent structure across modules  
- Predictable data models  
- Clear event flows  
- Seamless integration with intelligence engines  
- Easy onboarding for contributors  
- Future‑proof extensibility  

Each template includes data models, events, UI structure, intelligence hooks, and retention rules.

---

# 2. Module Specification Template (General)

This template applies to any new module.

## Module Name
Short description of the module’s purpose.

## Goals
- What the module enables  
- What problems it solves  
- How it integrates with Life.OS  

## Data Model
```
table_name: string
fields: id: string created_at: number updated_at: number ...module_specific_field
```

### Indexes
- List of indexed fields  
- Rationale for each index  

### Example Record
```
{ id: "item_123", created_at: 1712345678901, updated_at: 1712345678901, ...fields }
```

---

# 3. Event Specification Template

## Events Emitted
- event_type  
- description  
- payload structure  

### Example
```
event: item_created payload: id: string module: string timestamp: number
```

## Event Consumers
- Emotional Engine  
- Cognitive Engine  
- Habit Engine  
- Productivity Engine  
- Knowledge Engine  
- Context Engine  
- Graph Engine  
- Timeline Engine  
- Notification Engine  
- Review Engine  

---

# 4. Intelligence Integration Template

## Insight Hooks
- What insights the module can generate  
- What metadata is extracted  
- How embeddings are generated  

## Graph Hooks
- Node type  
- Edge types  
- Cluster behavior  

## Timeline Hooks
- Timeline event types  
- Rendering rules  

## Notification Hooks
- Notification types  
- Trigger conditions  

---

# 5. UI Specification Template

## Views
- List of screens/views  
- Purpose of each view  

## Components
- Reusable components  
- Component responsibilities  

## Interactions
- User actions  
- Keyboard shortcuts  
- Mobile gestures  

## Accessibility
- Required ARIA roles  
- Keyboard navigation  
- High‑contrast mode behavior  

---

# 6. Retention & Privacy Template

## Retention Rules
- Auto‑delete options  
- Default retention  
- Strict mode behavior  

## Privacy Rules
- Sensitive fields  
- Encryption requirements  
- Export behavior  

---

# 7. Sync Specification Template (Optional)

## Sync Scope
- What fields sync  
- What fields never sync  

## Conflict Rules
- Field‑level merge  
- Last‑write‑wins  
- Manual resolution (future)  

## Backend Requirements
- Endpoints  
- Payload structure  

---

# 8. Testing Template

## Unit Tests
- Functions to test  
- Edge cases  

## Integration Tests
- Module ↔ Intelligence  
- Module ↔ Graph  
- Module ↔ Timeline  

## UI Tests
- Navigation  
- Editing  
- Rendering  

## E2E Tests
- Full workflows  

---

# 9. Example: Habit Module Spec (Filled Template)

## Module Name
Habits — track routines and behavioral patterns.

## Goals
- Track habit performance  
- Detect streaks  
- Identify habit loops  
- Correlate habits with emotions and productivity  

## Data Model
```
table: habits
fields:
 id: string name:
  string
  icon: string 
  created_at: number 
  updated_at: number 
  streak: number 
  last_performed: number
```

### Indexes
- `last_performed` — streak detection  
- `name` — search  

---

## Events Emitted
- habit_created  
- habit_updated  
- habit_event_logged  
- habit_streak_continued  
- habit_streak_broken  

---

## Intelligence Integration

### Insight Hooks
- habit_pattern_detected  
- habit_correlation_detected  
- habit_breakthrough  

### Graph Hooks
- habit node  
- influences edges  

### Timeline Hooks
- habit_event_logged  
- habit_streak_continued  

### Notification Hooks
- habit_reminder  
- habit_streak_continued  

---

## UI Specification

### Views
- Habit list  
- Habit detail  
- Habit log view  

### Components
- Habit card  
- Streak bar  
- Habit log button  

### Interactions
- Tap to log  
- Long‑press to edit  

---

## Retention & Privacy
- Auto‑delete logs after X days (optional)  
- Habits not encrypted by default  
- Logs encrypted if strict mode enabled  

---

## Sync Specification
- Sync habit definitions  
- Do not sync habit logs (optional)  

---

## Testing
- Streak logic  
- Habit loop detection  
- Habit ↔ emotion correlation  

---

# 10. Summary

This appendix provides standardized templates for defining new Life.OS modules. By following these templates, developers ensure consistency across data models, events, intelligence integration, UI structure, retention rules, sync behavior, and testing. This creates a coherent, extensible ecosystem where new modules can be added without architectural drift.
