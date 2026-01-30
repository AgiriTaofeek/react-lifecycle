import { useEffect, useRef, useState, useMemo } from "react";
import {
  useLifecycleState,
  type LogEntry,
} from "../../context/LifecycleContext";
import { gsap } from "gsap";
import { ChevronRight, ChevronDown, Trash2 } from "lucide-react";
import "./LogConsole.css";

const LogItem = ({ log, index }: { log: LogEntry; index: number }) => {
  const el = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (el.current) {
      gsap.fromTo(
        el.current,
        { opacity: 0, x: -10, height: 0, marginBottom: 0 },
        {
          opacity: 1,
          x: 0,
          height: "auto",
          marginBottom: "0.5rem",
          duration: 0.3,
          ease: "power2.out",
        },
      );
    }
  }, []);

  // Helper to add specific class based on type
  const getTypeClass = (type: string) => {
    switch (type) {
      case "render":
        return "render";
      case "layout":
        return "layout";
      case "effect":
        return "effect";
      case "cleanup":
        return "cleanup";
      case "state":
        return "state";
      case "memo":
        return "memo";
      default:
        return "";
    }
  };

  return (
    <li ref={el} className={`log-item ${getTypeClass(log.type)}`}>
      <span className="log-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="log-content">
        <div className="log-header-line">
          <span className="log-type-badge">{log.type}</span>
          <span className="log-time">
            {
              new Date(log.timestamp)
                .toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  fractionalSecondDigits: 3,
                })
                .split(" ")[0]
            }
          </span>
        </div>
        <div className="log-message">{log.message}</div>
      </div>
    </li>
  );
};

interface LogGroupData {
  id: string;
  title: string;
  logs: LogEntry[];
  timestamp: number;
  type: "mount" | "update" | "unmount" | "other";
}

const LogGroup = ({
  group,
  isExpanded,
  onToggle,
  startIndex,
}: {
  group: LogGroupData;
  isExpanded: boolean;
  onToggle: () => void;
  startIndex: number;
}) => {
  return (
    <div className={`log-group ${group.type}`}>
      <div className="log-group-header" onClick={onToggle}>
        <div className="group-info">
          <button className="group-toggle-btn">
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
          <span className="group-title">{group.title}</span>
          <span className="group-time">
            {new Date(group.timestamp).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <span className="group-badge">{group.logs.length} events</span>
      </div>
      {isExpanded && (
        <ul className="group-logs-list">
          {group.logs.map((log, i) => (
            <LogItem key={log.id} log={log} index={startIndex + i} />
          ))}
        </ul>
      )}
    </div>
  );
};

const LogConsole = () => {
  const { logs } = useLifecycleState();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(
    new Set(),
  );

  // Grouping Logic
  const groups = useMemo(() => {
    const grouped: LogGroupData[] = [];
    let currentGroup: LogGroupData | null = null;

    logs.forEach((log) => {
      const isRenderStart =
        log.type === "render" && log.message.includes("Render start");
      const isCleanup = log.type === "cleanup";

      // Determine if we need a new group
      let shouldStartNewGroup = false;
      let newGroupType: LogGroupData["type"] = "other";
      let newGroupTitle = "Lifecycle Events";

      if (grouped.length === 0 && !currentGroup) {
        shouldStartNewGroup = true;
      } else if (isRenderStart) {
        shouldStartNewGroup = true;
      } else if (isCleanup && currentGroup?.type !== "unmount") {
        // Unmount Detection:
        // If the current group ended with an 'effect', it means the cycle (Mount/Update) completed.
        // A subsequent 'cleanup' therefore implies the start of an Unmount phase.
        // In contrast, during an Update, cleanup happens *before* the new effect setup.
        const lastLog = currentGroup?.logs[currentGroup.logs.length - 1];
        // We check strictly for 'effect' type as the last event.
        const isAfterCompletedCycle = lastLog?.type === "effect";

        shouldStartNewGroup = isCleanup && isAfterCompletedCycle;

        if (shouldStartNewGroup) {
          newGroupType = "unmount";
          newGroupTitle = "Unmount Phase";
        }
      }

      if (isRenderStart) {
        newGroupType = log.message.includes("Mount") ? "mount" : "update";
        newGroupTitle = log.message.includes("Mount")
          ? "Mount Phase"
          : "Update Phase";
      }

      if (shouldStartNewGroup) {
        // Strict Mode Handling:
        // React 18 Strict Mode double-invokes effects/renders in Dev.
        // Sequence: Mount(Render) -> Mount(Render #2) -> Effect -> Cleanup -> Effect.
        // This causes "Update Phase" (Render #2) and "Unmount Phase" (Cleanup) to appear on Mount.
        // We detect this by checking if the previous group was "Mount Phase" and occurred very recently (< 200ms).
        const timeDiff = currentGroup
          ? log.timestamp - currentGroup.timestamp
          : Infinity;
        const isStrictModeArtifact =
          currentGroup?.type === "mount" && timeDiff < 200;

        if (
          isStrictModeArtifact &&
          (newGroupType === "update" || newGroupType === "unmount")
        ) {
          // Merge into current Mount group instead of starting new one
          shouldStartNewGroup = false;
        }

        if (shouldStartNewGroup) {
          if (currentGroup) {
            grouped.push(currentGroup);
          }
          currentGroup = {
            id: `group-${log.id}`,
            title: newGroupTitle,
            logs: [],
            timestamp: log.timestamp,
            type: newGroupType,
          };
        }
      }

      if (!currentGroup) {
        // Fallback for first log if not render start
        currentGroup = {
          id: `group-${log.id}`,
          title: "Lifecycle Events",
          logs: [],
          timestamp: log.timestamp,
          type: "other",
        };
      }

      currentGroup.logs.push(log);
    });

    if (currentGroup) {
      grouped.push(currentGroup);
    }

    return grouped;
  }, [logs]);

  // Auto-expand new groups
  useEffect(() => {
    if (groups.length > 0) {
      const lastGroup = groups[groups.length - 1];
      // Only auto-expand if we haven't seen this group ID yet (or simplistic: always expand last)
      setExpandedGroupIds(new Set([lastGroup.id]));
    }
  }, [groups.length]);

  const toggleGroup = (id: string) => {
    setExpandedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    if (logs.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length, expandedGroupIds]);

  // Calc running index
  const getStartIndex = (groupIndex: number) => {
    let count = 0;
    for (let i = 0; i < groupIndex; i++) {
      count += groups[i].logs.length;
    }
    return count;
  };

  return (
    <div className="log-console">
      <div className="log-header">
        <h3 className="log-title">
          <span className="live-indicator">
            <span className="live-ping"></span>
            <span className="live-dot"></span>
          </span>
          Lifecycle Log
        </h3>
        <span className="log-count">{logs.length} events</span>
      </div>
      <div className="log-list-container custom-scrollbar">
        {groups.length === 0 ? (
          <div className="empty-state">
            <Trash2 className="empty-icon" size={32} />
            <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>
              Waiting for lifecycle events...
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                marginTop: "0.25rem",
                opacity: 0.7,
              }}
            >
              Interact with the component to start logging
            </p>
          </div>
        ) : (
          <div className="groups-container">
            {groups.map((group, index) => (
              <LogGroup
                key={group.id}
                group={group}
                isExpanded={expandedGroupIds.has(group.id)}
                onToggle={() => toggleGroup(group.id)}
                startIndex={getStartIndex(index)}
              />
            ))}
            <div ref={bottomRef} style={{ height: "0.5rem" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogConsole;
