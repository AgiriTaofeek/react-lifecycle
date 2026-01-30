import { useRef } from "react";
import { useLifecycleActions, type LogType } from "../context/LifecycleContext";

export const useLifecycleLogger = () => {
  const { addLog } = useLifecycleActions();

  // Use a ref to track render count to identify updates
  const renderCount = useRef(0);

  const log = (type: LogType, message: string) => {
    addLog(type, message);
  };

  return { log, renderCount };
};
