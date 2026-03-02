import { FormEvent, useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { LifeOsProvider, useLifeOs } from "./app/life-os-provider";
import type { TaskPriority, TaskStatus } from "./core/types";
import type { GlobalSearchResult } from "./lib/db/indexeddb";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function Layout() {
  const { snapshot, actions } = useLifeOs();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"phone" | "tablet" | "desktop">(() => {
    const width = window.innerWidth;
    if (width < 768) return "phone";
    if (width < 1024) return "tablet";
    return "desktop";
  });
  const [theme, setTheme] = useState<"dark" | "light" | "high-contrast">(() => {
    const saved = localStorage.getItem("life-os-theme");
    if (saved === "light" || saved === "high-contrast" || saved === "dark") return saved;
    return "dark";
  });
  const [authEmail, setAuthEmail] = useState(() => localStorage.getItem("life-os-auth-email") ?? "");
  const isAuthenticated = authEmail.trim().length > 0;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("life-os-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("life-os-auth-email", authEmail);
    } else {
      localStorage.removeItem("life-os-auth-email");
    }
  }, [authEmail, isAuthenticated]);

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      if (width < 768) setLayoutMode("phone");
      else if (width < 1024) setLayoutMode("tablet");
      else setLayoutMode("desktop");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    setResults(await actions.searchGlobal(query));
  };

  const onInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className={`app-shell theme-${theme} layout-${layoutMode}`}>
      <header className="top-bar">
        <h1>Life.OS</h1>
        <button onClick={actions.syncNow}>
          Sync: {snapshot.syncStatus.state}
          {snapshot.syncStatus.lastSyncedAt ? ` (${new Date(snapshot.syncStatus.lastSyncedAt).toLocaleTimeString()})` : ""}
        </button>
        <span>Pending sync ops: {snapshot.syncQueue.length}</span>
        <span>Layout: {layoutMode}</span>
        <span>Auth: {isAuthenticated ? authEmail : "guest"}</span>
        <span className={isOnline ? "status-online" : "status-offline"}>{isOnline ? "Online" : "Offline"}</span>
        {installPrompt ? <button onClick={() => void onInstall()}>Install App</button> : null}
        <button onClick={() => setNotificationOpen((current) => !current)}>
          Notifications ({actions.generateNotifications().length})
        </button>
        {isAuthenticated ? <button onClick={() => setAuthEmail("")}>Logout</button> : null}
        <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </header>
      {notificationOpen ? (
        <aside className="card">
          <h3>Notification Center</h3>
          <ul className="stack">
            {actions.generateNotifications().map((notification) => (
              <li key={notification.id} className="card">
                <strong>{notification.triggerDescription}</strong>
                <p>{notification.message}</p>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      <form className="search-row" onSubmit={onSearch}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Global search across journal, notes, tasks, storage" />
        <button type="submit">Search</button>
      </form>
      {results.length > 0 ? (
        <ul className="stack">
          {results.map((result) => (
            <li key={result.id} className="card">
              <strong>{result.module}</strong> — {result.label}
              <p>{result.preview}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/storage">Storage</Link>
        <Link to="/coach">Coach</Link>
        <Link to="/timeline">Timeline</Link>
        <Link to="/graph">Graph</Link>
        <Link to="/auth/login">Login</Link>
        <Link to="/auth/register">Register</Link>
        <Link to="/export">Export</Link>
        <Link to="/import">Import</Link>
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
          <Route path="/auth/login" element={<AuthLoginPage onLogin={setAuthEmail} />} />
          <Route path="/auth/register" element={<AuthRegisterPage onRegister={setAuthEmail} />} />
          <Route path="/auth/reset" element={<AuthResetPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function AuthLoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onLogin(email.trim());
    setDone(true);
  };

  return (
    <section>
      <h2>Login</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <div className="cards">
        <Link to="/auth/register">Create account</Link>
        <Link to="/auth/reset">Reset password</Link>
      </div>
      {done ? <p>Logged in locally.</p> : null}
    </section>
  );
}

function AuthRegisterPage({ onRegister }: { onRegister: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onRegister(email.trim());
    setDone(true);
  };

  return (
    <section>
      <h2>Register</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
        <button type="submit">Create Account</button>
      </form>
      <div className="cards">
        <Link to="/auth/login">Already have an account?</Link>
      </div>
      {done ? <p>Account created locally and signed in.</p> : null}
    </section>
  );
}

function AuthResetPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section>
      <h2>Password Reset</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <button type="submit">Send Reset Link</button>
      </form>
      {done ? <p>Reset instruction queued locally.</p> : null}
    </section>
  );
}

function DashboardPage() {
  const { snapshot, actions } = useLifeOs();
  const [openTaskCount, setOpenTaskCount] = useState(0);
  const [recentTitles, setRecentTitles] = useState<string[]>([]);
  const [taskStatusCounts, setTaskStatusCounts] = useState<Record<string, number>>({});
  const [moduleActivity, setModuleActivity] = useState<Record<string, number>>({});
  const [overdueCount, setOverdueCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    void (async () => {
      setOpenTaskCount(await actions.listOpenTasks());
      setRecentTitles(await actions.listRecentJournalTitles());
    })();
    const statuses = snapshot.tasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    }, {});
    setTaskStatusCounts(statuses);

    const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const activity = snapshot.timeline.reduce<Record<string, number>>((acc, event) => {
      if (new Date(event.timestamp).getTime() < lastWeek) return acc;
      acc[event.module] = (acc[event.module] ?? 0) + 1;
      return acc;
    }, {});
    setModuleActivity(activity);

    const now = Date.now();
    const next3Days = now + 3 * 24 * 60 * 60 * 1000;
    const overdue = snapshot.tasks.filter(
      (task) => task.dueDate && new Date(task.dueDate).getTime() < now && task.status !== "done",
    ).length;
    const upcoming = snapshot.tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate).getTime() >= now &&
        new Date(task.dueDate).getTime() <= next3Days &&
        task.status !== "done",
    ).length;
    setOverdueCount(overdue);
    setUpcomingCount(upcoming);
  }, [actions, snapshot]);

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="cards">
        <article className="card">Journal Entries: {snapshot.journalEntries.length}</article>
        <article className="card">Notes: {snapshot.notes.length}</article>
        <article className="card">Tasks: {snapshot.tasks.length}</article>
        <article className="card">Workbooks: {snapshot.workbooks.length}</article>
        <article className="card">Open Tasks (DB query): {openTaskCount}</article>
        <article className="card">Overdue Tasks: {overdueCount}</article>
        <article className="card">Due in 3 Days: {upcomingCount}</article>
      </div>
      <h3>Recent Journal Entries (DB query)</h3>
      <ul className="stack">
        {recentTitles.map((title) => (
          <li key={title} className="card">
            {title}
          </li>
        ))}
      </ul>
      <h3>Task Status Breakdown</h3>
      <ul className="stack">
        {Object.entries(taskStatusCounts).map(([status, count]) => (
          <li key={status} className="card">
            {status}: {count}
          </li>
        ))}
      </ul>
      <h3>7-Day Module Activity</h3>
      <ul className="stack">
        {Object.entries(moduleActivity).map(([module, count]) => (
          <li key={module} className="card">
            {module}: {count} events
          </li>
        ))}
      </ul>
      <h3>Coach Digest</h3>
      <ul className="stack">
        {snapshot.insights.slice(0, 3).map((insight) => (
          <li key={insight.id} className="card">
            <strong>{insight.sourceModule}</strong>: {insight.content}
          </li>
        ))}
      </ul>
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
  const [dueDate, setDueDate] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    actions.createTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || undefined,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <section>
      <h2>Life.Assistant</h2>
      <div className="cards">
        <select value={viewMode} onChange={(event) => setViewMode(event.target.value as typeof viewMode)}>
          <option value="list">List View</option>
          <option value="kanban">Kanban View</option>
        </select>
      </div>
      <form className="stack" onSubmit={onSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Task details" />
        <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <button type="submit">Create Task</button>
      </form>
      {viewMode === "list" ? (
        <ul className="stack">
          {snapshot.tasks.map((task) => (
            <li key={task.id} className="card">
              <strong>{task.title}</strong> — {task.status} ({task.priority})
              <p>{task.description}</p>
              <p>Due: {task.dueDate ?? "n/a"}</p>
              <select
                value={task.status}
                onChange={(event) => actions.updateTaskStatus(task.id, event.target.value as TaskStatus)}
              >
                <option value="todo">todo</option>
                <option value="in_progress">in_progress</option>
                <option value="blocked">blocked</option>
                <option value="done">done</option>
              </select>
            </li>
          ))}
        </ul>
      ) : (
        <div className="kanban">
          {(["todo", "in_progress", "blocked", "done"] as const).map((status) => (
            <section key={status} className="card">
              <h3>{status.replace("_", " ")}</h3>
              <ul className="stack">
                {snapshot.tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <li key={task.id} className="card">
                      <strong>{task.title}</strong> ({task.priority})
                      <p>{task.description}</p>
                      <p>Due: {task.dueDate ?? "n/a"}</p>
                      <select
                        value={task.status}
                        onChange={(event) => actions.updateTaskStatus(task.id, event.target.value as TaskStatus)}
                      >
                        <option value="todo">todo</option>
                        <option value="in_progress">in_progress</option>
                        <option value="blocked">blocked</option>
                        <option value="done">done</option>
                      </select>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}
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
            <form
              className="stack"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const data = new FormData(form);
                const label = String(data.get("metricLabel") ?? "").trim();
                const value = Number(data.get("metricValue") ?? 0);
                if (!label) return;
                actions.addWorkbookMetric(workbook.id, label, value);
                form.reset();
              }}
            >
              <input name="metricLabel" placeholder="New metric label" />
              <input name="metricValue" type="number" placeholder="New metric value" />
              <button type="submit">Add Metric</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CoachPage() {
  const { snapshot, actions } = useLifeOs();
  const [notifications, setNotifications] = useState<ReturnType<typeof actions.generateNotifications>>([]);
  const [review, setReview] = useState<ReturnType<typeof actions.generateReview> | null>(null);

  useEffect(() => {
    setNotifications(actions.generateNotifications());
  }, [actions, snapshot.insights]);

  return (
    <section>
      <h2>Life.Coach Insights</h2>
      <div className="cards">
        <button onClick={() => setReview(actions.generateReview("daily"))}>Generate Daily Review</button>
        <button onClick={() => setReview(actions.generateReview("weekly"))}>Generate Weekly Review</button>
      </div>
      {review ? (
        <article className="card">
          <h3>{review.period === "daily" ? "Daily Review" : "Weekly Review"}</h3>
          <p>{review.summary}</p>
          <ul>
            {review.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </article>
      ) : null}
      <h3>Notification Center</h3>
      <ul className="stack">
        {notifications.map((notification) => (
          <li key={notification.id} className="card">
            <strong>{notification.triggerDescription}</strong>
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
      <h3>Insights</h3>
      <ul className="stack">
        {snapshot.insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </ul>
    </section>
  );
}

function InsightCard({ insight }: { insight: ReturnType<typeof useLifeOs>["snapshot"]["insights"][number] }) {
  const moduleLabels: Record<string, string> = {
    journal: "Life.Journal",
    notes: "Life.Notes",
    tasks: "Life.Assistant",
    storage: "Life.Storage",
  };
  return (
    <li className="card">
      <p>
        <strong>{moduleLabels[insight.sourceModule] ?? insight.sourceModule}</strong>
      </p>
      <p>{insight.content}</p>
      {insight.actions.length > 0 ? (
        <ul>
          {insight.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      ) : null}
      {insight.promptUsed ? (
        <details>
          <summary>Prompt</summary>
          <pre>{insight.promptUsed}</pre>
        </details>
      ) : null}
    </li>
  );
}

function TimelinePage() {
  const { snapshot } = useLifeOs();
  const [moduleFilter, setModuleFilter] = useState<"all" | "journal" | "notes" | "tasks" | "storage">("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | "created" | "updated" | "completed">("all");
  const [timelineView, setTimelineView] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [textFilter, setTextFilter] = useState("");

  const filtered = snapshot.timeline.filter((event) => {
    const moduleMatch = moduleFilter === "all" || event.module === moduleFilter;
    const typeMatch = eventTypeFilter === "all" || event.eventType === eventTypeFilter;
    const textMatch = textFilter.trim() === "" || event.title.toLowerCase().includes(textFilter.toLowerCase());
    return moduleMatch && typeMatch && textMatch;
  });
  const toWeekBucket = (timestamp: string): string => {
    const date = new Date(timestamp);
    const weekDate = new Date(date.getTime());
    weekDate.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(Date.UTC(weekDate.getFullYear(), 0, 1));
    const weekNo = Math.ceil((((weekDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${weekDate.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  };
  const toBucket = (timestamp: string): string => {
    if (timelineView === "daily") return timestamp.slice(0, 10);
    if (timelineView === "weekly") return toWeekBucket(timestamp);
    if (timelineView === "monthly") return timestamp.slice(0, 7);
    return timestamp.slice(0, 4);
  };
  const groupedCounts = filtered.reduce<Record<string, number>>((acc, event) => {
    const bucket = toBucket(event.timestamp);
    acc[bucket] = (acc[bucket] ?? 0) + 1;
    return acc;
  }, {});
  const moduleCounts = filtered.reduce<Record<string, number>>((acc, event) => {
    acc[event.module] = (acc[event.module] ?? 0) + 1;
    return acc;
  }, {});
  const topBuckets = Object.entries(groupedCounts)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 5);
  const topModules = Object.entries(moduleCounts).sort((a, b) => b[1] - a[1]);

  return (
    <section>
      <h2>Timeline</h2>
      <div className="cards">
        <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value as typeof moduleFilter)}>
          <option value="all">All modules</option>
          <option value="journal">Journal</option>
          <option value="notes">Notes</option>
          <option value="tasks">Tasks</option>
          <option value="storage">Storage</option>
        </select>
        <select value={eventTypeFilter} onChange={(event) => setEventTypeFilter(event.target.value as typeof eventTypeFilter)}>
          <option value="all">All event types</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="completed">Completed</option>
        </select>
        <select value={timelineView} onChange={(event) => setTimelineView(event.target.value as typeof timelineView)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input value={textFilter} onChange={(event) => setTextFilter(event.target.value)} placeholder="Filter by text" />
      </div>
      <div className="cards">
        <article className="card">Filtered events: {filtered.length}</article>
        <article className="card">Distinct {timelineView} periods: {Object.keys(groupedCounts).length}</article>
      </div>
      <h3>Recent {timelineView} Activity</h3>
      <ul className="stack">
        {topBuckets.map(([bucket, count]) => (
          <li key={bucket} className="card">
            {bucket}: {count} events
          </li>
        ))}
      </ul>
      <h3>Module Trend Summary</h3>
      <ul className="stack">
        {topModules.map(([module, count]) => (
          <li key={module} className="card">
            {module}: {count} events
          </li>
        ))}
      </ul>
      <ul className="stack">
        {filtered.map((event) => (
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
  const [nodeTypeFilter, setNodeTypeFilter] = useState<"all" | "entry" | "note" | "task" | "metric">("all");
  const [search, setSearch] = useState("");
  const filteredNodes = snapshot.graphNodes.filter((node) => {
    const typeMatch = nodeTypeFilter === "all" || node.type === nodeTypeFilter;
    const textMatch = search.trim() === "" || node.label.toLowerCase().includes(search.toLowerCase());
    return typeMatch && textMatch;
  });
  const nodeTypeClusters = filteredNodes.reduce<Record<string, number>>((acc, node) => {
    acc[node.type] = (acc[node.type] ?? 0) + 1;
    return acc;
  }, {});
  const visibleNodeIds = new Set(filteredNodes.map((node) => node.id));
  const filteredEdges = snapshot.graphEdges.filter(
    (edge) => visibleNodeIds.has(edge.source) || visibleNodeIds.has(edge.target),
  );
  const edgeClusters = filteredEdges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.relationship] = (acc[edge.relationship] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section>
      <h2>Life Graph</h2>
      <p>Nodes: {filteredNodes.length} | Edges: {filteredEdges.length}</p>
      <div className="cards">
        <select value={nodeTypeFilter} onChange={(event) => setNodeTypeFilter(event.target.value as typeof nodeTypeFilter)}>
          <option value="all">All node types</option>
          <option value="entry">Entry</option>
          <option value="note">Note</option>
          <option value="task">Task</option>
          <option value="metric">Metric</option>
        </select>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search node labels" />
      </div>
      <h3>Node Clusters</h3>
      <ul className="stack">
        {Object.entries(nodeTypeClusters).map(([type, count]) => (
          <li key={type} className="card">
            [{type}] {count}
          </li>
        ))}
      </ul>
      <h3>Relationship Clusters</h3>
      <ul className="stack">
        {Object.entries(edgeClusters).map(([relationship, count]) => (
          <li key={relationship} className="card">
            {relationship}: {count}
          </li>
        ))}
      </ul>
      <ul className="stack">
        {filteredNodes.map((node) => (
          <li key={node.id} className="card">
            [{node.type}] {node.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function downloadContent(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function ExportPage() {
  const { actions } = useLifeOs();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section>
      <h2>Export</h2>
      <div className="stack">
        <button
          onClick={() => {
            downloadContent(actions.exportData(), `life-os-export-${new Date().toISOString()}.json`, "application/json");
            setMessage("JSON export created.");
          }}
        >
          Export JSON
        </button>
        <button
          onClick={() => {
            downloadContent(actions.exportJournalMarkdown(), "life-os-journal.md", "text/markdown");
            setMessage("Journal markdown export created.");
          }}
        >
          Export Journal Markdown
        </button>
        <button
          onClick={() => {
            downloadContent(actions.exportNotesMarkdown(), "life-os-notes.md", "text/markdown");
            setMessage("Notes markdown export created.");
          }}
        >
          Export Notes Markdown
        </button>
        <button
          onClick={() => {
            downloadContent(actions.exportTasksCsv(), "life-os-tasks.csv", "text/csv");
            setMessage("Tasks CSV export created.");
          }}
        >
          Export Tasks CSV
        </button>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}

function ImportPage() {
  const { actions } = useLifeOs();
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const importFromText = (event: FormEvent) => {
    event.preventDefault();
    const result = actions.importData(importText);
    setMessage(result.ok ? "Import successful." : `Import failed: ${result.error}`);
  };

  const importFromFile = async (file: File) => {
    const text = await file.text();
    setImportText(text);
    const result = actions.importData(text);
    setMessage(result.ok ? "Import successful." : `Import failed: ${result.error}`);
  };

  return (
    <section>
      <h2>Import</h2>
      <div className="stack">
        <input
          type="file"
          accept=".json,application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importFromFile(file);
          }}
        />
        <form className="stack" onSubmit={importFromText}>
          <textarea
            rows={8}
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            placeholder="Paste exported JSON here"
          />
          <button type="submit">Import JSON</button>
        </form>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}

function SettingsPage() {
  const { actions } = useLifeOs();
  const [noteSearch, setNoteSearch] = useState("");
  const [noteSearchResults, setNoteSearchResults] = useState<string[]>([]);

  const runNoteSearch = async (event: FormEvent) => {
    event.preventDefault();
    setNoteSearchResults(await actions.searchNoteTitles(noteSearch));
  };

  return (
    <section>
      <h2>Settings</h2>
      <div className="stack">
        <p>Use dedicated routes for data tools:</p>
        <div className="cards">
          <Link to="/export">Open Export</Link>
          <Link to="/import">Open Import</Link>
        </div>
        <form className="stack" onSubmit={runNoteSearch}>
          <input
            value={noteSearch}
            onChange={(event) => setNoteSearch(event.target.value)}
            placeholder="Search notes from local DB"
          />
          <button type="submit">Search Notes</button>
        </form>
        <ul className="stack">
          {noteSearchResults.map((title) => (
            <li key={title} className="card">
              {title}
            </li>
          ))}
        </ul>
      </div>
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
