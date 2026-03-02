import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { LifeOsEngine, type PersistedLifeOsState } from "../core/engines/life-os-engine";
import type { NotificationItem, ReviewSummary, TaskPriority, TaskStatus } from "../core/types";
import { type GlobalSearchResult, IndexedDbGateway } from "../lib/db/indexeddb";

interface LifeOsContextValue {
  snapshot: ReturnType<LifeOsEngine["getSnapshot"]>;
  actions: {
    createJournalEntry: (input: { title: string; contentMarkdown: string }) => void;
    createNote: (input: { title: string; contentMarkdown: string }) => void;
    createTask: (input: { title: string; description: string; priority: TaskPriority }) => void;
    completeTask: (taskId: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    createWorkbook: (input: { name: string; metricLabel: string; metricValue: number }) => void;
    syncNow: () => void;
    exportData: () => string;
    importData: (data: string) => { ok: true } | { ok: false; error: string };
    listOpenTasks: () => Promise<number>;
    listRecentJournalTitles: () => Promise<string[]>;
    searchNoteTitles: (query: string) => Promise<string[]>;
    searchGlobal: (query: string) => Promise<GlobalSearchResult[]>;
    generateNotifications: () => NotificationItem[];
    generateReview: (period: "daily" | "weekly") => ReviewSummary;
    exportJournalMarkdown: () => string;
    exportNotesMarkdown: () => string;
    exportTasksCsv: () => string;
  };
}

const LifeOsContext = createContext<LifeOsContextValue | null>(null);

export function LifeOsProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef(new LifeOsEngine());
  const dbRef = useRef(new IndexedDbGateway());
  const [snapshot, setSnapshot] = useState(engineRef.current.getSnapshot());
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = () => setSnapshot(engineRef.current.getSnapshot());
  const persist = () => void dbRef.current.saveNormalizedState(engineRef.current.getPersistedState());

  useEffect(() => {
    void (async () => {
      const persisted = await dbRef.current.loadNormalizedState();
      if (persisted) {
        engineRef.current.hydrateFromPersistedState(persisted);
        refresh();
      }
      setIsHydrated(true);
    })();
  }, []);

  const value = useMemo<LifeOsContextValue>(
    () => ({
      snapshot,
      actions: {
        createJournalEntry: (input) => {
          engineRef.current.createJournalEntry(input);
          refresh();
          persist();
        },
        createNote: (input) => {
          engineRef.current.createNote(input);
          refresh();
          persist();
        },
        createTask: (input) => {
          engineRef.current.createTask(input);
          refresh();
          persist();
        },
        completeTask: (taskId) => {
          engineRef.current.completeTask(taskId);
          refresh();
          persist();
        },
        updateTaskStatus: (taskId, status) => {
          engineRef.current.updateTaskStatus(taskId, status);
          refresh();
          persist();
        },
        createWorkbook: (input) => {
          engineRef.current.createWorkbook(input);
          refresh();
          persist();
        },
        syncNow: () => {
          engineRef.current.syncNow();
          refresh();
          persist();
        },
        exportData: () => JSON.stringify(engineRef.current.getPersistedState(), null, 2),
        importData: (data) => {
          try {
            const parsed = JSON.parse(data) as PersistedLifeOsState;
            engineRef.current.hydrateFromPersistedState(parsed);
            refresh();
            persist();
            return { ok: true };
          } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid import data";
            return { ok: false, error: message };
          }
        },
        listOpenTasks: async () => {
          const tasks = await dbRef.current.listTasksByStatus("todo");
          return tasks.length;
        },
        listRecentJournalTitles: async () => {
          const entries = await dbRef.current.listRecentJournalEntries(5);
          return entries.map((entry) => entry.title);
        },
        searchNoteTitles: async (query) => {
          const notes = await dbRef.current.searchNotes(query);
          return notes.map((note) => note.title);
        },
        searchGlobal: async (query) => dbRef.current.searchAllModules(query),
        generateNotifications: () => engineRef.current.generateNotifications(),
        generateReview: (period) => engineRef.current.generateReview(period),
        exportJournalMarkdown: () => engineRef.current.exportJournalMarkdownBundle(),
        exportNotesMarkdown: () => engineRef.current.exportNotesMarkdownBundle(),
        exportTasksCsv: () => engineRef.current.exportTasksCsv(),
      },
    }),
    [snapshot],
  );

  if (!isHydrated) {
    return <p>Loading Life.OS...</p>;
  }

  return <LifeOsContext.Provider value={value}>{children}</LifeOsContext.Provider>;
}

export function useLifeOs() {
  const context = useContext(LifeOsContext);
  if (!context) {
    throw new Error("useLifeOs must be used inside LifeOsProvider");
  }
  return context;
}

