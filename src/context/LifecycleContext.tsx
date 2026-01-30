import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useMemo,
} from "react";

export type LogType =
  | "render"
  | "layout"
  | "effect"
  | "state"
  | "memo"
  | "cleanup";

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
}

interface LifecycleState {
  logs: LogEntry[];
  isProbeMounted: boolean;
}

interface LifecycleActions {
  addLog: (type: LogType, message: string) => void;
  clearLogs: () => void;
  setProbeMounted: (mounted: boolean) => void;
}

const LifecycleStateContext = createContext<LifecycleState | undefined>(
  undefined,
);
const LifecycleActionContext = createContext<LifecycleActions | undefined>(
  undefined,
);

export const LifecycleProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProbeMounted, setProbeMounted] = useState(false);

  const addLog = useCallback((type: LogType, message: string) => {
    // console.log(`[Lifecycle] ${type}: ${message}`); // Optional: keep console logs for debugging

    // Use setTimeout to avoid "cannot update component while rendering another"
    // and to ensure logs don't block the synchronous render phase
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type,
          message,
          timestamp: Date.now(),
        },
      ]);
    }, 0);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const state = useMemo(
    () => ({ logs, isProbeMounted }),
    [logs, isProbeMounted],
  );
  const actions = useMemo(
    () => ({ addLog, clearLogs, setProbeMounted }),
    [addLog, clearLogs],
  );

  return (
    <LifecycleStateContext.Provider value={state}>
      <LifecycleActionContext.Provider value={actions}>
        {children}
      </LifecycleActionContext.Provider>
    </LifecycleStateContext.Provider>
  );
};

export const useLifecycleState = () => {
  const context = useContext(LifecycleStateContext);
  if (!context)
    throw new Error("useLifecycleState must be used within LifecycleProvider");
  return context;
};

export const useLifecycleActions = () => {
  const context = useContext(LifecycleActionContext);
  if (!context)
    throw new Error(
      "useLifecycleActions must be used within LifecycleProvider",
    );
  return context;
};
