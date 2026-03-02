import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLifeOs } from "../life-os-provider";
import { downloadContent } from "../../core/utils";

export function ExportPage() {
  const { actions, snapshot } = useLifeOs();
  const [message, setMessage] = useState<string | null>(null);
  const exportSummary = {
    journalEntries: snapshot.journalEntries.length,
    notes: snapshot.notes.length,
    tasks: snapshot.tasks.length,
    workbooks: snapshot.workbooks.length,
    pendingSync: snapshot.syncQueue.length,
    timelineEvents: snapshot.timeline.length,
  };
  const exportWorkbookMetricsCsv = () => {
    const rows = snapshot.workbooks.flatMap((workbook) =>
      workbook.metrics.map((metric) => `${workbook.id},"${workbook.name.replaceAll('"', '""')}","${metric.label.replaceAll('"', '""')}",${metric.value}`),
    );
    downloadContent(["workbookId,workbookName,metricLabel,metricValue", ...rows].join("\n"), "life-os-export-workbook-metrics.csv", "text/csv");
    setMessage("Workbook metrics CSV export created.");
  };
  const exportPreferencesJson = () => {
    const payload = {
      theme: localStorage.getItem("life-os-theme"),
      authEmail: localStorage.getItem("life-os-auth-email"),
      rememberedEmail: localStorage.getItem("life-os-remembered-email"),
      rememberEmail: localStorage.getItem("life-os-remember-email"),
      marketingOptIn: localStorage.getItem("life-os-marketing-opt-in"),
    };
    downloadContent(JSON.stringify(payload, null, 2), "life-os-local-preferences.json", "application/json");
    setMessage("Local preferences JSON export created.");
  };
  const exportSummaryTxt = () => {
    downloadContent(
      Object.entries(exportSummary)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
      "life-os-export-summary.txt",
      "text/plain",
    );
    setMessage("Export summary TXT created.");
  };

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
        <button
          onClick={() => {
            downloadContent(JSON.stringify(exportSummary, null, 2), "life-os-export-summary.json", "application/json");
            setMessage("Export summary JSON created.");
          }}
        >
          Export Summary JSON
        </button>
        <button
          onClick={() => {
            downloadContent(JSON.stringify(snapshot.syncQueue, null, 2), "life-os-sync-queue.json", "application/json");
            setMessage("Sync queue JSON export created.");
          }}
        >
          Export Sync Queue JSON
        </button>
        <button onClick={exportWorkbookMetricsCsv} disabled={snapshot.workbooks.length === 0}>
          Export Workbook Metrics CSV
        </button>
        <button
          onClick={() =>
            void navigator.clipboard?.writeText(
              Object.entries(exportSummary)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n"),
            )
          }
        >
          Copy Export Summary
        </button>
        <button onClick={exportSummaryTxt}>
          Export Summary TXT
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(actions.exportData())}>
          Copy Full JSON Export
        </button>
        <button type="button" onClick={exportPreferencesJson}>
          Export Local Preferences JSON
        </button>
        <Link to="/settings">Open Settings</Link>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(["life-os-export-summary.json", "life-os-sync-queue.json", "life-os-export-workbook-metrics.csv"].join("\n"))}>
          Copy Export File List
        </button>
        <button type="button" onClick={() => setMessage(null)}>
          Clear Message
        </button>
        <article className="card">Total exportable records: {Object.values(exportSummary).reduce((acc, value) => acc + value, 0)}</article>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}

