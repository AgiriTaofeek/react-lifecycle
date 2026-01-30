import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
  memo,
} from "react";
import { useLifecycleActions } from "../../context/LifecycleContext";
import "./LifecycleProbe.css";

function LifecycleProbe() {
  const { addLog } = useLifecycleActions();
  const renderCount = useRef(0);

  // LOG: Render Start
  const isMount = renderCount.current === 0;
  const renderLabel = isMount ? "Mount" : "Update";

  if (isMount) {
    addLog("render", `🔵 Render start (${renderLabel})`);
  } else {
    addLog("render", `🔵 Render start (Update #${renderCount.current})`);
  }

  const [count, setCount] = useState(() => {
    addLog("state", "🟢 useState initializer (runs once on mount)");
    return 0;
  });

  const computed = useMemo(() => {
    addLog("memo", "🟡 useMemo computation");
    return count * 2;
  }, [count, addLog]);

  useLayoutEffect(() => {
    addLog("layout", "🟣 useLayoutEffect (DOM mutations done, before paint)");
    return () => {
      addLog("cleanup", "🔴 useLayoutEffect cleanup");
    };
  });

  useEffect(() => {
    addLog("effect", "🟠 useEffect (after paint)");
    return () => {
      addLog("cleanup", "🔴 useEffect cleanup");
    };
  });

  // LOG: Render End
  addLog("render", "🔵 Render end");
  renderCount.current++;

  return (
    <div className="lifecycle-probe-card">
      <h3 className="probe-title">Lifecycle Probe</h3>

      <div className="probe-stats">
        <div className="probe-stat-row">
          <span className="stat-label">Count State</span>
          <span className="stat-value count">{count}</span>
        </div>
        <div className="probe-stat-row">
          <span className="stat-label">Computed (2x)</span>
          <span className="stat-value computed">{computed}</span>
        </div>
      </div>

      <button onClick={() => setCount((c) => c + 1)} className="probe-button">
        <span>Increment State</span>
      </button>
    </div>
  );
}

export default memo(LifecycleProbe);
