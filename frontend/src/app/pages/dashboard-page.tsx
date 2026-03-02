import { useEffect, useState } from "react";
import { useLifeOs } from "../life-os-provider";
import { downloadContent } from "../../core/utils";

export function DashboardPage() {
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
  const highPriorityOpenCount = snapshot.tasks.filter((task) => task.priority === "high" && task.status !== "done").length;
  const blockedOpenCount = snapshot.tasks.filter((task) => task.status === "blocked" && task.status !== "done").length;
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
  const exportTaskStatusCountsJson = () => {
    downloadContent(JSON.stringify(taskStatusCounts, null, 2), "life-os-dashboard-task-status-counts.json", "application/json");
  };
  const exportOverdueTaskIdsTxt = () => {
    downloadContent(overdueTasks.map((task) => task.id).join("\n"), "life-os-overdue-task-ids.txt", "text/plain");
  };
  const exportModuleActivityJson = () => {
    downloadContent(JSON.stringify(moduleActivity, null, 2), "life-os-module-activity.json", "application/json");
  };
  const exportTaskHealthJson = () => {
    downloadContent(
      JSON.stringify(
        {
          totalTasks: snapshot.tasks.length,
          doneTasks: snapshot.tasks.filter((task) => task.status === "done").length,
          overdueCount,
          upcomingCount,
          highPriorityOpenCount,
          blockedOpenCount,
        },
        null,
        2,
      ),
      "life-os-task-health.json",
      "application/json",
    );
  };
  const exportRecentJournalTitlesTxt = () => {
    downloadContent(recentTitles.join("\n"), "life-os-dashboard-recent-journal-titles.txt", "text/plain");
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
        <article className="card">Done tasks: {snapshot.tasks.filter((task) => task.status === "done").length}</article>
        <article className="card">High-priority open tasks: {highPriorityOpenCount}</article>
        <article className="card">Blocked open tasks: {blockedOpenCount}</article>
        <button type="button" onClick={exportSnapshotSummaryJson}>Export Snapshot Summary JSON</button>
        <button type="button" onClick={exportDashboardSummaryMarkdown}>Export Summary MD</button>
        <button type="button" onClick={exportTaskStatusCountsJson} disabled={Object.keys(taskStatusCounts).length === 0}>
          Export Task Status JSON
        </button>
        <button type="button" onClick={exportModuleActivityJson} disabled={Object.keys(moduleActivity).length === 0}>
          Export Module Activity JSON
        </button>
        <button type="button" onClick={exportTaskHealthJson}>
          Export Task Health JSON
        </button>
        <button type="button" onClick={exportUpcomingTasksCsv} disabled={upcomingTasks.length === 0}>
          Export Upcoming Tasks CSV
        </button>
        <button type="button" onClick={exportCompletedTasksCsv} disabled={recentCompletedTasks.length === 0}>
          Export Completed Tasks CSV
        </button>
        <button type="button" onClick={exportOverdueTasksCsv} disabled={overdueTasks.length === 0}>
          Export Overdue Tasks CSV
        </button>
        <button type="button" onClick={exportOverdueTaskIdsTxt} disabled={overdueTasks.length === 0}>
          Export Overdue IDs TXT
        </button>
        <button type="button" onClick={exportRecentJournalTitlesTxt} disabled={recentTitles.length === 0}>
          Export Recent Journal Titles TXT
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(upcomingTasks.map((task) => task.title).join("\n"))} disabled={upcomingTasks.length === 0}>
          Copy Upcoming Titles
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(overdueTasks.map((task) => task.title).join("\n"))} disabled={overdueTasks.length === 0}>
          Copy Overdue Titles
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
