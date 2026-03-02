import { createContext, type ReactNode, useContext, useMemo, useRef, useState } from "react";
import { LifeOsEngine } from "../core/engines/life-os-engine";
import type { TaskPriority } from "../core/types";

interface LifeOsContextValue {
  snapshot: ReturnType<LifeOsEngine["getSnapshot"]>;
  actions: {
    createJournalEntry: (input: { title: string; contentMarkdown: string }) => void;
    createNote: (input: { title: string; contentMarkdown: string }) => void;
    createTask: (input: { title: string; description: string; priority: TaskPriority }) => void;
    completeTask: (taskId: string) => void;
    createWorkbook: (input: { name: string; metricLabel: string; metricValue: number }) => void;
    syncNow: () => void;
  };
}

const LifeOsContext = createContext<LifeOsContextValue | null>(null);

export function LifeOsProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef(new LifeOsEngine());
  const [snapshot, setSnapshot] = useState(engineRef.current.getSnapshot());

  const refresh = () => setSnapshot(engineRef.current.getSnapshot());

  const value = useMemo<LifeOsContextValue>(
    () => ({
      snapshot,
      actions: {
        createJournalEntry: (input) => {
          engineRef.current.createJournalEntry(input);
          refresh();
        },
        createNote: (input) => {
          engineRef.current.createNote(input);
          refresh();
        },
        createTask: (input) => {
          engineRef.current.createTask(input);
          refresh();
        },
        completeTask: (taskId) => {
          engineRef.current.completeTask(taskId);
          refresh();
        },
        createWorkbook: (input) => {
          engineRef.current.createWorkbook(input);
          refresh();
        },
        syncNow: () => {
          engineRef.current.syncNow();
          refresh();
        },
      },
    }),
    [snapshot],
  );

  return <LifeOsContext.Provider value={value}>{children}</LifeOsContext.Provider>;
}

export function useLifeOs() {
  const context = useContext(LifeOsContext);
  if (!context) {
    throw new Error("useLifeOs must be used inside LifeOsProvider");
  }
  return context;
}

