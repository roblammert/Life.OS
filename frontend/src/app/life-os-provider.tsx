import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { LifeOsEngine, type PersistedLifeOsState } from "../core/engines/life-os-engine";
import type { TaskPriority } from "../core/types";
import { IndexedDbGateway } from "../lib/db/indexeddb";

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
  const dbRef = useRef(new IndexedDbGateway());
  const [snapshot, setSnapshot] = useState(engineRef.current.getSnapshot());
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = () => setSnapshot(engineRef.current.getSnapshot());
  const persist = () => void dbRef.current.saveAppState(engineRef.current.getPersistedState());

  useEffect(() => {
    void (async () => {
      const persisted = await dbRef.current.loadAppState<PersistedLifeOsState>();
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

