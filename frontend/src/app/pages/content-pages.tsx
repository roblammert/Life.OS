import { type FormEvent, useState } from "react";
import { useLifeOs } from "../life-os-provider";
import { downloadContent } from "../../core/utils";

export function JournalPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [moodTagInput, setMoodTagInput] = useState("");
  const [titleTemplate, setTitleTemplate] = useState("Daily Reflection");
  const [onlyMoodTagged, setOnlyMoodTagged] = useState(false);
  const [minWordCount, setMinWordCount] = useState(0);
  const [maxWordCount, setMaxWordCount] = useState(0);
  const journalTemplates = [
    "What went well today?",
    "What challenged me today?",
    "What is one next action for tomorrow?",
  ];
  const exportFilteredMarkdown = () => {
    if (displayedEntries.length === 0) return;
    const markdown = displayedEntries.map((entry) => `## ${entry.title}\n\n${entry.contentMarkdown}\n`).join("\n");
    downloadContent(markdown, "life-os-journal-filtered.md", "text/markdown");
  };
  const exportFilteredCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = displayedEntries.map((entry) =>
      [entry.id, escape(entry.title), escape(entry.contentMarkdown), entry.sentimentScore.toFixed(2), entry.createdAt].join(","),
    );
    downloadContent(["id,title,content,sentiment,createdAt", ...rows].join("\n"), "life-os-journal-filtered.csv", "text/csv");
  };
  const exportVisibleTitlesTxt = () => {
    downloadContent(displayedEntries.map((entry) => entry.title).join("\n"), "life-os-journal-titles.txt", "text/plain");
  };
  const exportSentimentSummaryJson = () => {
    downloadContent(
      JSON.stringify({ averageSentiment, sentimentDistribution, visibleEntries: displayedEntries.length }, null, 2),
      "life-os-journal-sentiment-summary.json",
      "application/json",
    );
  };
  const exportVisibleEntriesJson = () => {
    downloadContent(JSON.stringify(displayedEntries, null, 2), "life-os-journal-visible.json", "application/json");
  };
  const exportVisibleEntryIdsTxt = () => {
    downloadContent(displayedEntries.map((entry) => entry.id).join("\n"), "life-os-journal-visible-ids.txt", "text/plain");
  };
  const exportVisibleWordCountsCsv = () => {
    const rows = displayedEntries.map((entry) => `${entry.id},"${entry.title.replaceAll('"', '""')}",${entry.contentMarkdown.split(/\s+/).filter(Boolean).length}`);
    downloadContent(["id,title,wordCount", ...rows].join("\n"), "life-os-journal-word-counts.csv", "text/csv");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    actions.createJournalEntry({ title: title.trim(), contentMarkdown: content.trim() });
    setTitle("");
    setContent("");
  };

  const displayedEntries = snapshot.journalEntries
    .filter((entry) => {
      const textMatch =
        search.trim() === "" ||
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.contentMarkdown.toLowerCase().includes(search.toLowerCase());
      if (!textMatch) return false;
      if (onlyMoodTagged && !entry.contentMarkdown.includes("#")) return false;
      const wordCount = entry.contentMarkdown.split(/\s+/).filter(Boolean).length;
      if (wordCount < minWordCount) return false;
      if (maxWordCount > 0 && wordCount > maxWordCount) return false;
      if (sentimentFilter === "all") return true;
      if (sentimentFilter === "positive") return entry.sentimentScore > 0.15;
      if (sentimentFilter === "negative") return entry.sentimentScore < -0.15;
      return entry.sentimentScore >= -0.15 && entry.sentimentScore <= 0.15;
    })
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const averageSentiment =
    displayedEntries.length > 0
      ? displayedEntries.reduce((acc, entry) => acc + entry.sentimentScore, 0) / displayedEntries.length
      : 0;
  const totalVisibleWords = displayedEntries.reduce(
    (acc, entry) => acc + entry.contentMarkdown.split(/\s+/).filter(Boolean).length,
    0,
  );
  const estimatedReadMinutes = totalVisibleWords / 200;
  const sentimentDistribution = displayedEntries.reduce(
    (acc, entry) => {
      if (entry.sentimentScore > 0.15) acc.positive += 1;
      else if (entry.sentimentScore < -0.15) acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );

  return (
    <section>
      <h2>Life.Journal</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" />
        <div className="cards">
          <select value={titleTemplate} onChange={(event) => setTitleTemplate(event.target.value)}>
            <option value="Daily Reflection">Daily Reflection</option>
            <option value="Weekly Check-in">Weekly Check-in</option>
            <option value="Energy Log">Energy Log</option>
          </select>
          <button type="button" onClick={() => setTitle(titleTemplate)}>
            Use Title Template
          </button>
        </div>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="Write your entry..." />
        <div className="cards">
          {journalTemplates.map((template) => (
            <button key={template} type="button" onClick={() => setContent((current) => `${current}${current ? "\n\n" : ""}${template}`)}>
              Add Template
            </button>
          ))}
          <input value={moodTagInput} onChange={(event) => setMoodTagInput(event.target.value)} placeholder="Mood tag (e.g. grateful)" />
          <button type="button" onClick={() => setContent((current) => `${current}${current ? "\n\n" : ""}#${moodTagInput.trim().toLowerCase()}`)} disabled={!moodTagInput.trim()}>
            Add Mood Tag
          </button>
        </div>
        <button type="submit">Save Entry</button>
      </form>
      <div className="cards">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search journal entries"
        />
        <select value={sentimentFilter} onChange={(event) => setSentimentFilter(event.target.value as typeof sentimentFilter)}>
          <option value="all">All sentiment</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <input
          type="number"
          min={0}
          value={minWordCount}
          onChange={(event) => setMinWordCount(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Min words"
        />
        <input
          type="number"
          min={0}
          value={maxWordCount}
          onChange={(event) => setMaxWordCount(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Max words (0=none)"
        />
        <button type="button" onClick={exportFilteredMarkdown} disabled={displayedEntries.length === 0}>
          Export Filtered Markdown
        </button>
        <button type="button" onClick={exportFilteredCsv} disabled={displayedEntries.length === 0}>
          Export Filtered CSV
        </button>
        <button type="button" onClick={exportVisibleTitlesTxt} disabled={displayedEntries.length === 0}>
          Export Visible Titles TXT
        </button>
        <button type="button" onClick={exportSentimentSummaryJson} disabled={displayedEntries.length === 0}>
          Export Sentiment Summary JSON
        </button>
        <button type="button" onClick={exportVisibleEntriesJson} disabled={displayedEntries.length === 0}>
          Export Visible JSON
        </button>
        <button type="button" onClick={exportVisibleEntryIdsTxt} disabled={displayedEntries.length === 0}>
          Export Visible IDs TXT
        </button>
        <button type="button" onClick={exportVisibleWordCountsCsv} disabled={displayedEntries.length === 0}>
          Export Word Counts CSV
        </button>
        <button type="button" onClick={() => setOnlyMoodTagged((current) => !current)}>
          {onlyMoodTagged ? "Show All Entries" : "Only Mood-Tagged"}
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(displayedEntries.map((entry) => entry.title).join("\n"))} disabled={displayedEntries.length === 0}>
          Copy Visible Titles
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(displayedEntries.map((entry) => entry.id).join("\n"))} disabled={displayedEntries.length === 0}>
          Copy Visible IDs
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(JSON.stringify(sentimentDistribution))} disabled={displayedEntries.length === 0}>
          Copy Sentiment Summary
        </button>
        <button type="button" onClick={() => { setSearch(""); setSentimentFilter("all"); }}>
          Reset Filters
        </button>
        <button type="button" onClick={() => { setTitle(""); setContent(""); setMoodTagInput(""); }}>
          Clear Draft
        </button>
        <article className="card">Visible entries: {displayedEntries.length}</article>
        <article className="card">Visible words: {totalVisibleWords}</article>
        <article className="card">Estimated read time: {estimatedReadMinutes.toFixed(1)} min</article>
        <article className="card">Average sentiment: {averageSentiment.toFixed(2)}</article>
        <article className="card">
          Sentiment + / ~ / - : {sentimentDistribution.positive} / {sentimentDistribution.neutral} / {sentimentDistribution.negative}
        </article>
      </div>
      <ul className="stack">
        {displayedEntries.map((entry) => (
          <li key={entry.id} className="card">
            <strong>{entry.title}</strong>
            <p>{entry.contentMarkdown}</p>
            <p>Words: {entry.contentMarkdown.split(/\s+/).filter(Boolean).length}</p>
            <p>
              Sentiment: {entry.sentimentScore.toFixed(2)}{" "}
              ({entry.sentimentScore > 0.15 ? "positive" : entry.sentimentScore < -0.15 ? "negative" : "neutral"})
            </p>
            <button type="button" onClick={() => { setTitle(`${entry.title} (copy)`); setContent(entry.contentMarkdown); }}>
              Load Into Draft
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NotesPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "words_desc">("newest");
  const [previewMode, setPreviewMode] = useState(false);
  const [quickTag, setQuickTag] = useState("");
  const [minTagCount, setMinTagCount] = useState(0);
  const [onlyChecklist, setOnlyChecklist] = useState(false);
  const [onlyTagged, setOnlyTagged] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);
    actions.createNote({ title: title.trim(), contentMarkdown: content.trim(), tags });
    setTitle("");
    setContent("");
    setTagsInput("");
  };

  const displayedNotes = snapshot.notes.filter((note) => {
    const tagMatch = !tagFilter.trim() || note.tags.some((tag) => tag.includes(tagFilter.trim().toLowerCase()));
    const textMatch =
      !search.trim() ||
      note.title.toLowerCase().includes(search.trim().toLowerCase()) ||
      note.contentMarkdown.toLowerCase().includes(search.trim().toLowerCase());
    const minTagMatch = note.tags.length >= minTagCount;
    const checklistMatch = !onlyChecklist || note.contentMarkdown.includes("- [");
    const taggedMatch = !onlyTagged || note.tags.length > 0;
    return tagMatch && textMatch && minTagMatch && checklistMatch && taggedMatch;
  }).sort((a, b) => {
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "words_desc") {
      return b.contentMarkdown.split(/\s+/).filter(Boolean).length - a.contentMarkdown.split(/\s+/).filter(Boolean).length;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const uniqueTagCount = new Set(displayedNotes.flatMap((note) => note.tags)).size;
  const topTags = Object.entries(
    displayedNotes.flatMap((note) => note.tags).reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const visibleWords = displayedNotes.reduce((acc, note) => acc + note.contentMarkdown.split(/\s+/).filter(Boolean).length, 0);
  const exportFilteredNotesMarkdown = () => {
    const content = displayedNotes.map((note) => `## ${note.title}\n\n${note.contentMarkdown}\n`).join("\n");
    downloadContent(content, "life-os-notes-filtered.md", "text/markdown");
  };
  const exportFilteredNotesJson = () => {
    downloadContent(JSON.stringify(displayedNotes, null, 2), "life-os-notes-filtered.json", "application/json");
  };
  const exportTagCountsJson = () => {
    downloadContent(JSON.stringify(Object.fromEntries(topTags), null, 2), "life-os-notes-tag-counts.json", "application/json");
  };
  const exportTopTagsTxt = () => {
    downloadContent(topTags.map(([tag, count]) => `${tag}: ${count}`).join("\n"), "life-os-notes-top-tags.txt", "text/plain");
  };
  const exportVisibleTitlesTxt = () => {
    downloadContent(displayedNotes.map((note) => note.title).join("\n"), "life-os-notes-visible-titles.txt", "text/plain");
  };
  const exportVisibleIdsTxt = () => {
    downloadContent(displayedNotes.map((note) => note.id).join("\n"), "life-os-notes-visible-ids.txt", "text/plain");
  };
  const exportChecklistTitlesTxt = () => {
    const titles = displayedNotes.filter((note) => note.contentMarkdown.includes("- [")).map((note) => note.title);
    downloadContent(titles.join("\n"), "life-os-notes-checklist-titles.txt", "text/plain");
  };
  const checklistCount = displayedNotes.filter((note) => note.contentMarkdown.includes("- [")).length;

  const createTaskFromNote = (noteTitle: string, noteContent: string) => {
    actions.createTask({
      title: `Follow up: ${noteTitle}`,
      description: noteContent.slice(0, 220),
      priority: "medium",
    });
  };

  return (
    <section>
      <h2>Life.Notes</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="Write your note..." />
        <input
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="Tags (comma-separated)"
        />
        <button type="submit">Save Note</button>
      </form>
      <div className="cards">
        <input
          value={tagFilter}
          onChange={(event) => setTagFilter(event.target.value)}
          placeholder="Filter notes by tag"
        />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes" />
        <input
          type="number"
          min={0}
          value={minTagCount}
          onChange={(event) => setMinTagCount(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Min tag count"
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title</option>
          <option value="words_desc">Word count</option>
        </select>
        <button type="button" onClick={exportFilteredNotesMarkdown} disabled={displayedNotes.length === 0}>
          Export Filtered Markdown
        </button>
        <button type="button" onClick={exportFilteredNotesJson} disabled={displayedNotes.length === 0}>
          Export Visible JSON
        </button>
        <button type="button" onClick={exportTagCountsJson} disabled={topTags.length === 0}>
          Export Tag Counts JSON
        </button>
        <button type="button" onClick={exportTopTagsTxt} disabled={topTags.length === 0}>
          Export Top Tags TXT
        </button>
        <button type="button" onClick={exportVisibleTitlesTxt} disabled={displayedNotes.length === 0}>
          Export Visible Titles TXT
        </button>
        <button type="button" onClick={exportVisibleIdsTxt} disabled={displayedNotes.length === 0}>
          Export Visible IDs TXT
        </button>
        <button type="button" onClick={exportChecklistTitlesTxt} disabled={checklistCount === 0}>
          Export Checklist Titles TXT
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(displayedNotes.map((note) => note.title).join("\n"))} disabled={displayedNotes.length === 0}>
          Copy Visible Titles
        </button>
        <button type="button" onClick={() => setOnlyChecklist((current) => !current)}>
          {onlyChecklist ? "Show All Notes" : "Only Checklist Notes"}
        </button>
        <button type="button" onClick={() => setOnlyTagged((current) => !current)}>
          {onlyTagged ? "Show All Notes" : "Only Tagged Notes"}
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(topTags.map(([tag, count]) => `${tag}:${count}`).join("\n"))} disabled={topTags.length === 0}>
          Copy Top Tags
        </button>
        <button type="button" onClick={() => setPreviewMode((current) => !current)}>
          {previewMode ? "Hide Preview" : "Show Preview"}
        </button>
        <input value={quickTag} onChange={(event) => setQuickTag(event.target.value)} placeholder="Quick tag append" />
        <button type="button" onClick={() => { setTagFilter(""); setSearch(""); setSortBy("newest"); setMinTagCount(0); setOnlyChecklist(false); setOnlyTagged(false); }}>
          Reset Filters
        </button>
        <article className="card">Visible notes: {displayedNotes.length}</article>
        <article className="card">Unique tags: {uniqueTagCount}</article>
        <article className="card">Visible words: {visibleWords}</article>
        <article className="card">Checklist notes: {checklistCount}</article>
      </div>
      <ul className="stack">
        {displayedNotes.map((note) => (
          <li key={note.id} className="card">
            <strong>{note.title}</strong>
            <p>{note.contentMarkdown}</p>
            {previewMode ? <pre>{note.contentMarkdown}</pre> : null}
            <p>Words: {note.contentMarkdown.split(/\s+/).filter(Boolean).length}</p>
            {note.tags.length > 0 ? <p>Tags: {note.tags.join(", ")}</p> : null}
            <button type="button" onClick={() => void navigator.clipboard?.writeText(note.contentMarkdown)}>
              Copy Content
            </button>
            <button
              type="button"
              onClick={() =>
                actions.createNote({
                  title: note.title,
                  contentMarkdown: note.contentMarkdown,
                  tags: [...note.tags, quickTag.trim().toLowerCase()].filter((tag) => tag.length > 0),
                })
              }
              disabled={!quickTag.trim()}
            >
              Append Tag Copy
            </button>
            <button onClick={() => createTaskFromNote(note.title, note.contentMarkdown)}>
              Create Task from Note
            </button>
          </li>
        ))}
      </ul>
      <article className="card">
        Top tags: {topTags.map(([tag, count]) => `${tag} (${count})`).join(", ") || "none"}
      </article>
    </section>
  );
}
