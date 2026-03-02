import { FormEvent, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { LifeOsProvider, useLifeOs } from "./app/life-os-provider";
import type { TaskPriority } from "./core/types";

function Layout() {
  const { snapshot, actions } = useLifeOs();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>Life.OS</h1>
        <button onClick={actions.syncNow}>
          Sync: {snapshot.syncStatus.state}
          {snapshot.syncStatus.lastSyncedAt ? ` (${new Date(snapshot.syncStatus.lastSyncedAt).toLocaleTimeString()})` : ""}
        </button>
      </header>

      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/storage">Storage</Link>
        <Link to="/coach">Coach</Link>
        <Link to="/timeline">Timeline</Link>
        <Link to="/graph">Graph</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardPage() {
  const { snapshot } = useLifeOs();
  return (
    <section>
      <h2>Dashboard</h2>
      <div className="cards">
        <article className="card">Journal Entries: {snapshot.journalEntries.length}</article>
        <article className="card">Notes: {snapshot.notes.length}</article>
        <article className="card">Tasks: {snapshot.tasks.length}</article>
        <article className="card">Workbooks: {snapshot.workbooks.length}</article>
      </div>
    </section>
  );
}

function JournalPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    actions.createJournalEntry({ title: title.trim(), contentMarkdown: content.trim() });
    setTitle("");
    setContent("");
  };

  return (
    <section>
      <h2>Life.Journal</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" />
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="Write your entry..." />
        <button type="submit">Save Entry</button>
      </form>
      <ul className="stack">
        {snapshot.journalEntries.map((entry) => (
          <li key={entry.id} className="card">
            <strong>{entry.title}</strong>
            <p>{entry.contentMarkdown}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotesPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    actions.createNote({ title: title.trim(), contentMarkdown: content.trim() });
    setTitle("");
    setContent("");
  };

  return (
    <section>
      <h2>Life.Notes</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="Write your note..." />
        <button type="submit">Save Note</button>
      </form>
      <ul className="stack">
        {snapshot.notes.map((note) => (
          <li key={note.id} className="card">
            <strong>{note.title}</strong>
            <p>{note.contentMarkdown}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TasksPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    actions.createTask({
      title: title.trim(),
      description: description.trim(),
      priority,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <section>
      <h2>Life.Assistant</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Task details" />
        <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Create Task</button>
      </form>
      <ul className="stack">
        {snapshot.tasks.map((task) => (
          <li key={task.id} className="card">
            <strong>{task.title}</strong> — {task.status} ({task.priority})
            <p>{task.description}</p>
            {task.status !== "done" ? <button onClick={() => actions.completeTask(task.id)}>Mark Done</button> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function StoragePage() {
  const { snapshot, actions } = useLifeOs();
  const [name, setName] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [metricValue, setMetricValue] = useState("0");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !metricLabel.trim()) return;
    actions.createWorkbook({
      name: name.trim(),
      metricLabel: metricLabel.trim(),
      metricValue: Number(metricValue) || 0,
    });
    setName("");
    setMetricLabel("");
    setMetricValue("0");
  };

  return (
    <section>
      <h2>Life.Storage</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Workbook name" />
        <input value={metricLabel} onChange={(event) => setMetricLabel(event.target.value)} placeholder="Metric label" />
        <input value={metricValue} onChange={(event) => setMetricValue(event.target.value)} type="number" placeholder="Metric value" />
        <button type="submit">Create Workbook</button>
      </form>
      <ul className="stack">
        {snapshot.workbooks.map((workbook) => (
          <li key={workbook.id} className="card">
            <strong>{workbook.name}</strong>
            <ul>
              {workbook.metrics.map((metric) => (
                <li key={metric.id}>
                  {metric.label}: {metric.value}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CoachPage() {
  const { snapshot } = useLifeOs();
  return (
    <section>
      <h2>Life.Coach Insights</h2>
      <ul className="stack">
        {snapshot.insights.map((insight) => (
          <li key={insight.id} className="card">
            <strong>{insight.sourceModule}</strong>: {insight.content}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TimelinePage() {
  const { snapshot } = useLifeOs();
  return (
    <section>
      <h2>Timeline</h2>
      <ul className="stack">
        {snapshot.timeline.map((event) => (
          <li key={event.id} className="card">
            {event.timestamp} — {event.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

function GraphPage() {
  const { snapshot } = useLifeOs();
  return (
    <section>
      <h2>Life Graph</h2>
      <p>Nodes: {snapshot.graphNodes.length} | Edges: {snapshot.graphEdges.length}</p>
      <ul className="stack">
        {snapshot.graphNodes.map((node) => (
          <li key={node.id} className="card">
            [{node.type}] {node.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SettingsPage() {
  return (
    <section>
      <h2>Settings</h2>
      <p>Theme, sync interval, and export/import controls will be added here.</p>
    </section>
  );
}

export default function App() {
  return (
    <LifeOsProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LifeOsProvider>
  );
}
