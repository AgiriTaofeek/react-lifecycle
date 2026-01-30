import { LifecycleProvider } from "./context/LifecycleContext";
import LifecycleVisualizer from "./components/LifecycleVisualizer/LifecycleVisualizer";
import "./styles/global.css";
import "./App.css";

function App() {
  return (
    <LifecycleProvider>
      <div className="app-container">
        <header className="app-header">
          <div className="app-header-inner">
            <h1 className="app-title">
              <span className="title-icon">⚛️</span>
              Lifecycle Microscope
            </h1>
            <a
              href="https://react.dev/learn/render-and-commit"
              target="_blank"
              className="docs-link"
            >
              Read Docs ↗
            </a>
          </div>
        </header>
        <main className="app-main">
          <div className="app-bg-noise" />
          <LifecycleVisualizer />
        </main>
      </div>
    </LifecycleProvider>
  );
}

export default App;
