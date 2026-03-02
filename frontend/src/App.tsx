import { FormEvent, useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { LifeOsProvider, useLifeOs } from "./app/life-os-provider";
import { AuthLoginPage, AuthRegisterPage, AuthResetPage, HelpPage } from "./app/pages/auth-help-pages";
import { JournalPage, NotesPage } from "./app/pages/content-pages";
import { ExportPage, ImportPage, SettingsPage } from "./app/pages/data-tools-pages";
import { DashboardPage } from "./app/pages/dashboard-page";
import { CoachPage, SyncPage } from "./app/pages/insights-sync-pages";
import { TasksPage, StoragePage } from "./app/pages/operational-pages";
import { TimelinePage, GraphPage } from "./app/pages/timeline-graph-pages";
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

export default function App() {
  return (
    <LifeOsProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LifeOsProvider>
  );
}
