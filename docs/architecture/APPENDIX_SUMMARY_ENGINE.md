# APPENDIX_SUMMARY_ENGINE.md  
**Summary Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Summary Engine generates concise, meaningful, context‑aware summaries of entries, tasks, habits, insights, Life Moments, reviews, and long‑term patterns. It transforms raw data into clear, human‑readable overviews that support reflection, planning, and understanding across Life.OS.

## Purpose

The engine helps the user quickly grasp the essence of their experiences, patterns, and progress. It condenses complex emotional, cognitive, behavioral, and conceptual information into summaries that are accurate, supportive, and aligned with the user’s identity and goals.

---

## Summary Architecture

The engine uses a layered architecture:

- **Signal layer** — collects emotional, cognitive, behavioral, and contextual signals  
- **Extraction layer** — identifies key points, themes, and events  
- **Compression layer** — condenses information while preserving meaning  
- **Context layer** — adapts summaries to the user’s current state  
- **Narrative layer** — frames summaries in a coherent, human‑friendly way  
- **Integration layer** — connects summaries to reviews, insights, and Life Moments  

This architecture ensures summaries are both concise and meaningful.

---

## Summary Data Model

The engine stores:

- **summary_id**  
- **summary_type** — entry, day, week, month, year, concept, pattern, arc  
- **summary_text**  
- **key_points** — extracted highlights  
- **supporting_signals** — insights, context states, concepts, Life Moments  
- **tone_metadata** — neutral, supportive, reflective, clarifying  
- **compression_ratio** — how much information was condensed  
- **relevance_score**  

Summaries evolve based on user preferences and patterns.

---

## Summary Types

The engine generates summaries for:

- **Entries** — concise overviews of journal content  
- **Tasks** — progress summaries and bottleneck highlights  
- **Habits** — streak summaries and consistency patterns  
- **Insights** — grouped insight summaries  
- **Life Moments** — narrative summaries of significant events  
- **Daily reviews** — emotional, cognitive, and behavioral highlights  
- **Weekly reviews** — patterns, cycles, and progress  
- **Monthly reviews** — conceptual evolution and habit arcs  
- **Yearly reviews** — identity themes and life chapters  
- **Concept clusters** — summaries of conceptual themes  
- **Arcs and patterns** — summaries of long‑term trends  

Each summary type uses different extraction and compression rules.

---

## Key Point Extraction

The engine identifies:

- Emotional highlights  
- Cognitive clarity or load  
- Habit consistency or collapse  
- Productivity cycles  
- Emerging concepts or themes  
- Identity‑related signals  
- Context shifts  
- Life Moments  
- Goal progress or obstacles  

Extraction uses semantic clustering, temporal analysis, and signal weighting.

---

## Compression and Condensation

The engine condenses information by:

- Removing redundancy  
- Prioritizing high‑impact signals  
- Grouping related concepts  
- Simplifying phrasing  
- Preserving emotional and conceptual nuance  
- Maintaining narrative coherence  

Compression is adaptive and context‑aware.

---

## Summary Tone

Tone adapts based on:

- Emotional state  
- Cognitive load  
- Personality traits  
- Identity themes  
- Time of day  
- Review type  

Tone categories include:

- **Neutral** — factual and concise  
- **Supportive** — gentle and encouraging  
- **Reflective** — thoughtful and exploratory  
- **Clarifying** — focused on insight and understanding  
- **Narrative** — storytelling for reviews and Life Moments  

Tone ensures summaries feel attuned and helpful.

---

## Summary Integration

Summaries appear in:

- Entry previews  
- Daily/weekly/monthly/yearly reviews  
- Life Moments  
- Concept clusters  
- Timeline views  
- Notifications  
- Recommendations  
- Reflection prompts  

Summaries help the user navigate and understand their data.

---

## Summary Insights

The engine generates insights such as:

- summary_opportunity_detected  
- key_point_cluster_detected  
- emotional_summary_recommended  
- cognitive_summary_recommended  
- conceptual_summary_recommended  
- narrative_summary_recommended  
- summary_pattern_detected  

These insights support the Life Coach and Review Engine.

---

## Summary Evolution

The engine adapts over time based on:

- Which summaries the user reads  
- Which summaries they skip  
- Writing patterns in entries  
- Identity and conceptual evolution  
- Emotional and cognitive cycles  
- Habit and productivity rhythms  

Summaries become increasingly personalized.

---

## Integration With Other Engines

The Summary Engine integrates with:

- **Review Engine** — structured summaries for all review types  
- **Life Coach** — narrative framing and meaning-making  
- **Identity Engine** — identity‑aligned summaries  
- **Personality Engine** — tone and communication style  
- **Goal Engine** — goal‑aligned summaries  
- **Routine Engine** — routine summaries  
- **Context Engine** — state‑aware summary adaptation  
- **Knowledge Engine** — conceptual summaries  
- **Timeline Engine** — arc and chapter summaries  

Summaries are a core interpretive layer across Life.OS.

---

## Privacy and Safety

The engine ensures:

- Summaries remain fully local  
- No external analysis or profiling  
- No prescriptive or therapeutic claims  
- Full user control over visibility and redaction  
- Summary insights are optional and user‑controlled  

Summaries support clarity, not judgment.

---

## Performance

The engine is optimized for:

- Low‑latency summarization  
- Efficient signal aggregation  
- Scalable long‑term modeling  
- Adaptive tone and compression  

It supports years of data without degradation.

---

## Summary

The Summary Engine transforms raw data into concise, meaningful, context‑aware summaries that support reflection, planning, and understanding. It powers reviews, insights, Life Moments, and navigation across the entire Life.OS ecosystem.
