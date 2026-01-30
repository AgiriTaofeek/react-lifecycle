# ⚛️ Lifecycle Microscope

A powerful educational tool designed to visualize, explore, and understand the internal execution order of React Component lifecycles in real-time.

Built with **React 19** and **TypeScript**, this application provides an interactive "Microscope" to observe when and how renders, effects, and state updates occur during the mounting, updating, and unmounting phases.

## ✨ Features

- **Real-Time Lifecycle Logging**: Watch as lifecycle events fire in the exact order they occur in the browser.
- **Phase Visualization**: Distinct color-coding for different phases:
  - 🔵 **Render**: The render phase start/end.
  - 🟣 **Layout Effect**: `useLayoutEffect` (synchronous, before paint).
  - 🟠 **Effect**: `useEffect` (asynchronous, after paint).
  - 🟢 **State**: `useState` initialization.
  - 🟡 **Memo**: `useMemo` calculation.
  - 🔴 **Cleanup**: Cleanup functions for effects.
- **Interactive Control**:
  - **Mount/Unmount**: Manually trigger the mount and unmount sequences to observe setup and cleanup flows.
  - **State Updates**: Interact with the probe component to trigger re-renders and observe the update cycle.
- **Log Console**: A dedicated console to capture and persist lifecycle events.
- **Source Code View**: View the actual code of the probe component alongside the visualizer to map events to code.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (with CSS Variables & Modules approach)
- **Icons**: Lucide React
- **Syntax Highlighting**: React Syntax Highlighter

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/AgiriTaofeek/react-lifecycle.git
    cd react-lifecycle
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to view the app.

## 📖 How to Use

1.  **Mounting**:
    - Click the **"Mount Component"** button in the Control Panel.
    - Watch the Log Console populate with the initialization sequence: `useState` -> `Render` -> `useLayoutEffect` -> `useEffect`.

2.  **Updating**:
    - Once mounted, click the **"Increment State"** button on the "Lifecycle Probe" card.
    - Observe the update sequence: `Render` -> `Cleanup` (for previous effects) -> `Effect` (new effects runs).

3.  **Unmounting**:
    - Click **"Unmount Component"** to see the teardown sequence.
    - Note how cleanup functions for all active effects are fired.

4.  **Analyze**:
    - Use the **"View Code"** button to see the implementation of the probe and understand _why_ the logs appear in that order.

## 📂 Project Structure

```text
src/
├── components/
│   ├── CodeModal/          # Modal for viewing source code
│   ├── LifecycleProbe/     # The component being observed (contains the hooks)
│   ├── LifecycleVisualizer/ # Main UI controller for the microscope
│   ├── LogConsole/         # Display area for lifecycle logs
│   └── ...
├── context/
│   └── LifecycleContext.tsx # Global state for logs and probe status
├── hooks/
│   └── useLifecycleLogger.ts # Custom hook to standardize logging
├── App.tsx                 # Main application application wrapper
└── main.tsx                # Entry point
```

## 🧠 What You Will Learn

By using this tool, you can visualize concepts that are often abstract:

- The difference between **Layout Effects** (blocking) and standard **Effects** (non-blocking).
- The precise timing of **Cleanup Functions** during updates vs. unmounting.
- How `useMemo` lazily re-calculates only when dependencies change.

## 🌍 Deployment

### Deploying to Netlify

This project is configured for easy deployment on Netlify.

1.  **Push to GitHub**: Ensure your latest changes are pushed to your repository.
2.  **Log in to Netlify**: Go to [Netlify](https://www.netlify.com/) and log in.
3.  **Add New Site**: Click "Add new site" -> "Import an existing project" -> "GitHub".
4.  **Select Repository**: Choose `react-lifecycle`.
5.  **Configure Build**:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
6.  **Deploy**: Click "Deploy site".

Netlify will automatically detect the `netlify.toml` file included in this project, which handles the Single Page Application (SPA) routing redirects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
