import { useEffect, useState } from "react";
import { useLifeOs } from "../life-os-provider";
import { downloadContent } from "../../core/utils";

export function CoachPage() {
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
  const [onlyActionableInsights, setOnlyActionableInsights] = useState(false);
  const [notificationUrgencyFilter, setNotificationUrgencyFilter] = useState<"all" | "high" | "medium" | "normal">("all");

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
    const actionableMatch = !onlyActionableInsights || insight.actions.length > 0;
    return moduleMatch && typeMatch && textMatch && actionableMatch;
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
  }).filter((notification) => {
    if (notificationUrgencyFilter === "all") return true;
    const text = `${notification.triggerDescription} ${notification.message}`.toLowerCase();
    if (notificationUrgencyFilter === "high") return text.includes("urgent") || text.includes("overdue");
    if (notificationUrgencyFilter === "medium") return text.includes("soon") || text.includes("today") || text.includes("blocked");
    return !text.includes("urgent") && !text.includes("overdue") && !text.includes("soon") && !text.includes("today") && !text.includes("blocked");
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
  const exportVisibleNotificationsJson = () => {
    downloadContent(JSON.stringify(visibleNotifications, null, 2), "life-os-notifications-visible.json", "application/json");
    setMessage("Visible notifications JSON export created.");
  };
  const exportVisibleLifeMomentsCsv = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = visibleLifeMoments.map((moment) =>
      [moment.id, moment.date, escape(moment.title), escape(moment.description), escape(moment.whyItMatters)].join(","),
    );
    downloadContent(["id,date,title,description,whyItMatters", ...rows].join("\n"), "life-os-life-moments-visible.csv", "text/csv");
    setMessage("Visible life moments CSV export created.");
  };
  const exportUrgencyCountsJson = () => {
    downloadContent(JSON.stringify(urgencyCounts, null, 2), "life-os-notification-urgency-counts.json", "application/json");
    setMessage("Urgency counts JSON export created.");
  };
  const averageInsightAgeDays =
    visibleInsights.length > 0
      ? visibleInsights.reduce((acc, insight) => acc + (Date.now() - new Date(insight.createdAt).getTime()) / 86400000, 0) /
        visibleInsights.length
      : 0;
  const urgencyCounts = visibleNotifications.reduce(
    (acc, notification) => {
      const text = `${notification.triggerDescription} ${notification.message}`.toLowerCase();
      if (text.includes("urgent") || text.includes("overdue")) acc.high += 1;
      else if (text.includes("soon") || text.includes("today") || text.includes("blocked")) acc.medium += 1;
      else acc.normal += 1;
      return acc;
    },
    { high: 0, medium: 0, normal: 0 },
  );

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
        <select value={notificationUrgencyFilter} onChange={(event) => setNotificationUrgencyFilter(event.target.value as typeof notificationUrgencyFilter)}>
          <option value="all">All urgency</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="normal">normal</option>
        </select>
        <button onClick={exportVisibleInsightsJson}>Export Visible Insights JSON</button>
        <button onClick={exportVisibleInsightsCsv}>Export Visible Insights CSV</button>
        <button onClick={() => setOnlyActionableInsights((current) => !current)}>
          {onlyActionableInsights ? "Show All Insights" : "Only Actionable Insights"}
        </button>
        <button onClick={() => void navigator.clipboard?.writeText(visibleInsights.map((insight) => insight.content).join("\n"))} disabled={visibleInsights.length === 0}>
          Copy Visible Insights
        </button>
        <button onClick={exportVisibleNotificationsCsv}>Export Visible Notifications CSV</button>
        <button onClick={exportVisibleNotificationsJson}>Export Visible Notifications JSON</button>
        <button onClick={exportUrgencyCountsJson}>Export Urgency Counts JSON</button>
        <button onClick={exportVisibleLifeMomentsJson}>Export Visible Life Moments JSON</button>
        <button onClick={exportVisibleLifeMomentsCsv}>Export Visible Life Moments CSV</button>
        <button onClick={() => void navigator.clipboard?.writeText(visibleNotifications.map((notification) => notification.message).join("\n"))} disabled={visibleNotifications.length === 0}>
          Copy Notification Messages
        </button>
        <button onClick={() => setMessage(null)}>Clear Message</button>
        <article className="card">Visible insights: {visibleInsights.length}</article>
        <article className="card">Visible notifications: {visibleNotifications.length}</article>
        <article className="card">Visible life moments: {visibleLifeMoments.length}</article>
        <article className="card">Avg insight age: {averageInsightAgeDays.toFixed(1)} days</article>
        <article className="card">Urgency high: {urgencyCounts.high}</article>
        <article className="card">Urgency medium: {urgencyCounts.medium}</article>
        <article className="card">Urgency normal: {urgencyCounts.normal}</article>
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

export function SyncPage() {
  const { snapshot, actions } = useLifeOs();
  const [moduleFilter, setModuleFilter] = useState<"all" | "journal" | "notes" | "tasks" | "storage">("all");
  const [operationFilter, setOperationFilter] = useState<"all" | string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [entityFilter, setEntityFilter] = useState("");
  const [maxAgeHours, setMaxAgeHours] = useState(0);
  const operationTypes = Array.from(new Set(snapshot.syncQueue.map((operation) => operation.operation)));
  const visibleQueue = snapshot.syncQueue
    .filter((operation) => moduleFilter === "all" || operation.module === moduleFilter)
    .filter((operation) => operationFilter === "all" || operation.operation === operationFilter)
    .filter((operation) => entityFilter.trim() === "" || operation.entityId.toLowerCase().includes(entityFilter.trim().toLowerCase()))
    .filter((operation) => maxAgeHours <= 0 || Date.now() - new Date(operation.createdAt).getTime() <= maxAgeHours * 3600000)
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
  const exportOperationCountsJson = () => {
    const payload = visibleQueue.reduce<Record<string, number>>((acc, operation) => {
      acc[operation.operation] = (acc[operation.operation] ?? 0) + 1;
      return acc;
    }, {});
    downloadContent(JSON.stringify(payload, null, 2), "life-os-sync-operation-counts.json", "application/json");
  };
  const copyVisibleQueue = () => {
    void navigator.clipboard?.writeText(JSON.stringify(visibleQueue, null, 2));
  };
  const copyVisibleQueueIds = () => {
    void navigator.clipboard?.writeText(visibleQueue.map((operation) => operation.id).join("\n"));
  };
  const exportVisibleQueueIdsTxt = () => {
    downloadContent(visibleQueue.map((operation) => operation.id).join("\n"), "life-os-sync-visible-ids.txt", "text/plain");
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
        <select value={operationFilter} onChange={(event) => setOperationFilter(event.target.value)}>
          <option value="all">All operations</option>
          {operationTypes.map((operation) => (
            <option key={operation} value={operation}>
              {operation}
            </option>
          ))}
        </select>
        <input value={entityFilter} onChange={(event) => setEntityFilter(event.target.value)} placeholder="Filter by entity id" />
        <input
          type="number"
          min={0}
          value={maxAgeHours}
          onChange={(event) => setMaxAgeHours(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Max age hours (0=none)"
        />
        <button onClick={exportFilteredQueue} disabled={visibleQueue.length === 0}>
          Export Filtered Queue JSON
        </button>
        <button onClick={exportModuleCountsJson} disabled={visibleQueue.length === 0}>
          Export Module Counts JSON
        </button>
        <button onClick={exportOperationCountsJson} disabled={visibleQueue.length === 0}>
          Export Operation Counts JSON
        </button>
        <button onClick={copyVisibleQueue} disabled={visibleQueue.length === 0}>
          Copy Visible Queue
        </button>
        <button onClick={copyVisibleQueueIds} disabled={visibleQueue.length === 0}>
          Copy Visible IDs
        </button>
        <button onClick={exportVisibleQueueIdsTxt} disabled={visibleQueue.length === 0}>
          Export Visible IDs TXT
        </button>
        <button onClick={() => void navigator.clipboard?.writeText((["journal", "notes", "tasks", "storage"] as const).map((module) => `${module}:${visibleQueue.filter((operation) => operation.module === module).length}`).join("\n"))} disabled={visibleQueue.length === 0}>
          Copy Module Counts
        </button>
        <button type="button" onClick={() => { setModuleFilter("all"); setOperationFilter("all"); setSortBy("newest"); setEntityFilter(""); setMaxAgeHours(0); }}>
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
        <article className="card">Stale {"\u003e"}24h: {staleOver24Hours}</article>
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
