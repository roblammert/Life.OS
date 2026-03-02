import { type FormEvent, useState } from "react";
import { useLifeOs } from "../life-os-provider";
import type { TaskPriority, TaskStatus } from "../../core/types";
import { downloadContent } from "../../core/utils";

export function TasksPage() {
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
  const [quickCreatedOnly, setQuickCreatedOnly] = useState(false);
  const [excludeDone, setExcludeDone] = useState(false);
  const [requireDueDate, setRequireDueDate] = useState(false);
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
    .filter((task) => !quickCreatedOnly || (!task.description.trim() && !task.dueDate))
    .filter((task) => !excludeDone || task.status !== "done")
    .filter((task) => !requireDueDate || Boolean(task.dueDate))
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
    quickCreatedOnly ? "quick-only" : null,
    excludeDone ? "exclude-done" : null,
    requireDueDate ? "has-due-date" : null,
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
  const exportFilteredTaskIdsTxt = () => {
    downloadContent(filteredTasks.map((task) => task.id).join("\n"), "life-os-tasks-filtered-ids.txt", "text/plain");
  };
  const exportFilteredDueDatesCsv = () => {
    const rows = filteredTasks
      .filter((task) => task.dueDate)
      .map((task) => `${task.id},"${task.title.replaceAll('"', '""')}",${task.dueDate}`);
    downloadContent(["id,title,dueDate", ...rows].join("\n"), "life-os-tasks-due-dates.csv", "text/csv");
  };
  const exportActiveFiltersTxt = () => {
    downloadContent(activeTaskFilters.join("\n"), "life-os-task-active-filters.txt", "text/plain");
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
        <button type="button" onClick={() => setQuickCreatedOnly((current) => !current)}>
          {quickCreatedOnly ? "All Tasks" : "Quick-Created Only"}
        </button>
        <button type="button" onClick={() => setExcludeDone((current) => !current)}>
          {excludeDone ? "Include Done" : "Exclude Done"}
        </button>
        <button type="button" onClick={() => setRequireDueDate((current) => !current)}>
          {requireDueDate ? "Include No Due Date" : "Require Due Date"}
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
        <button type="button" onClick={() => void navigator.clipboard?.writeText(filteredTasks.map((task) => task.title).join("\n"))} disabled={filteredTasks.length === 0}>
          Copy Visible Titles
        </button>
        <button type="button" onClick={exportStatusSnapshotJson} disabled={filteredTasks.length === 0}>
          Export Status Snapshot JSON
        </button>
        <button type="button" onClick={exportFilteredTaskIdsTxt} disabled={filteredTasks.length === 0}>
          Export IDs TXT
        </button>
        <button type="button" onClick={exportFilteredDueDatesCsv} disabled={filteredTasks.filter((task) => task.dueDate).length === 0}>
          Export Due Dates CSV
        </button>
        <button type="button" onClick={exportActiveFiltersTxt} disabled={activeTaskFilters.length === 0}>
          Export Active Filters TXT
        </button>
        <button type="button" onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); setDueFilter("all"); setSortBy("created_desc"); setSearch(""); setQuickCreatedOnly(false); setExcludeDone(false); setRequireDueDate(false); }}>
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
        <button type="button" onClick={() => void navigator.clipboard?.writeText(nextTask?.title ?? "")} disabled={!nextTask}>
          Copy Next Focus
        </button>
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
                  .filter((task) => filteredTasks.map((filtered) => filtered.id).includes(task.id))
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

export function StoragePage() {
  const { snapshot, actions } = useLifeOs();
  const [name, setName] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [metricValue, setMetricValue] = useState("0");
  const [search, setSearch] = useState("");
  const [metricSearch, setMetricSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc" | "metrics_desc">("name_asc");
  const [minMetricValue, setMinMetricValue] = useState(0);
  const [minMetricCount, setMinMetricCount] = useState(0);
  const [minNameLength, setMinNameLength] = useState(0);

  const displayedWorkbooks = snapshot.workbooks
    .filter((workbook) => workbook.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((workbook) => workbook.name.trim().length >= minNameLength)
    .filter((workbook) =>
      metricSearch.trim() === ""
        ? true
        : workbook.metrics.some((metric) => metric.label.toLowerCase().includes(metricSearch.trim().toLowerCase())),
    )
    .filter((workbook) => workbook.metrics.some((metric) => metric.value >= minMetricValue))
    .filter((workbook) => workbook.metrics.length >= minMetricCount)
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
  const exportWorkbookTotalsJson = () => {
    downloadContent(JSON.stringify(workbookMetricTotals, null, 2), "life-os-storage-workbook-totals.json", "application/json");
  };
  const exportVisibleMetricsJson = () => {
    const payload = displayedWorkbooks.flatMap((workbook) =>
      workbook.metrics.map((metric) => ({ workbookId: workbook.id, workbookName: workbook.name, ...metric })),
    );
    downloadContent(JSON.stringify(payload, null, 2), "life-os-storage-visible-metrics.json", "application/json");
  };
  const copyVisibleMetricLabels = () => {
    const labels = displayedWorkbooks.flatMap((workbook) => workbook.metrics.map((metric) => metric.label));
    void navigator.clipboard?.writeText(labels.join("\n"));
  };
  const exportWorkbookTotalsCsv = () => {
    const rows = workbookMetricTotals.map((item) => `"${item.name.replaceAll('"', '""')}",${item.total}`);
    downloadContent(["name,totalMetricValue", ...rows].join("\n"), "life-os-storage-workbook-totals.csv", "text/csv");
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
        <input
          type="number"
          value={minMetricValue}
          onChange={(event) => setMinMetricValue(Number(event.target.value) || 0)}
          placeholder="Min metric value"
        />
        <input
          type="number"
          min={0}
          value={minMetricCount}
          onChange={(event) => setMinMetricCount(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Min metric count"
        />
        <input
          type="number"
          min={0}
          value={minNameLength}
          onChange={(event) => setMinNameLength(Math.max(0, Number(event.target.value) || 0))}
          placeholder="Min name length"
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
        <button type="button" onClick={exportWorkbookTotalsJson} disabled={displayedWorkbooks.length === 0}>
          Export Workbook Totals JSON
        </button>
        <button type="button" onClick={exportVisibleMetricsJson} disabled={displayedWorkbooks.length === 0}>
          Export Visible Metrics JSON
        </button>
        <button type="button" onClick={copyVisibleMetricLabels} disabled={displayedWorkbooks.length === 0}>
          Copy Metric Labels
        </button>
        <button type="button" onClick={exportWorkbookTotalsCsv} disabled={workbookMetricTotals.length === 0}>
          Export Workbook Totals CSV
        </button>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(displayedWorkbooks.map((workbook) => workbook.name).join("\n"))}
          disabled={displayedWorkbooks.length === 0}
        >
          Copy Workbook Names
        </button>
        <button type="button" onClick={() => { setSearch(""); setMetricSearch(""); setSortBy("name_asc"); setMinMetricValue(0); setMinMetricCount(0); setMinNameLength(0); }}>
          Reset Filters
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(topWorkbookMetricTotal ? `${topWorkbookMetricTotal.name}:${topWorkbookMetricTotal.total}` : "")} disabled={!topWorkbookMetricTotal}>
          Copy Top Workbook Total
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
