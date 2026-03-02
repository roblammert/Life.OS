import { FormEvent, useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { LifeOsProvider, useLifeOs } from "./app/life-os-provider";
import { AuthLoginPage, AuthRegisterPage, AuthResetPage, HelpPage } from "./app/pages/auth-help-pages";
import { JournalPage, NotesPage } from "./app/pages/content-pages";
import { ExportPage, ImportPage, SettingsPage } from "./app/pages/data-tools-pages";
import { DashboardPage } from "./app/pages/dashboard-page";
import { CoachPage, SyncPage } from "./app/pages/insights-sync-pages";
import { TasksPage, StoragePage } from "./app/pages/operational-pages";
import { downloadContent } from "./core/utils";
import type { GlobalSearchResult } from "./lib/db/indexeddb";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function Layout() {
  const { snapshot, actions } = useLifeOs();
  const [query, setQuery] = useState("");
  const [searchModuleFilter, setSearchModuleFilter] = useState<"all" | "journal" | "notes" | "tasks" | "storage">("all");
  const [searchLimit, setSearchLimit] = useState(25);
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
  const visibleResults = results
    .filter((result) => searchModuleFilter === "all" || result.module === searchModuleFilter)
    .slice(0, searchLimit);
  const moduleResultCounts = visibleResults.reduce<Record<string, number>>((acc, result) => {
    acc[result.module] = (acc[result.module] ?? 0) + 1;
    return acc;
  }, {});
  const exportSearchResultsJson = () => {
    downloadContent(JSON.stringify(results, null, 2), "life-os-search-results.json", "application/json");
  };
  const exportVisibleSearchResultsJson = () => {
    downloadContent(JSON.stringify(visibleResults, null, 2), "life-os-search-results-visible.json", "application/json");
  };
  const exportVisibleSearchStatsTxt = () => {
    const lines = [
      `visible=${visibleResults.length}`,
      `total=${results.length}`,
      ...Object.entries(moduleResultCounts).map(([module, count]) => `${module}=${count}`),
    ];
    downloadContent(lines.join("\n"), "life-os-search-visible-stats.txt", "text/plain");
  };
  const exportVisibleSearchResultsTxt = () => {
    downloadContent(visibleResults.map((result) => `[${result.module}] ${result.label}`).join("\n"), "life-os-search-results-visible.txt", "text/plain");
  };
  const exportAppStatusJson = () => {
    downloadContent(
      JSON.stringify(
        {
          auth: isAuthenticated ? authEmail : "guest",
          online: isOnline,
          layoutMode,
          theme,
          pendingSync: snapshot.syncQueue.length,
          syncState: snapshot.syncStatus.state,
        },
        null,
        2,
      ),
      "life-os-app-status.json",
      "application/json",
    );
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
        <select value={searchModuleFilter} onChange={(event) => setSearchModuleFilter(event.target.value as typeof searchModuleFilter)}>
          <option value="all">All modules</option>
          <option value="journal">Journal</option>
          <option value="notes">Notes</option>
          <option value="tasks">Tasks</option>
          <option value="storage">Storage</option>
        </select>
        <input
          type="number"
          min={1}
          max={200}
          value={searchLimit}
          onChange={(event) => setSearchLimit(Math.max(1, Math.min(200, Number(event.target.value) || 1)))}
          placeholder="Result limit"
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setQuery(""); setResults([]); setHasSearched(false); setSearchModuleFilter("all"); setSearchLimit(25); }}>Clear</button>
      </form>
      <div className="cards">
        <article className="card">Search results: {visibleResults.length} / {results.length}</article>
        <article className="card">
          Modules: {Object.entries(moduleResultCounts).map(([module, count]) => `${module}:${count}`).join(", ") || "none"}
        </article>
        <button type="button" onClick={exportSearchResultsJson} disabled={results.length === 0}>
          Export Search Results JSON
        </button>
        <button type="button" onClick={exportVisibleSearchResultsJson} disabled={visibleResults.length === 0}>
          Export Visible Results JSON
        </button>
        <button type="button" onClick={exportVisibleSearchStatsTxt} disabled={visibleResults.length === 0}>
          Export Visible Stats TXT
        </button>
        <button type="button" onClick={exportVisibleSearchResultsTxt} disabled={visibleResults.length === 0}>
          Export Visible Results TXT
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(visibleResults.map((result) => `${result.module}: ${result.label}`).join("\n"))}
          disabled={visibleResults.length === 0}
        >
          Copy Visible Results
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(visibleResults.map((result) => result.preview).join("\n\n"))}
          disabled={visibleResults.length === 0}
        >
          Copy Visible Previews
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(Object.entries(moduleResultCounts).map(([module, count]) => `${module}:${count}`).join("\n"))}
          disabled={Object.keys(moduleResultCounts).length === 0}
        >
          Copy Module Counts
        </button>
        <button type="button" onClick={exportAppStatusJson}>
          Export App Status JSON
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(`auth=${isAuthenticated ? authEmail : "guest"}\nonline=${isOnline}\nlayout=${layoutMode}\ntheme=${theme}`)}
        >
          Copy App Status
        </button>
      </div>
      {visibleResults.length > 0 ? (
        <ul className="stack">
          {visibleResults.map((result) => (
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

function TimelinePage() {
  const { snapshot } = useLifeOs();
  const [moduleFilter, setModuleFilter] = useState<"all" | "journal" | "notes" | "tasks" | "storage">("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | "created" | "updated" | "completed">("all");
  const [timelineView, setTimelineView] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [textFilter, setTextFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortDirection, setSortDirection] = useState<"newest" | "oldest">("newest");
  const [minTitleLength, setMinTitleLength] = useState(0);
  const [createdOnlyToggle, setCreatedOnlyToggle] = useState(false);

  const filtered = snapshot.timeline.filter((event) => {
    const moduleMatch = moduleFilter === "all" || event.module === moduleFilter;
    const typeMatch = eventTypeFilter === "all" || event.eventType === eventTypeFilter;
    const createdToggleMatch = !createdOnlyToggle || event.eventType === "created";
    const textMatch = textFilter.trim() === "" || event.title.toLowerCase().includes(textFilter.toLowerCase());
    const titleLengthMatch = event.title.trim().length >= minTitleLength;
    const eventDate = event.timestamp.slice(0, 10);
    const startMatch = startDate === "" || eventDate >= startDate;
    const endMatch = endDate === "" || eventDate <= endDate;
    return moduleMatch && typeMatch && createdToggleMatch && textMatch && titleLengthMatch && startMatch && endMatch;
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
  const exportEventTypeCountsJson = () => {
    downloadContent(JSON.stringify(eventTypeCounts, null, 2), `life-os-timeline-event-types-${timelineView}.json`, "application/json");
  };
  const exportVisibleEventIdsTxt = () => {
    downloadContent(sortedFiltered.map((event) => event.id).join("\n"), `life-os-timeline-ids-${timelineView}.txt`, "text/plain");
  };
  const exportVisibleRangeTxt = () => {
    downloadContent(visibleRangeSummary, `life-os-timeline-visible-range-${timelineView}.txt`, "text/plain");
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
        <button type="button" onClick={() => setCreatedOnlyToggle((current) => !current)}>
          {createdOnlyToggle ? "All Event Types" : "Created Only"}
        </button>
        <input
          type="number"
          min={0}
          value={minTitleLength}
          onChange={(event) => setMinTitleLength(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Min title length"
        />
        <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value as typeof sortDirection)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        <button type="button" onClick={() => { setModuleFilter("all"); setEventTypeFilter("all"); setTimelineView("daily"); setTextFilter(""); setSortDirection("newest"); setStartDate(""); setEndDate(""); setMinTitleLength(0); setCreatedOnlyToggle(false); }}>
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
        <button onClick={exportEventTypeCountsJson}>Export Event Type Counts JSON</button>
        <button onClick={exportVisibleEventIdsTxt} disabled={sortedFiltered.length === 0}>Export Visible IDs TXT</button>
        <button onClick={exportVisibleRangeTxt} disabled={sortedFiltered.length === 0}>Export Visible Range TXT</button>
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
        <button type="button" onClick={() => void navigator.clipboard?.writeText(sortedFiltered.map((event) => event.id).join("\n"))} disabled={sortedFiltered.length === 0}>
          Copy Visible Event IDs
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
  const [minLabelLength, setMinLabelLength] = useState(0);
  const filteredNodes = snapshot.graphNodes.filter((node) => {
    const typeMatch = nodeTypeFilter === "all" || node.type === nodeTypeFilter;
    const textMatch = search.trim() === "" || node.label.toLowerCase().includes(search.toLowerCase());
    const labelLengthMatch = node.label.trim().length >= minLabelLength;
    return typeMatch && textMatch && labelLengthMatch;
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
  const exportVisibleNodeIdsTxt = () => {
    downloadContent(visibleNodes.map((node) => node.id).join("\n"), "life-os-graph-visible-node-ids.txt", "text/plain");
  };
  const exportVisibleEdgeIdsTxt = () => {
    downloadContent(visibleEdges.map((edge) => edge.id).join("\n"), "life-os-graph-visible-edge-ids.txt", "text/plain");
  };
  const exportVisibleNodeDegreesJson = () => {
    const payload = visibleNodes.map((node) => ({ id: node.id, label: node.label, degree: nodeDegrees[node.id] ?? 0 }));
    downloadContent(JSON.stringify(payload, null, 2), "life-os-graph-visible-node-degrees.json", "application/json");
  };
  const copyRelationshipSummary = () => {
    const lines = Object.entries(visibleEdgeClusters).map(([relationship, count]) => `${relationship}:${count}`);
    void navigator.clipboard?.writeText(lines.join("\n"));
  };
  const exportVisibleRelationshipsTxt = () => {
    const lines = visibleEdges.map((edge) => `${nodeLabelById[edge.source] ?? edge.source} --${edge.relationship}--> ${nodeLabelById[edge.target] ?? edge.target}`);
    downloadContent(lines.join("\n"), "life-os-graph-visible-relationships.txt", "text/plain");
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
          Min label length
          <input type="number" min={0} value={minLabelLength} onChange={(event) => setMinLabelLength(Math.max(0, Number(event.target.value) || 0))} />
        </label>
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
        <button type="button" onClick={exportVisibleNodeDegreesJson} disabled={visibleNodes.length === 0}>Export Node Degrees JSON</button>
        <button type="button" onClick={exportVisibleNodeIdsTxt} disabled={visibleNodes.length === 0}>Export Node IDs TXT</button>
        <button type="button" onClick={exportVisibleEdgeIdsTxt} disabled={visibleEdges.length === 0}>Export Edge IDs TXT</button>
        <button type="button" onClick={exportVisibleRelationshipsTxt} disabled={visibleEdges.length === 0}>Export Relationships TXT</button>
        <button type="button" onClick={copyRelationshipSummary} disabled={Object.keys(visibleEdgeClusters).length === 0}>Copy Relationship Summary</button>
        <button type="button" onClick={() => { setNodeTypeFilter("all"); setRelationshipFilter("all"); setSearch(""); setEdgeSearch(""); setHideIsolated(false); setMinDegree(0); setMinLabelLength(0); }}>
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

export default function App() {
  return (
    <LifeOsProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LifeOsProvider>
  );
}