export function ImportPage() {
  const { actions } = useLifeOs();
  const [importText, setImportText] = useState("");
  const [csvText, setCsvText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [trimImportPayload, setTrimImportPayload] = useState(true);
  const [dryRunCsv, setDryRunCsv] = useState(false);
  const csvPreviewRows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const importFromText = (event: FormEvent) => {
    event.preventDefault();
    const payload = trimImportPayload ? importText.trim() : importText;
    const result = actions.importData(payload);
    setMessage(result.ok ? "Import successful." : `Import failed: ${result.error}`);
  };

  const importFromFile = async (file: File) => {
    const text = await file.text();
    setImportText(text);
    const payload = trimImportPayload ? text.trim() : text;
    const result = actions.importData(payload);
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
    if (dryRunCsv) {
      setMessage(`Dry run parsed ${lines.length - 1} task row(s).`);
      return;
    }
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
  const csvHeaderPreview = csvPreviewRows[0] ?? "";

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
          <label>
            <input type="checkbox" checked={trimImportPayload} onChange={(event) => setTrimImportPayload(event.target.checked)} /> Trim import payload
          </label>
          <textarea
            rows={8}
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            placeholder="Paste exported JSON here"
          />
          <button type="button" onClick={() => void navigator.clipboard?.writeText(importText)} disabled={!importText.trim()}>
            Copy JSON Input
          </button>
          <button type="button" onClick={() => setImportText('{"journalEntries":[],"notes":[],"tasks":[],"workbooks":[],"timeline":[],"graphNodes":[],"graphEdges":[],"insights":[],"syncQueue":[],"syncStatus":{"state":"idle"}}')}>
            Load Sample JSON
          </button>
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
          <button
            type="button"
            onClick={() => setCsvText("title,description,priority,dueDate,status\nSample task,Imported from sample,medium,,todo")}
          >
            Load Sample CSV
          </button>
          <label>
            <input type="checkbox" checked={dryRunCsv} onChange={(event) => setDryRunCsv(event.target.checked)} /> Dry run CSV import
          </label>
          <button type="button" onClick={() => setCsvText("")}>Clear CSV Input</button>
          <button type="submit">Import Tasks CSV</button>
        </form>
        <button type="button" onClick={() => { setImportText(""); setCsvText(""); setMessage(null); }}>
          Clear All Inputs
        </button>
        <button type="button" onClick={() => setMessage(null)}>
          Clear Message
        </button>
        <article className="card">CSV preview rows: {csvPreviewRows.length}</article>
        <article className="card">CSV header: {csvHeaderPreview || "n/a"}</article>
        <article className="card">JSON input chars: {importText.length}</article>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}

export function SettingsPage() {
  const { actions, snapshot } = useLifeOs();
  const [noteSearch, setNoteSearch] = useState("");
  const [noteSearchResults, setNoteSearchResults] = useState<string[]>([]);
  const [openTaskCount, setOpenTaskCount] = useState<number | null>(null);
  const [recentJournalTitles, setRecentJournalTitles] = useState<string[]>([]);
  const [noteSearchMinLength, setNoteSearchMinLength] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showStateDetails, setShowStateDetails] = useState(false);
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState(15);

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
  const exportStateStatsTxt = () => {
    const lines = [
      `journalEntries: ${snapshot.journalEntries.length}`,
      `notes: ${snapshot.notes.length}`,
      `tasks: ${snapshot.tasks.length}`,
      `workbooks: ${snapshot.workbooks.length}`,
      `timelineEvents: ${snapshot.timeline.length}`,
      `graphNodes: ${snapshot.graphNodes.length}`,
      `graphEdges: ${snapshot.graphEdges.length}`,
      `insights: ${snapshot.insights.length}`,
      `totalRecords: ${totalStateRecords}`,
    ];
    downloadContent(lines.join("\n"), "life-os-state-stats.txt", "text/plain");
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
    downloadContent(JSON.stringify(filteredNoteSearchResults, null, 2), "life-os-note-search-results.json", "application/json");
  };
  const filteredNoteSearchResults = noteSearchResults.filter((title) => title.trim().length >= noteSearchMinLength);
  const exportSearchResultsTxt = () => {
    downloadContent(filteredNoteSearchResults.join("\n"), "life-os-note-search-results.txt", "text/plain");
  };
  const exportRecentJournalTitlesTxt = () => {
    downloadContent(recentJournalTitles.join("\n"), "life-os-recent-journal-titles.txt", "text/plain");
  };
  const exportSearchResultsCsv = () => {
    const rows = filteredNoteSearchResults.map((title) => `"${title.replaceAll('"', '""')}"`);
    downloadContent(["title", ...rows].join("\n"), "life-os-note-search-results.csv", "text/csv");
  };
  const copyTotalStateSummary = () => {
    void navigator.clipboard?.writeText(
      [
        `journal:${snapshot.journalEntries.length}`,
        `notes:${snapshot.notes.length}`,
        `tasks:${snapshot.tasks.length}`,
        `workbooks:${snapshot.workbooks.length}`,
        `timeline:${snapshot.timeline.length}`,
        `graphNodes:${snapshot.graphNodes.length}`,
        `graphEdges:${snapshot.graphEdges.length}`,
        `insights:${snapshot.insights.length}`,
        `total:${totalStateRecords}`,
      ].join("\n"),
    );
  };
  const totalStateRecords =
    snapshot.journalEntries.length +
    snapshot.notes.length +
    snapshot.tasks.length +
    snapshot.workbooks.length +
    snapshot.timeline.length +
    snapshot.graphNodes.length +
    snapshot.graphEdges.length +
    snapshot.insights.length;

  useEffect(() => {
    if (!autoRefresh) return;
    void refreshOpenTaskCount();
    void refreshRecentJournalTitles();
    const interval = window.setInterval(() => {
      void refreshOpenTaskCount();
      void refreshRecentJournalTitles();
    }, Math.max(5, refreshIntervalSeconds) * 1000);
    return () => window.clearInterval(interval);
  }, [autoRefresh, refreshIntervalSeconds]);

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
        <button type="button" onClick={exportStateStatsTxt}>
          Export State Stats TXT
        </button>
        <button type="button" onClick={clearCachedSearch}>
          Clear Cached Search
        </button>
        <button type="button" onClick={exportSearchResultsJson} disabled={noteSearchResults.length === 0}>
          Export Search Results JSON
        </button>
        <button type="button" onClick={exportSearchResultsTxt} disabled={filteredNoteSearchResults.length === 0}>
          Export Search Results TXT
        </button>
        <button type="button" onClick={exportSearchResultsCsv} disabled={filteredNoteSearchResults.length === 0}>
          Export Search Results CSV
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(filteredNoteSearchResults.join("\n"))} disabled={filteredNoteSearchResults.length === 0}>
          Copy Search Results
        </button>
        <button type="button" onClick={quickStateReset}>
          Quick State Reset
        </button>
        <button type="button" onClick={() => { setAutoRefresh((current) => !current); }}>
          {autoRefresh ? "Stop Auto Refresh" : "Start Auto Refresh"}
        </button>
        <input
          type="number"
          min={5}
          value={refreshIntervalSeconds}
          onChange={(event) => setRefreshIntervalSeconds(Math.max(5, Number(event.target.value) || 5))}
          placeholder="Auto-refresh sec"
        />
        <button type="button" onClick={() => setShowStateDetails((current) => !current)}>
          {showStateDetails ? "Hide State Details" : "Show State Details"}
        </button>
        <button type="button" onClick={() => { setShowStateDetails(false); setAutoRefresh(false); setRefreshIntervalSeconds(15); }}>
          Reset Display Controls
        </button>
        <button type="button" onClick={() => { void refreshOpenTaskCount(); void refreshRecentJournalTitles(); }}>
          Refresh All Widgets
        </button>
        <button type="button" onClick={() => { setOpenTaskCount(null); setRecentJournalTitles([]); }}>
          Clear Widget Data
        </button>
        <button type="button" onClick={exportRecentJournalTitlesTxt} disabled={recentJournalTitles.length === 0}>
          Export Recent Titles TXT
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(recentJournalTitles.join("\n"))} disabled={recentJournalTitles.length === 0}>
          Copy Recent Titles
        </button>
        <button type="button" onClick={copyTotalStateSummary}>
          Copy Total State Summary
        </button>
        <article className="card">Auto refresh interval: {refreshIntervalSeconds}s</article>
        <article className="card">Filtered note results: {filteredNoteSearchResults.length}</article>
        <div className="cards">
          <Link to="/export">Open Export</Link>
          <Link to="/import">Open Import</Link>
          <Link to="/help">Open Help</Link>
        </div>
        <div className="cards">
          <article className="card">State: journal {snapshot.journalEntries.length}</article>
          <article className="card">State: notes {snapshot.notes.length}</article>
          <article className="card">State: tasks {snapshot.tasks.length}</article>
          <article className="card">State: workbooks {snapshot.workbooks.length}</article>
          <article className="card">State: total records {totalStateRecords}</article>
        </div>
        {showStateDetails ? (
          <div className="cards">
            <article className="card">Timeline events: {snapshot.timeline.length}</article>
            <article className="card">Graph nodes/edges: {snapshot.graphNodes.length} / {snapshot.graphEdges.length}</article>
            <article className="card">Insights: {snapshot.insights.length}</article>
          </div>
        ) : null}
        <form className="stack" onSubmit={runNoteSearch}>
          <input
            value={noteSearch}
            onChange={(event) => setNoteSearch(event.target.value)}
            placeholder="Search notes from local DB"
          />
          <input
            type="number"
            min={0}
            value={noteSearchMinLength}
            onChange={(event) => setNoteSearchMinLength(Math.max(0, Number(event.target.value) || 0))}
            placeholder="Min title length"
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
          {filteredNoteSearchResults.map((title) => (
            <li key={title} className="card">
              {title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
