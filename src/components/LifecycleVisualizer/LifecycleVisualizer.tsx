import {
  useLifecycleState,
  useLifecycleActions,
} from "../../context/LifecycleContext";
import LifecycleProbe from "../LifecycleProbe/LifecycleProbe";
import LifecycleProbeSource from "../LifecycleProbe/LifecycleProbe?raw";
import CodeModal from "../CodeModal/CodeModal";
import LogConsole from "../LogConsole/LogConsole";
import { Trash2, Play, Square, Code } from "lucide-react";
import { useState } from "react";
import "./LifecycleVisualizer.css";

const LifecycleVisualizer = () => {
  const { isProbeMounted } = useLifecycleState();
  const { setProbeMounted, clearLogs } = useLifecycleActions();

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div className="visualizer-layout">
      <div className="visualizer-left-col">
        <section className="control-panel">
          <div className="control-header">
            <div className="control-title-group">
              <h2 className="control-title">Control Panel</h2>
              <div
                className={`status-dot ${isProbeMounted ? "active" : "inactive"}`}
              />
            </div>
            <div className="control-actions">
              <button
                onClick={clearLogs}
                className="clear-btn"
                title="Clear all logs"
              >
                <Trash2 size={14} />
                Clear Logs
              </button>
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="clear-btn"
                title="View source code"
              >
                <Code size={14} />
                View Code
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="mount-btn-container">
            <button
              onClick={() => setProbeMounted(!isProbeMounted)}
              className={`mount-btn ${isProbeMounted ? "unmount" : "mount"}`}
            >
              {isProbeMounted ? (
                <>
                  <Square size={20} fill="currentColor" />
                  Unmount Component
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  Mount Component
                </>
              )}
            </button>
            <p className="mount-hint">
              {isProbeMounted
                ? "Click to unmount and trigger cleanup effects"
                : "Click to mount and trigger initial render effects"}
            </p>
          </div>

          <div className="stage-container">
            <div className="stage-noise" />

            {isProbeMounted ? (
              <div className="stage-content">
                <LifecycleProbe />
              </div>
            ) : (
              <div className="stage-empty">
                <div className="stage-empty-icon">
                  <Square size={24} style={{ opacity: 0.5 }} />
                </div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Component Unmounted
                </p>
                <p style={{ fontSize: "0.875rem", opacity: 0.6 }}>
                  Mount it to see the lifecycle in action
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Legend */}
        <section className="legend-card">
          <h3 className="legend-title">Phase Legend</h3>
          <div className="legend-grid">
            <div
              className="legend-item"
              style={{ color: "var(--phase-render)" }}
            >
              <span className="legend-dot" /> Render
            </div>
            <div
              className="legend-item"
              style={{ color: "var(--phase-layout)" }}
            >
              <span className="legend-dot" /> Layout Effect
            </div>
            <div
              className="legend-item"
              style={{ color: "var(--phase-effect)" }}
            >
              <span className="legend-dot" /> Effect
            </div>
            <div
              className="legend-item"
              style={{ color: "var(--phase-cleanup)" }}
            >
              <span className="legend-dot" /> Cleanup
            </div>
            <div className="legend-item" style={{ color: "#34d399" }}>
              <span className="legend-dot" /> State Init
            </div>
          </div>
        </section>
      </div>

      <div className="console-wrapper">
        <LogConsole />
      </div>

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        code={LifecycleProbeSource}
      />
    </div>
  );
};

export default LifecycleVisualizer;
