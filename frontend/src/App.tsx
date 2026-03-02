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
  const [results, setResults] = useState<GlobalSearchResult[]>(() => {
    const cached = sessionStorage.getItem("life-os-search-cache");
    if (!cached) return [];
    try {
      const parsed = JSON.parse(cached) as { results?: GlobalSearchResult[] };
      return parsed.results ?? [];
    } catch {
      return [];
    }
  });
  const [hasSearched, setHasSearched] = useState(() => {
    const cached = sessionStorage.getItem("life-os-search-cache");
    if (!cached) return false;
    try {
      const parsed = JSON.parse(cached) as { hasSearched?: boolean };
      return Boolean(parsed.hasSearched);
    } catch {
      return false;
    }
  });
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

  useEffect(() => {
    sessionStorage.setItem("life-os-search-cache", JSON.stringify({ query, results, hasSearched }));
  }, [query, results, hasSearched]);

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    setHasSearched(true);
    setResults(await actions.searchGlobal(query));
  };

  const onInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };
  const routeByModule: Record<string, string> = {
    journal: "/journal",
    notes: "/notes",
    tasks: "/tasks",
    storage: "/storage",
  };
  const moduleResultCounts = results.reduce<Record<string, number>>((acc, result) => {
    acc[result.module] = (acc[result.module] ?? 0) + 1;
    return acc;
  }, {});
  const exportSearchResultsJson = () => {
    downloadContent(JSON.stringify(results, null, 2), "life-os-search-results.json", "application/json");
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
        <button type="button" onClick={() => { setQuery(""); setResults([]); setHasSearched(false); }}>Clear</button>
      </form>
      <div className="cards">
        <article className="card">Search results: {results.length}</article>
        <article className="card">
          Modules: {Object.entries(moduleResultCounts).map(([module, count]) => `${module}:${count}`).join(", ") || "none"}
        </article>
        <button type="button" onClick={exportSearchResultsJson} disabled={results.length === 0}>
          Export Search Results JSON
        </button>
      </div>
      {results.length > 0 ? (
        <ul className="stack">
          {results.map((result) => (
            <li key={result.id} className="card">
              <strong>{result.module}</strong> — {result.label}
              <p>{result.preview}</p>
              <Link to={routeByModule[result.module] ?? "/"}>Open Module</Link>
            </li>
          ))}
        </ul>
      ) : null}
      {hasSearched && results.length === 0 ? <p>No matching records found.</p> : null}

      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/storage">Storage</Link>
        <Link to="/coach">Coach</Link>
        <Link to="/sync">Sync</Link>
        <Link to="/timeline">Timeline</Link>
        <Link to="/graph">Graph</Link>
        <Link to="/help">Help</Link>
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
          <Route path="/sync" element={<SyncPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/help" element={<HelpPage />} />
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

function HelpPage() {
  return (
    <section>
      <h2>Help</h2>
      <ul className="stack">
        <li className="card">Use Global Search to query Journal, Notes, Tasks, and Storage records.</li>
        <li className="card">Use Sync page to monitor queue operations and trigger sync.</li>
        <li className="card">Use Export/Import pages for JSON, Markdown, CSV backups and restores.</li>
        <li className="card">Use Coach page for reviews, notifications, life moments, and insight actions.</li>
      </ul>
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
  const completionRate =
    snapshot.tasks.length > 0
      ? (snapshot.tasks.filter((task) => task.status === "done").length / snapshot.tasks.length) * 100
      : 0;
  const upcomingTasks = snapshot.tasks
    .filter((task) => task.dueDate && task.status !== "done")
    .sort((a, b) => new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime())
    .slice(0, 3);
  const overdueTasks = snapshot.tasks
    .filter((task) => task.dueDate && new Date(task.dueDate).getTime() < Date.now() && task.status !== "done")
    .sort((a, b) => new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime())
    .slice(0, 3);
  const recentCompletedTasks = snapshot.tasks
    .filter((task) => task.status === "done")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
  const highestActivityModule = Object.entries(moduleActivity).sort((a, b) => b[1] - a[1])[0] ?? null;
  const pendingSyncByModule = Object.entries(
    snapshot.syncQueue.reduce<Record<string, number>>((acc, operation) => {
      acc[operation.module] = (acc[operation.module] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0] ?? null;
  const averageTaskAgeDays =
    snapshot.tasks.length > 0
      ? snapshot.tasks.reduce((acc, task) => acc + (Date.now() - new Date(task.createdAt).getTime()) / 86400000, 0) /
        snapshot.tasks.length
      : 0;
  const completedLast7Days = snapshot.tasks.filter(
    (task) => task.status === "done" && new Date(task.updatedAt).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).length;
  const timelineLast24Hours = snapshot.timeline.filter(
    (event) => new Date(event.timestamp).getTime() >= Date.now() - 24 * 60 * 60 * 1000,
  ).length;
  const exportModuleActivityCsv = () => {
    const rows = Object.entries(moduleActivity).map(([module, count]) => `${module},${count}`);
    downloadContent(["module,count", ...rows].join("\n"), "life-os-module-activity.csv", "text/csv");
  };
  const exportSnapshotSummaryJson = () => {
    downloadContent(
      JSON.stringify(
        {
          journalEntries: snapshot.journalEntries.length,
          notes: snapshot.notes.length,
          tasks: snapshot.tasks.length,
          workbooks: snapshot.workbooks.length,
          pendingSyncOps: snapshot.syncQueue.length,
        },
        null,
        2,
      ),
      "life-os-dashboard-summary.json",
      "application/json",
    );
  };
  const exportUpcomingTasksCsv = () => {
    const rows = upcomingTasks.map((task) => `${task.id},"${task.title.replaceAll('"', '""')}",${task.dueDate ?? ""}`);
    downloadContent(["id,title,dueDate", ...rows].join("\n"), "life-os-upcoming-tasks.csv", "text/csv");
  };
  const exportCompletedTasksCsv = () => {
    const rows = recentCompletedTasks.map((task) => `${task.id},"${task.title.replaceAll('"', '""')}",${task.updatedAt}`);
    downloadContent(["id,title,updatedAt", ...rows].join("\n"), "life-os-completed-tasks.csv", "text/csv");
  };
  const exportOverdueTasksCsv = () => {
    const rows = overdueTasks.map((task) => `${task.id},"${task.title.replaceAll('"', '""')}",${task.dueDate ?? ""}`);
    downloadContent(["id,title,dueDate", ...rows].join("\n"), "life-os-overdue-tasks.csv", "text/csv");
  };
  const exportDashboardSummaryMarkdown = () => {
    const lines = [
      "# Life.OS Dashboard Summary",
      "",
      `Tasks: ${snapshot.tasks.length}`,
      `Open tasks: ${openTaskCount}`,
      `Completion rate: ${completionRate.toFixed(1)}%`,
      `Completed last 7d: ${completedLast7Days}`,
      `Timeline events last 24h: ${timelineLast24Hours}`,
    ];
    downloadContent(lines.join("\n"), "life-os-dashboard-summary.md", "text/markdown");
  };

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
        <article className="card">Completion Rate: {completionRate.toFixed(1)}%</article>
        <article className="card">
          Top active module: {highestActivityModule ? `${highestActivityModule[0]} (${highestActivityModule[1]})` : "n/a"}
        </article>
        <article className="card">
          Top pending sync module: {pendingSyncByModule ? `${pendingSyncByModule[0]} (${pendingSyncByModule[1]})` : "n/a"}
        </article>
        <article className="card">Avg task age: {averageTaskAgeDays.toFixed(1)} days</article>
        <article className="card">Completed in 7d: {completedLast7Days}</article>
        <article className="card">Timeline events in 24h: {timelineLast24Hours}</article>
        <button type="button" onClick={exportSnapshotSummaryJson}>Export Snapshot Summary JSON</button>
        <button type="button" onClick={exportDashboardSummaryMarkdown}>Export Summary MD</button>
        <button type="button" onClick={exportUpcomingTasksCsv} disabled={upcomingTasks.length === 0}>
          Export Upcoming Tasks CSV
        </button>
        <button type="button" onClick={exportCompletedTasksCsv} disabled={recentCompletedTasks.length === 0}>
          Export Completed Tasks CSV
        </button>
        <button type="button" onClick={exportOverdueTasksCsv} disabled={overdueTasks.length === 0}>
          Export Overdue Tasks CSV
        </button>
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
      <button type="button" onClick={exportModuleActivityCsv} disabled={Object.keys(moduleActivity).length === 0}>
        Export Module Activity CSV
      </button>
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
      <h3>Upcoming Tasks</h3>
      <ul className="stack">
        {upcomingTasks.map((task) => (
          <li key={task.id} className="card">
            {task.title} — due {task.dueDate}
          </li>
        ))}
      </ul>
      <h3>Overdue Task Preview</h3>
      <ul className="stack">
        {overdueTasks.map((task) => (
          <li key={task.id} className="card">
            {task.title} — due {task.dueDate}
          </li>
        ))}
      </ul>
      <h3>Recently Completed Tasks</h3>
      <ul className="stack">
        {recentCompletedTasks.map((task) => (
          <li key={task.id} className="card">
            {task.title}
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
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [moodTagInput, setMoodTagInput] = useState("");
  const [titleTemplate, setTitleTemplate] = useState("Daily Reflection");
  const [onlyMoodTagged, setOnlyMoodTagged] = useState(false);
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
        <button type="button" onClick={() => setOnlyMoodTagged((current) => !current)}>
          {onlyMoodTagged ? "Show All Entries" : "Only Mood-Tagged"}
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

function NotesPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "words_desc">("newest");
  const [previewMode, setPreviewMode] = useState(false);
  const [quickTag, setQuickTag] = useState("");

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
    return tagMatch && textMatch;
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
        <button type="button" onClick={() => void navigator.clipboard?.writeText(displayedNotes.map((note) => note.title).join("\n"))} disabled={displayedNotes.length === 0}>
          Copy Visible Titles
        </button>
        <button type="button" onClick={() => setPreviewMode((current) => !current)}>
          {previewMode ? "Hide Preview" : "Show Preview"}
        </button>
        <input value={quickTag} onChange={(event) => setQuickTag(event.target.value)} placeholder="Quick tag append" />
        <button type="button" onClick={() => { setTagFilter(""); setSearch(""); setSortBy("newest"); }}>
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

function TasksPage() {
  const { snapshot, actions } = useLifeOs();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [dueFilter, setDueFilter] = useState<"all" | "overdue" | "next7" | "no_due">("all");
  const [sortBy, setSortBy] = useState<"created_desc" | "due_asc" | "priority_desc">("created_desc");
  const [search, setSearch] = useState("");
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [quickTaskPriority, setQuickTaskPriority] = useState<TaskPriority>("medium");
  const now = Date.now();
  const next7Days = now + 7 * 24 * 60 * 60 * 1000;
  const filteredTasks = snapshot.tasks
    .filter((task) => (statusFilter === "all" ? true : task.status === statusFilter))
    .filter((task) => (priorityFilter === "all" ? true : task.priority === priorityFilter))
    .filter((task) => {
      if (dueFilter === "all") return true;
      if (dueFilter === "no_due") return !task.dueDate;
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate).getTime();
      if (dueFilter === "overdue") return due < now && task.status !== "done";
      return due >= now && due <= next7Days;
    })
    .filter((task) => {
      if (!search.trim()) return true;
      const value = search.trim().toLowerCase();
      return task.title.toLowerCase().includes(value) || task.description.toLowerCase().includes(value);
    })
    .sort((a, b) => {
      if (sortBy === "due_asc") {
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aDue - bDue;
      }
      if (sortBy === "priority_desc") {
        const rank = { high: 3, medium: 2, low: 1 };
        return rank[b.priority] - rank[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  const doneRate =
    filteredTasks.length > 0
      ? (filteredTasks.filter((task) => task.status === "done").length / filteredTasks.length) * 100
      : 0;
  const filteredPriorityCounts = filteredTasks.reduce<Record<string, number>>((acc, task) => {
    acc[task.priority] = (acc[task.priority] ?? 0) + 1;
    return acc;
  }, {});
  const nextTask =
    filteredTasks
      .filter((task) => task.status !== "done")
      .sort((a, b) => {
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aDue - bDue;
      })[0] ?? null;
  const overdueTasks = snapshot.tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate).getTime() < now && task.status !== "done",
  );
  const blockedTasks = snapshot.tasks.filter((task) => task.status === "blocked");
  const oldestOpenTask =
    snapshot.tasks
      .filter((task) => task.status !== "done")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0] ?? null;
  const activeTaskFilters = [
    statusFilter !== "all" ? `status:${statusFilter}` : null,
    priorityFilter !== "all" ? `priority:${priorityFilter}` : null,
    dueFilter !== "all" ? `due:${dueFilter}` : null,
    search.trim() ? `search:${search.trim()}` : null,
  ].filter(Boolean);

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
  const markFilteredDone = () => {
    filteredTasks
      .filter((task) => task.status !== "done")
      .forEach((task) => actions.updateTaskStatus(task.id, "done"));
  };
  const exportFilteredTasksCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = filteredTasks.map((task) =>
      [task.id, escape(task.title), escape(task.description), task.priority, task.status, task.dueDate ?? ""].join(","),
    );
    downloadContent(["id,title,description,priority,status,dueDate", ...rows].join("\n"), "life-os-tasks-filtered.csv", "text/csv");
  };
  const exportFilteredTasksMarkdown = () => {
    const lines = filteredTasks.map((task) => `- [${task.status === "done" ? "x" : " "}] ${task.title} (${task.priority})`);
    downloadContent(["# Filtered Tasks", ...lines].join("\n"), "life-os-tasks-filtered.md", "text/markdown");
  };
  const exportTasksByStatusJson = () => {
    const statusCounts = filteredTasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    }, {});
    const payload = {
      counts: statusCounts,
      tasks: filteredTasks,
    };
    downloadContent(JSON.stringify(payload, null, 2), "life-os-tasks-by-status.json", "application/json");
  };
  const exportVisibleTitlesTxt = () => {
    downloadContent(filteredTasks.map((task) => task.title).join("\n"), "life-os-tasks-titles.txt", "text/plain");
  };
  const exportStatusSnapshotJson = () => {
    const statusCounts = filteredTasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    }, {});
    downloadContent(JSON.stringify({ counts: statusCounts, total: filteredTasks.length }, null, 2), "life-os-tasks-status-snapshot.json", "application/json");
  };
  const markFilteredInProgress = () => {
    filteredTasks
      .filter((task) => task.status === "todo" || task.status === "blocked")
      .forEach((task) => actions.updateTaskStatus(task.id, "in_progress"));
  };

  return (
    <section>
      <h2>Life.Assistant</h2>
      <div className="cards">
        <select value={viewMode} onChange={(event) => setViewMode(event.target.value as typeof viewMode)}>
          <option value="list">List View</option>
          <option value="kanban">Kanban View</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
          <option value="all">All statuses</option>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="blocked">blocked</option>
          <option value="done">done</option>
        </select>
        <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)}>
          <option value="all">All priorities</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <select value={dueFilter} onChange={(event) => setDueFilter(event.target.value as typeof dueFilter)}>
          <option value="all">All due dates</option>
          <option value="overdue">Overdue</option>
          <option value="next7">Due next 7 days</option>
          <option value="no_due">No due date</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
          <option value="created_desc">Newest</option>
          <option value="due_asc">Due Date</option>
          <option value="priority_desc">Priority</option>
        </select>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" />
        <button type="button" onClick={() => setDueFilter("overdue")}>
          Overdue Only
        </button>
        <button type="button" onClick={markFilteredDone} disabled={filteredTasks.length === 0}>
          Mark Filtered Done
        </button>
        <button type="button" onClick={markFilteredInProgress} disabled={filteredTasks.length === 0}>
          Set Filtered In Progress
        </button>
        <button type="button" onClick={exportFilteredTasksCsv} disabled={filteredTasks.length === 0}>
          Export Filtered CSV
        </button>
        <button type="button" onClick={exportFilteredTasksMarkdown} disabled={filteredTasks.length === 0}>
          Export Filtered Markdown
        </button>
        <button type="button" onClick={exportTasksByStatusJson} disabled={filteredTasks.length === 0}>
          Export By Status JSON
        </button>
        <button type="button" onClick={exportVisibleTitlesTxt} disabled={filteredTasks.length === 0}>
          Export Titles TXT
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(filteredTasks.map((task) => task.id).join("\n"))} disabled={filteredTasks.length === 0}>
          Copy Task IDs
        </button>
        <button type="button" onClick={exportStatusSnapshotJson} disabled={filteredTasks.length === 0}>
          Export Status Snapshot JSON
        </button>
        <button type="button" onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); setDueFilter("all"); setSortBy("created_desc"); setSearch(""); }}>
          Reset Filters
        </button>
      </div>
      <div className="cards">
        <article className="card">
          <strong>Next Focus Task</strong>
          <p>{nextTask ? `${nextTask.title}${nextTask.dueDate ? ` (due ${nextTask.dueDate})` : ""}` : "No open task"}</p>
        </article>
        <article className="card">
          <strong>Overdue</strong>
          <p>{overdueTasks.length}</p>
        </article>
        <article className="card">
          <strong>Blocked</strong>
          <p>{blockedTasks.length}</p>
        </article>
        <article className="card">
          <strong>Done Rate</strong>
          <p>{doneRate.toFixed(1)}%</p>
        </article>
        <article className="card">
          <strong>High / Medium / Low</strong>
          <p>{filteredPriorityCounts.high ?? 0} / {filteredPriorityCounts.medium ?? 0} / {filteredPriorityCounts.low ?? 0}</p>
        </article>
        <article className="card">
          <strong>Oldest Open Task</strong>
          <p>{oldestOpenTask ? oldestOpenTask.title : "n/a"}</p>
        </article>
        <article className="card">
          <strong>Active Filters</strong>
          <p>{activeTaskFilters.join(", ") || "none"}</p>
        </article>
        <article className="card">
          <strong>Visible Tasks</strong>
          <p>{filteredTasks.length}</p>
        </article>
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
        <button type="button" onClick={() => { setTitle(""); setDescription(""); setPriority("medium"); setDueDate(""); }}>
          Reset Form
        </button>
      </form>
      <form
        className="search-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (!quickTaskTitle.trim()) return;
          actions.createTask({ title: quickTaskTitle.trim(), description: "", priority: quickTaskPriority });
          setQuickTaskTitle("");
        }}
      >
        <input value={quickTaskTitle} onChange={(event) => setQuickTaskTitle(event.target.value)} placeholder="Quick add task..." />
        <select value={quickTaskPriority} onChange={(event) => setQuickTaskPriority(event.target.value as TaskPriority)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="submit">Quick Add</button>
      </form>
      {viewMode === "list" ? (
        <ul className="stack">
          {filteredTasks.map((task) => (
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
              <button
                type="button"
                onClick={() =>
                  actions.createTask({
                    title: `${task.title} (copy)`,
                    description: task.description,
                    priority: task.priority,
                    dueDate: task.dueDate,
                  })
                }
              >
                Duplicate
              </button>
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
                  .filter((task) => filteredTasks.some((filtered) => filtered.id === task.id))
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
  const [search, setSearch] = useState("");
  const [metricSearch, setMetricSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc" | "metrics_desc">("name_asc");

  const displayedWorkbooks = snapshot.workbooks
    .filter((workbook) => workbook.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((workbook) =>
      metricSearch.trim() === ""
        ? true
        : workbook.metrics.some((metric) => metric.label.toLowerCase().includes(metricSearch.trim().toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "metrics_desc") return b.metrics.length - a.metrics.length;
      return a.name.localeCompare(b.name);
    });
  const totalMetrics = displayedWorkbooks.reduce((acc, workbook) => acc + workbook.metrics.length, 0);
  const totalMetricValue = displayedWorkbooks.reduce(
    (acc, workbook) => acc + workbook.metrics.reduce((inner, metric) => inner + metric.value, 0),
    0,
  );
  const averageMetricValue = totalMetrics > 0 ? totalMetricValue / totalMetrics : 0;
  const multiMetricWorkbookCount = displayedWorkbooks.filter((workbook) => workbook.metrics.length >= 2).length;
  const topMetricLabel = Object.entries(
    displayedWorkbooks
      .flatMap((workbook) => workbook.metrics.map((metric) => metric.label))
      .reduce<Record<string, number>>((acc, label) => {
        acc[label] = (acc[label] ?? 0) + 1;
        return acc;
      }, {}),
  ).sort((a, b) => b[1] - a[1])[0];
  const exportVisibleWorkbooksJson = () => {
    downloadContent(JSON.stringify(displayedWorkbooks, null, 2), "life-os-workbooks-visible.json", "application/json");
  };
  const workbookMetricTotals = displayedWorkbooks.map((workbook) => ({
    name: workbook.name,
    total: workbook.metrics.reduce((acc, metric) => acc + metric.value, 0),
  }));
  const topWorkbookMetricTotal = [...workbookMetricTotals].sort((a, b) => b.total - a.total)[0];
  const exportMetricsCsv = () => {
    const rows = displayedWorkbooks.flatMap((workbook) =>
      workbook.metrics.map((metric) => `${workbook.id},"${workbook.name.replaceAll('"', '""')}","${metric.label.replaceAll('"', '""')}",${metric.value}`),
    );
    downloadContent(["workbookId,workbookName,metricLabel,metricValue", ...rows].join("\n"), "life-os-storage-metrics.csv", "text/csv");
  };
  const averageMetricsPerWorkbook = displayedWorkbooks.length > 0 ? totalMetrics / displayedWorkbooks.length : 0;
  const metricValues = displayedWorkbooks.flatMap((workbook) => workbook.metrics.map((metric) => metric.value));
  const metricMin = metricValues.length > 0 ? Math.min(...metricValues) : 0;
  const metricMax = metricValues.length > 0 ? Math.max(...metricValues) : 0;
  const exportVisibleWorkbookNamesTxt = () => {
    downloadContent(displayedWorkbooks.map((workbook) => workbook.name).join("\n"), "life-os-workbook-names.txt", "text/plain");
  };
  const exportMetricLabelCountsJson = () => {
    const counts = displayedWorkbooks
      .flatMap((workbook) => workbook.metrics.map((metric) => metric.label))
      .reduce<Record<string, number>>((acc, label) => {
        acc[label] = (acc[label] ?? 0) + 1;
        return acc;
      }, {});
    downloadContent(JSON.stringify(counts, null, 2), "life-os-storage-metric-label-counts.json", "application/json");
  };

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
      <div className="cards">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search workbooks"
        />
        <input
          value={metricSearch}
          onChange={(event) => setMetricSearch(event.target.value)}
          placeholder="Filter by metric label"
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="metrics_desc">Most metrics</option>
        </select>
        <article className="card">Visible workbooks: {displayedWorkbooks.length}</article>
        <article className="card">Metrics: {totalMetrics}</article>
        <article className="card">Avg metric value: {averageMetricValue.toFixed(2)}</article>
        <article className="card">Workbooks with 2+ metrics: {multiMetricWorkbookCount}</article>
        <article className="card">Top metric label: {topMetricLabel ? `${topMetricLabel[0]} (${topMetricLabel[1]})` : "n/a"}</article>
        <article className="card">
          Top workbook metric total:{" "}
          {topWorkbookMetricTotal ? `${topWorkbookMetricTotal.name} (${topWorkbookMetricTotal.total})` : "n/a"}
        </article>
        <article className="card">Avg metrics/workbook: {averageMetricsPerWorkbook.toFixed(2)}</article>
        <article className="card">Metric min/max: {metricMin.toFixed(2)} / {metricMax.toFixed(2)}</article>
        <button type="button" onClick={exportVisibleWorkbooksJson} disabled={displayedWorkbooks.length === 0}>
          Export Visible Workbooks JSON
        </button>
        <button type="button" onClick={exportMetricsCsv} disabled={displayedWorkbooks.length === 0}>
          Export Metrics CSV
        </button>
        <button type="button" onClick={exportVisibleWorkbookNamesTxt} disabled={displayedWorkbooks.length === 0}>
          Export Workbook Names TXT
        </button>
        <button type="button" onClick={exportMetricLabelCountsJson} disabled={displayedWorkbooks.length === 0}>
          Export Metric Label Counts JSON
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(displayedWorkbooks.map((workbook) => workbook.name).join("\n"))}
          disabled={displayedWorkbooks.length === 0}
        >
          Copy Workbook Names
        </button>
        <button type="button" onClick={() => { setSearch(""); setMetricSearch(""); setSortBy("name_asc"); }}>
          Reset Filters
        </button>
      </div>
      <ul className="stack">
        {displayedWorkbooks.map((workbook) => (
          <li key={workbook.id} className="card">
            <strong>{workbook.name}</strong>
            <p>
              Avg workbook metric:{" "}
              {workbook.metrics.length > 0
                ? (workbook.metrics.reduce((acc, metric) => acc + metric.value, 0) / workbook.metrics.length).toFixed(2)
                : "0.00"}
            </p>
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
  const [lifeMoments, setLifeMoments] = useState<ReturnType<typeof actions.generateLifeMoments>>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<"all" | "journal" | "notes" | "tasks" | "storage">("all");
  const [insightTypeFilter, setInsightTypeFilter] = useState<"all" | "summary" | "pattern" | "suggestion">("all");
  const [search, setSearch] = useState("");
  const [notificationSearch, setNotificationSearch] = useState("");
  const [lifeMomentSearch, setLifeMomentSearch] = useState("");

  useEffect(() => {
    setNotifications(actions.generateNotifications());
    setLifeMoments(actions.generateLifeMoments());
  }, [actions, snapshot.insights]);

  const exportReviewMarkdown = () => {
    if (!review) {
      setMessage("Generate a review first.");
      return;
    }
    const lines = [
      `# ${review.period === "daily" ? "Daily Review" : "Weekly Review"}`,
      "",
      review.summary,
      "",
      "## Lessons",
      ...review.lessons.map((lesson) => `- ${lesson}`),
      "",
      "## Next Focus",
      ...review.nextFocus.map((focus) => `- ${focus}`),
    ];
    downloadContent(lines.join("\n"), `life-os-${review.period}-review.md`, "text/markdown");
    setMessage(`${review.period} review export created.`);
  };

  const exportLifeMomentsCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = lifeMoments.map((moment) =>
      [moment.id, moment.date, escape(moment.title), escape(moment.description), escape(moment.whyItMatters)].join(","),
    );
    downloadContent(
      ["id,date,title,description,whyItMatters", ...rows].join("\n"),
      "life-os-life-moments.csv",
      "text/csv",
    );
    setMessage("Life Moments CSV export created.");
  };
  const exportNotificationsJson = () => {
    downloadContent(JSON.stringify(notifications, null, 2), "life-os-notifications.json", "application/json");
    setMessage("Notifications JSON export created.");
  };
  const exportLifeMomentsJson = () => {
    downloadContent(JSON.stringify(lifeMoments, null, 2), "life-os-life-moments.json", "application/json");
    setMessage("Life Moments JSON export created.");
  };
  const exportVisibleNotificationsCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = visibleNotifications.map((notification) =>
      [notification.id, escape(notification.triggerDescription), escape(notification.message)].join(","),
    );
    downloadContent(["id,triggerDescription,message", ...rows].join("\n"), "life-os-notifications-visible.csv", "text/csv");
    setMessage("Visible notifications CSV export created.");
  };
  const visibleInsights = snapshot.insights.filter((insight) => {
    const moduleMatch = moduleFilter === "all" || insight.sourceModule === moduleFilter;
    const typeMatch = insightTypeFilter === "all" || insight.insightType === insightTypeFilter;
    const textMatch = !search.trim() || insight.content.toLowerCase().includes(search.trim().toLowerCase());
    return moduleMatch && typeMatch && textMatch;
  });
  const exportVisibleInsightsJson = () => {
    downloadContent(JSON.stringify(visibleInsights, null, 2), "life-os-visible-insights.json", "application/json");
    setMessage("Visible insights JSON export created.");
  };
  const visibleNotifications = notifications.filter((notification) => {
    if (!notificationSearch.trim()) return true;
    const value = notificationSearch.trim().toLowerCase();
    return (
      notification.triggerDescription.toLowerCase().includes(value) ||
      notification.message.toLowerCase().includes(value)
    );
  });
  const visibleLifeMoments = lifeMoments.filter((moment) => {
    if (!lifeMomentSearch.trim()) return true;
    const value = lifeMomentSearch.trim().toLowerCase();
    return moment.title.toLowerCase().includes(value) || moment.description.toLowerCase().includes(value);
  });
  const exportVisibleInsightsCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = visibleInsights.map((insight) =>
      [insight.id, insight.sourceModule, insight.insightType, escape(insight.content)].join(","),
    );
    downloadContent(["id,module,type,content", ...rows].join("\n"), "life-os-insights-visible.csv", "text/csv");
    setMessage("Visible insights CSV export created.");
  };
  const exportVisibleLifeMomentsJson = () => {
    downloadContent(JSON.stringify(visibleLifeMoments, null, 2), "life-os-life-moments-visible.json", "application/json");
    setMessage("Visible life moments JSON export created.");
  };
  const averageInsightAgeDays =
    visibleInsights.length > 0
      ? visibleInsights.reduce((acc, insight) => acc + (Date.now() - new Date(insight.createdAt).getTime()) / 86400000, 0) /
        visibleInsights.length
      : 0;

  return (
    <section>
      <h2>Life.Coach Insights</h2>
      <div className="cards">
        <button onClick={() => setReview(actions.generateReview("daily"))}>Generate Daily Review</button>
        <button onClick={() => setReview(actions.generateReview("weekly"))}>Generate Weekly Review</button>
        <button onClick={exportReviewMarkdown}>Export Review Markdown</button>
        <button onClick={exportLifeMomentsCsv}>Export Life Moments CSV</button>
        <button onClick={exportNotificationsJson}>Export Notifications JSON</button>
        <button onClick={exportLifeMomentsJson}>Export Life Moments JSON</button>
        <button onClick={() => setReview(null)}>Clear Review</button>
        <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value as typeof moduleFilter)}>
          <option value="all">All modules</option>
          <option value="journal">Journal</option>
          <option value="notes">Notes</option>
          <option value="tasks">Tasks</option>
          <option value="storage">Storage</option>
        </select>
        <select value={insightTypeFilter} onChange={(event) => setInsightTypeFilter(event.target.value as typeof insightTypeFilter)}>
          <option value="all">All insight types</option>
          <option value="summary">summary</option>
          <option value="pattern">pattern</option>
          <option value="suggestion">suggestion</option>
        </select>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search insights" />
        <input value={notificationSearch} onChange={(event) => setNotificationSearch(event.target.value)} placeholder="Search notifications" />
        <input value={lifeMomentSearch} onChange={(event) => setLifeMomentSearch(event.target.value)} placeholder="Search life moments" />
        <button onClick={exportVisibleInsightsJson}>Export Visible Insights JSON</button>
        <button onClick={exportVisibleInsightsCsv}>Export Visible Insights CSV</button>
        <button onClick={exportVisibleNotificationsCsv}>Export Visible Notifications CSV</button>
        <button onClick={exportVisibleLifeMomentsJson}>Export Visible Life Moments JSON</button>
        <button onClick={() => setMessage(null)}>Clear Message</button>
        <article className="card">Visible insights: {visibleInsights.length}</article>
        <article className="card">Visible notifications: {visibleNotifications.length}</article>
        <article className="card">Visible life moments: {visibleLifeMoments.length}</article>
        <article className="card">Avg insight age: {averageInsightAgeDays.toFixed(1)} days</article>
      </div>
      {message ? <p>{message}</p> : null}
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
        {visibleNotifications.map((notification) => (
          <li key={notification.id} className="card">
            <strong>{notification.triggerDescription}</strong>
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
      <h3>Life Moments Feed</h3>
      <ul className="stack">
        {visibleLifeMoments.map((moment) => (
          <li key={moment.id} className="card">
            <strong>{moment.date} — {moment.title}</strong>
            <p>{moment.description}</p>
            <p>Why it matters: {moment.whyItMatters}</p>
          </li>
        ))}
      </ul>
      <h3>Insights</h3>
      <ul className="stack">
        {visibleInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </ul>
    </section>
  );
}

function SyncPage() {
  const { snapshot, actions } = useLifeOs();
  const [moduleFilter, setModuleFilter] = useState<"all" | "journal" | "notes" | "tasks" | "storage">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const visibleQueue = snapshot.syncQueue
    .filter((operation) => moduleFilter === "all" || operation.module === moduleFilter)
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  const exportFilteredQueue = () => {
    downloadContent(JSON.stringify(visibleQueue, null, 2), "life-os-sync-queue-filtered.json", "application/json");
  };
  const oldestQueueAgeMinutes =
    visibleQueue.length > 0
      ? Math.max(
          0,
          Math.floor(
            (Date.now() -
              Math.min(...visibleQueue.map((operation) => new Date(operation.createdAt).getTime()))) / 60000,
          ),
        )
      : 0;
  const newestQueueAgeMinutes =
    visibleQueue.length > 0
      ? Math.max(
          0,
          Math.floor(
            (Date.now() -
              Math.max(...visibleQueue.map((operation) => new Date(operation.createdAt).getTime()))) / 60000,
          ),
        )
      : 0;
  const exportModuleCountsJson = () => {
    const payload = (["journal", "notes", "tasks", "storage"] as const).reduce<Record<string, number>>((acc, module) => {
      acc[module] = visibleQueue.filter((operation) => operation.module === module).length;
      return acc;
    }, {});
    downloadContent(JSON.stringify(payload, null, 2), "life-os-sync-module-counts.json", "application/json");
  };
  const copyVisibleQueue = () => {
    void navigator.clipboard?.writeText(JSON.stringify(visibleQueue, null, 2));
  };
  const totalQueueAgeHours =
    visibleQueue.length > 0
      ? visibleQueue.reduce((acc, operation) => acc + (Date.now() - new Date(operation.createdAt).getTime()) / 3600000, 0)
      : 0;
  const staleOver24Hours = visibleQueue.filter(
    (operation) => Date.now() - new Date(operation.createdAt).getTime() > 24 * 60 * 60 * 1000,
  ).length;
  return (
    <section>
      <h2>Sync Status</h2>
      <div className="cards">
        <article className="card">State: {snapshot.syncStatus.state}</article>
        <article className="card">Pending Operations: {snapshot.syncQueue.length}</article>
        <article className="card">
          Last Synced: {snapshot.syncStatus.lastSyncedAt ? new Date(snapshot.syncStatus.lastSyncedAt).toLocaleString() : "Never"}
        </article>
      </div>
      <button onClick={actions.syncNow}>Sync Now</button>
      <div className="cards">
        <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value as typeof moduleFilter)}>
          <option value="all">All modules</option>
          <option value="journal">Journal</option>
          <option value="notes">Notes</option>
          <option value="tasks">Tasks</option>
          <option value="storage">Storage</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button onClick={exportFilteredQueue} disabled={visibleQueue.length === 0}>
          Export Filtered Queue JSON
        </button>
        <button onClick={exportModuleCountsJson} disabled={visibleQueue.length === 0}>
          Export Module Counts JSON
        </button>
        <button onClick={copyVisibleQueue} disabled={visibleQueue.length === 0}>
          Copy Visible Queue
        </button>
        <button type="button" onClick={() => { setModuleFilter("all"); setSortBy("newest"); }}>
          Reset Filters
        </button>
      </div>
      <div className="cards">
        {(["journal", "notes", "tasks", "storage"] as const).map((module) => (
          <article key={module} className="card">
            {module}: {visibleQueue.filter((operation) => operation.module === module).length}
          </article>
        ))}
        <article className="card">Oldest visible item age: {oldestQueueAgeMinutes}m</article>
        <article className="card">Newest visible item age: {newestQueueAgeMinutes}m</article>
        <article className="card">Oldest visible item age: {(oldestQueueAgeMinutes / 60).toFixed(1)}h</article>
        <article className="card">Total queue age: {totalQueueAgeHours.toFixed(1)}h</article>
        <article className="card">Stale >24h: {staleOver24Hours}</article>
      </div>
      <h3>Queue</h3>
      <ul className="stack">
        {visibleQueue.map((operation) => (
          <li key={operation.id} className="card">
            [{operation.module}] {operation.operation} {operation.entityId} at {operation.createdAt}
            {" — "}
            {Math.max(0, Math.floor((Date.now() - new Date(operation.createdAt).getTime()) / 60000))}m ago
          </li>
        ))}
      </ul>
    </section>
  );
}

function InsightCard({ insight }: { insight: ReturnType<typeof useLifeOs>["snapshot"]["insights"][number] }) {
  const { actions } = useLifeOs();
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
            <li key={action}>
              {action}
              <button
                onClick={() =>
                  actions.createTask({
                    title: `Coach Action: ${action}`,
                    description: insight.content,
                    priority: "medium",
                  })
                }
              >
                Create Task
              </button>
            </li>
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortDirection, setSortDirection] = useState<"newest" | "oldest">("newest");

  const filtered = snapshot.timeline.filter((event) => {
    const moduleMatch = moduleFilter === "all" || event.module === moduleFilter;
    const typeMatch = eventTypeFilter === "all" || event.eventType === eventTypeFilter;
    const textMatch = textFilter.trim() === "" || event.title.toLowerCase().includes(textFilter.toLowerCase());
    const eventDate = event.timestamp.slice(0, 10);
    const startMatch = startDate === "" || eventDate >= startDate;
    const endMatch = endDate === "" || eventDate <= endDate;
    return moduleMatch && typeMatch && textMatch && startMatch && endMatch;
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
  const sortedFiltered = [...filtered].sort((a, b) =>
    sortDirection === "newest"
      ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const eventTypeCounts = filtered.reduce<Record<string, number>>((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] ?? 0) + 1;
    return acc;
  }, {});
  const exportFilteredTimelineCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const header = "id,module,eventType,timestamp,title";
    const rows = sortedFiltered.map((event) =>
      [event.id, event.module, event.eventType, event.timestamp, escape(event.title)].join(","),
    );
    downloadContent(
      [header, ...rows].join("\n"),
      `life-os-timeline-${timelineView}.csv`,
      "text/csv",
    );
  };
  const exportFilteredTimelineJson = () => {
    downloadContent(JSON.stringify(sortedFiltered, null, 2), `life-os-timeline-${timelineView}.json`, "application/json");
  };
  const exportTimelineSummaryMarkdown = () => {
    const lines = [
      `# Timeline Summary (${timelineView})`,
      "",
      `Filtered events: ${filtered.length}`,
      `Date range: ${startDate || "start"} to ${endDate || "end"}`,
      "",
      "## Module Counts",
      ...Object.entries(moduleCounts).map(([module, count]) => `- ${module}: ${count}`),
    ];
    downloadContent(lines.join("\n"), `life-os-timeline-summary-${timelineView}.md`, "text/markdown");
  };
  const exportBucketCountsJson = () => {
    downloadContent(JSON.stringify(groupedCounts, null, 2), `life-os-timeline-buckets-${timelineView}.json`, "application/json");
  };
  const exportModuleCountsJson = () => {
    downloadContent(JSON.stringify(moduleCounts, null, 2), `life-os-timeline-modules-${timelineView}.json`, "application/json");
  };
  const exportVisibleTitlesTxt = () => {
    downloadContent(sortedFiltered.map((event) => event.title).join("\n"), `life-os-timeline-titles-${timelineView}.txt`, "text/plain");
  };
  const exportTopBucketsTxt = () => {
    downloadContent(topBuckets.map(([bucket, count]) => `${bucket}: ${count}`).join("\n"), `life-os-timeline-top-buckets-${timelineView}.txt`, "text/plain");
  };
  const visibleRangeSummary =
    sortedFiltered.length > 0
      ? `${sortedFiltered[sortedFiltered.length - 1].timestamp} -> ${sortedFiltered[0].timestamp}`
      : "n/a";
  const eventTypePercentages = {
    created: filtered.length > 0 ? (eventTypeCounts.created ?? 0) / filtered.length * 100 : 0,
    updated: filtered.length > 0 ? (eventTypeCounts.updated ?? 0) / filtered.length * 100 : 0,
    completed: filtered.length > 0 ? (eventTypeCounts.completed ?? 0) / filtered.length * 100 : 0,
  };
  const weeklyBuckets = Object.entries(groupedCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

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
        <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value as typeof sortDirection)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        <button type="button" onClick={() => { setModuleFilter("all"); setEventTypeFilter("all"); setTimelineView("daily"); setTextFilter(""); setSortDirection("newest"); setStartDate(""); setEndDate(""); }}>
          Reset Filters
        </button>
        <button type="button" onClick={() => setTextFilter("")}>
          Clear Text
        </button>
      </div>
      <div className="cards">
        <article className="card">Filtered events: {filtered.length}</article>
        <article className="card">Distinct {timelineView} periods: {Object.keys(groupedCounts).length}</article>
        <article className="card">Top module: {topModules[0]?.[0] ?? "n/a"} ({topModules[0]?.[1] ?? 0})</article>
        <article className="card">Visible range: {visibleRangeSummary}</article>
        <button onClick={exportFilteredTimelineCsv}>Export Filtered Timeline CSV</button>
        <button onClick={exportFilteredTimelineJson}>Export Filtered Timeline JSON</button>
        <button onClick={exportTimelineSummaryMarkdown}>Export Timeline Summary MD</button>
        <button onClick={exportBucketCountsJson}>Export Bucket Counts JSON</button>
        <button onClick={exportModuleCountsJson}>Export Module Counts JSON</button>
        <button onClick={exportVisibleTitlesTxt}>Export Visible Titles TXT</button>
        <button onClick={exportTopBucketsTxt} disabled={topBuckets.length === 0}>Export Top Buckets TXT</button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(weeklyBuckets.map(([bucket, count]) => `${bucket}:${count}`).join("\n"))}
          disabled={weeklyBuckets.length === 0}
        >
          Copy Top Buckets
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(sortedFiltered[0]?.title ?? "")} disabled={sortedFiltered.length === 0}>
          Copy First Title
        </button>
        <article className="card">Created: {eventTypeCounts.created ?? 0}</article>
        <article className="card">Updated: {eventTypeCounts.updated ?? 0}</article>
        <article className="card">Completed: {eventTypeCounts.completed ?? 0}</article>
        <article className="card">
          % C/U/D: {eventTypePercentages.created.toFixed(0)} / {eventTypePercentages.updated.toFixed(0)} / {eventTypePercentages.completed.toFixed(0)}
        </article>
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
        {sortedFiltered.map((event) => (
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
  const [relationshipFilter, setRelationshipFilter] = useState<"all" | "mentions" | "related_to" | "derived_from">("all");
  const [search, setSearch] = useState("");
  const [edgeSearch, setEdgeSearch] = useState("");
  const [hideIsolated, setHideIsolated] = useState(false);
  const [minDegree, setMinDegree] = useState(0);
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
  const nodeLabelById = Object.fromEntries(snapshot.graphNodes.map((node) => [node.id, node.label]));
  const filteredEdges = snapshot.graphEdges.filter(
    (edge) => {
      const sourceLabel = nodeLabelById[edge.source] ?? edge.source;
      const targetLabel = nodeLabelById[edge.target] ?? edge.target;
      const textMatch =
        edgeSearch.trim() === "" ||
        `${sourceLabel} ${edge.relationship} ${targetLabel}`.toLowerCase().includes(edgeSearch.toLowerCase());
      return (
        (visibleNodeIds.has(edge.source) || visibleNodeIds.has(edge.target)) &&
        (relationshipFilter === "all" || edge.relationship === relationshipFilter) &&
        textMatch
      );
    },
  );
  const nodeDegrees = filteredEdges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.source] = (acc[edge.source] ?? 0) + 1;
    acc[edge.target] = (acc[edge.target] ?? 0) + 1;
    return acc;
  }, {});
  const edgeClusters = filteredEdges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.relationship] = (acc[edge.relationship] ?? 0) + 1;
    return acc;
  }, {});
  const connectedNodeIds = new Set(filteredEdges.flatMap((edge) => [edge.source, edge.target]));
  const isolatedNodeCount = filteredNodes.filter((node) => !connectedNodeIds.has(node.id)).length;
  const visibleNodesBase = hideIsolated ? filteredNodes.filter((node) => connectedNodeIds.has(node.id)) : filteredNodes;
  const visibleNodes = visibleNodesBase.filter((node) => (nodeDegrees[node.id] ?? 0) >= minDegree);
  const visibleNodeIdsFiltered = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = filteredEdges.filter(
    (edge) => visibleNodeIdsFiltered.has(edge.source) && visibleNodeIdsFiltered.has(edge.target),
  );
  const exportFilteredGraphJson = () => {
    downloadContent(
      JSON.stringify({ nodes: visibleNodes, edges: visibleEdges }, null, 2),
      "life-os-graph-filtered.json",
      "application/json",
    );
  };
  const exportFilteredEdgesCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = visibleEdges.map((edge) =>
      [
        edge.id,
        escape(nodeLabelById[edge.source] ?? edge.source),
        edge.relationship,
        escape(nodeLabelById[edge.target] ?? edge.target),
      ].join(","),
    );
    downloadContent(["id,source,relationship,target", ...rows].join("\n"), "life-os-graph-edges-filtered.csv", "text/csv");
  };
  const exportVisibleNodeLabelsCsv = () => {
    const rows = visibleNodes.map((node) => `${node.id},"${node.label.replaceAll('"', '""')}",${node.type}`);
    downloadContent(["id,label,type", ...rows].join("\n"), "life-os-graph-visible-nodes.csv", "text/csv");
  };
  const relationshipTotal = visibleEdges.length || 1;
  const visibleEdgeClusters = visibleEdges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.relationship] = (acc[edge.relationship] ?? 0) + 1;
    return acc;
  }, {});
  const primaryRelationship = Object.entries(visibleEdgeClusters).sort((a, b) => b[1] - a[1])[0];
  const nodeTypeTotal = visibleNodes.length || 1;
  const primaryNodeType = Object.entries(
    visibleNodes.reduce<Record<string, number>>((acc, node) => {
      acc[node.type] = (acc[node.type] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0];
  const exportRelationshipCountsJson = () => {
    downloadContent(JSON.stringify(visibleEdgeClusters, null, 2), "life-os-graph-relationship-counts.json", "application/json");
  };
  const exportVisibleNodesJson = () => {
    downloadContent(JSON.stringify(visibleNodes, null, 2), "life-os-graph-visible-nodes.json", "application/json");
  };
  const edgeDensity =
    visibleNodes.length > 1 ? visibleEdges.length / (visibleNodes.length * (visibleNodes.length - 1)) : 0;

  return (
    <section>
      <h2>Life Graph</h2>
      <p>Nodes: {visibleNodes.length} | Edges: {visibleEdges.length} | Isolated nodes: {isolatedNodeCount}</p>
      <article className="card">
        Top relationship ratio: {primaryRelationship ? `${primaryRelationship[0]} ${(primaryRelationship[1] / relationshipTotal * 100).toFixed(1)}%` : "n/a"}
      </article>
      <article className="card">
        Top node type ratio: {primaryNodeType ? `${primaryNodeType[0]} ${(primaryNodeType[1] / nodeTypeTotal * 100).toFixed(1)}%` : "n/a"}
      </article>
      <article className="card">Edge density: {edgeDensity.toFixed(3)}</article>
      <div className="cards">
        <select value={nodeTypeFilter} onChange={(event) => setNodeTypeFilter(event.target.value as typeof nodeTypeFilter)}>
          <option value="all">All node types</option>
          <option value="entry">Entry</option>
          <option value="note">Note</option>
          <option value="task">Task</option>
          <option value="metric">Metric</option>
        </select>
        <select value={relationshipFilter} onChange={(event) => setRelationshipFilter(event.target.value as typeof relationshipFilter)}>
          <option value="all">All relationships</option>
          <option value="mentions">mentions</option>
          <option value="related_to">related_to</option>
          <option value="derived_from">derived_from</option>
        </select>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search node labels" />
        <input value={edgeSearch} onChange={(event) => setEdgeSearch(event.target.value)} placeholder="Search edges" />
        <label>
          <input type="checkbox" checked={hideIsolated} onChange={(event) => setHideIsolated(event.target.checked)} /> Hide isolated
        </label>
        <label>
          Min degree
          <input type="number" min={0} value={minDegree} onChange={(event) => setMinDegree(Number(event.target.value) || 0)} />
        </label>
        <button type="button" onClick={exportFilteredGraphJson}>Export Filtered Graph JSON</button>
        <button type="button" onClick={exportFilteredEdgesCsv}>Export Filtered Edges CSV</button>
        <button type="button" onClick={exportVisibleNodeLabelsCsv}>Export Visible Nodes CSV</button>
        <button type="button" onClick={exportVisibleNodesJson}>Export Visible Nodes JSON</button>
        <button type="button" onClick={exportRelationshipCountsJson}>Export Relationship Counts JSON</button>
        <button type="button" onClick={() => { setNodeTypeFilter("all"); setRelationshipFilter("all"); setSearch(""); setEdgeSearch(""); setHideIsolated(false); setMinDegree(0); }}>
          Reset Filters
        </button>
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
        {Object.entries(visibleEdgeClusters).map(([relationship, count]) => (
          <li key={relationship} className="card">
            {relationship}: {count}
          </li>
        ))}
      </ul>
      <h3>Edges</h3>
      <ul className="stack">
        {visibleEdges.map((edge) => (
          <li key={edge.id} className="card">
            {nodeLabelById[edge.source] ?? edge.source} --{edge.relationship}--&gt; {nodeLabelById[edge.target] ?? edge.target}
          </li>
        ))}
      </ul>
      <ul className="stack">
        {visibleNodes.map((node) => (
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
  const { actions, snapshot } = useLifeOs();
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
        <button
          onClick={() => {
            const bundle = ["# Life.OS Bundle", "", "## Journal", "", actions.exportJournalMarkdown(), "", "## Notes", "", actions.exportNotesMarkdown()].join("\n");
            downloadContent(bundle, "life-os-bundle.md", "text/markdown");
            setMessage("Markdown bundle export created.");
          }}
        >
          Export Markdown Bundle
        </button>
        <button
          onClick={() => {
            downloadContent(JSON.stringify(snapshot.timeline, null, 2), "life-os-timeline.json", "application/json");
            setMessage("Timeline JSON export created.");
          }}
        >
          Export Timeline JSON
        </button>
        <button
          onClick={() => {
            downloadContent(
              JSON.stringify({ nodes: snapshot.graphNodes, edges: snapshot.graphEdges }, null, 2),
              "life-os-graph.json",
              "application/json",
            );
            setMessage("Graph JSON export created.");
          }}
        >
          Export Graph JSON
        </button>
        <button
          onClick={() => {
            downloadContent(JSON.stringify(snapshot.insights, null, 2), "life-os-insights.json", "application/json");
            setMessage("Coach insights JSON export created.");
          }}
        >
          Export Coach Insights JSON
        </button>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}

function ImportPage() {
  const { actions } = useLifeOs();
  const [importText, setImportText] = useState("");
  const [csvText, setCsvText] = useState("");
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

  const parseCsvLine = (line: string): string[] => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    values.push(current);
    return values.map((value) => value.trim());
  };

  const importTasksCsv = (csv: string) => {
    const lines = csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      setMessage("CSV is empty.");
      return;
    }
    const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
    const titleIndex = headers.indexOf("title");
    const descriptionIndex = headers.indexOf("description");
    const priorityIndex = headers.indexOf("priority");
    const dueDateIndex = headers.indexOf("duedate");
    const statusIndex = headers.indexOf("status");
    if (titleIndex === -1) {
      setMessage("CSV import failed: required 'title' column missing.");
      return;
    }

    let imported = 0;
    for (const line of lines.slice(1)) {
      const values = parseCsvLine(line);
      const title = values[titleIndex]?.trim();
      if (!title) continue;
      const description = descriptionIndex === -1 ? "" : values[descriptionIndex] ?? "";
      const priorityRaw = (priorityIndex === -1 ? "medium" : values[priorityIndex] ?? "medium").toLowerCase();
      const priority = priorityRaw === "high" || priorityRaw === "low" ? priorityRaw : "medium";
      const dueDate = dueDateIndex === -1 ? "" : values[dueDateIndex] ?? "";
      const status = statusIndex === -1 ? "todo" : (values[statusIndex] ?? "todo").toLowerCase();

      const createdTaskId = actions.createTask({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
      });
      if (status === "in_progress" || status === "blocked" || status === "done") {
        actions.updateTaskStatus(createdTaskId, status);
      }
      imported += 1;
    }
    setMessage(`Imported ${imported} task(s) from CSV.`);
  };

  const importCsvFromText = (event: FormEvent) => {
    event.preventDefault();
    importTasksCsv(csvText);
  };

  const importCsvFromFile = async (file: File) => {
    const text = await file.text();
    setCsvText(text);
    importTasksCsv(text);
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
          <button type="button" onClick={() => setImportText("")}>Clear JSON Input</button>
          <button type="submit">Import JSON</button>
        </form>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importCsvFromFile(file);
          }}
        />
        <form className="stack" onSubmit={importCsvFromText}>
          <textarea
            rows={8}
            value={csvText}
            onChange={(event) => setCsvText(event.target.value)}
            placeholder="Paste tasks CSV here (title,description,priority,dueDate,status)"
          />
          <button type="button" onClick={() => setCsvText("")}>Clear CSV Input</button>
          <button type="submit">Import Tasks CSV</button>
        </form>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}

function SettingsPage() {
  const { actions, snapshot } = useLifeOs();
  const [noteSearch, setNoteSearch] = useState("");
  const [noteSearchResults, setNoteSearchResults] = useState<string[]>([]);
  const [openTaskCount, setOpenTaskCount] = useState<number | null>(null);
  const [recentJournalTitles, setRecentJournalTitles] = useState<string[]>([]);

  const runNoteSearch = async (event: FormEvent) => {
    event.preventDefault();
    setNoteSearchResults(await actions.searchNoteTitles(noteSearch));
  };
  const refreshOpenTaskCount = async () => {
    setOpenTaskCount(await actions.listOpenTasks());
  };
  const refreshRecentJournalTitles = async () => {
    setRecentJournalTitles(await actions.listRecentJournalTitles());
  };
  const clearLocalPreferences = () => {
    localStorage.removeItem("life-os-theme");
    localStorage.removeItem("life-os-auth-email");
    window.location.reload();
  };
  const exportStateStatsJson = () => {
    const payload = {
      journalEntries: snapshot.journalEntries.length,
      notes: snapshot.notes.length,
      tasks: snapshot.tasks.length,
      workbooks: snapshot.workbooks.length,
      timelineEvents: snapshot.timeline.length,
      graphNodes: snapshot.graphNodes.length,
      graphEdges: snapshot.graphEdges.length,
      insights: snapshot.insights.length,
    };
    downloadContent(JSON.stringify(payload, null, 2), "life-os-state-stats.json", "application/json");
  };
  const copyStateStats = () => {
    const payload = {
      journalEntries: snapshot.journalEntries.length,
      notes: snapshot.notes.length,
      tasks: snapshot.tasks.length,
      workbooks: snapshot.workbooks.length,
      timelineEvents: snapshot.timeline.length,
      graphNodes: snapshot.graphNodes.length,
      graphEdges: snapshot.graphEdges.length,
      insights: snapshot.insights.length,
    };
    void navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
  };
  const clearCachedSearch = () => {
    setNoteSearch("");
    setNoteSearchResults([]);
    sessionStorage.removeItem("life-os-search-cache");
    localStorage.removeItem("life-os-search-cache");
  };
  const quickStateReset = () => {
    setNoteSearch("");
    setNoteSearchResults([]);
    setOpenTaskCount(null);
    setRecentJournalTitles([]);
  };
  const exportSearchResultsJson = () => {
    downloadContent(JSON.stringify(noteSearchResults, null, 2), "life-os-note-search-results.json", "application/json");
  };

  return (
    <section>
      <h2>Settings</h2>
      <div className="stack">
        <p>Use dedicated routes for data tools:</p>
        <button type="button" onClick={clearLocalPreferences}>
          Clear Local Preferences
        </button>
        <button type="button" onClick={exportStateStatsJson}>
          Export State Stats JSON
        </button>
        <button type="button" onClick={copyStateStats}>
          Copy State Stats
        </button>
        <button type="button" onClick={clearCachedSearch}>
          Clear Cached Search
        </button>
        <button type="button" onClick={exportSearchResultsJson} disabled={noteSearchResults.length === 0}>
          Export Search Results JSON
        </button>
        <button type="button" onClick={quickStateReset}>
          Quick State Reset
        </button>
        <div className="cards">
          <Link to="/export">Open Export</Link>
          <Link to="/import">Open Import</Link>
        </div>
        <div className="cards">
          <article className="card">State: journal {snapshot.journalEntries.length}</article>
          <article className="card">State: notes {snapshot.notes.length}</article>
          <article className="card">State: tasks {snapshot.tasks.length}</article>
          <article className="card">State: workbooks {snapshot.workbooks.length}</article>
        </div>
        <form className="stack" onSubmit={runNoteSearch}>
          <input
            value={noteSearch}
            onChange={(event) => setNoteSearch(event.target.value)}
            placeholder="Search notes from local DB"
          />
          <button type="button" onClick={() => { setNoteSearch(""); setNoteSearchResults([]); }}>
            Reset Note Search
          </button>
          <button type="submit">Search Notes</button>
        </form>
        <div className="cards">
          <button onClick={() => void refreshOpenTaskCount()}>Refresh Open Task Count</button>
          <article className="card">Open tasks: {openTaskCount ?? "Not loaded"}</article>
          <button onClick={() => void refreshRecentJournalTitles()}>Refresh Recent Journal Titles</button>
        </div>
        <ul className="stack">
          {recentJournalTitles.map((title) => (
            <li key={title} className="card">
              {title}
            </li>
          ))}
        </ul>
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
