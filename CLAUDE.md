# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack at localhost:3000
npm run build    # Production build (runs TypeScript check)
npm run lint     # ESLint via next lint
```

There are no tests. Type-check without building: `npx tsc --noEmit` (requires node_modules; Vercel installs them — locally you may see module-not-found errors if node_modules is absent).

## Architecture

**Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4. Single page at `src/app/page.tsx` renders `<Visualizer>`.

### Animation model

Every state change in the grid goes through **CSS animation restart via inner-div re-keying** (`Cell.tsx`). The outer `<div>` is stable (mouse events); the inner `<div key={animationKey}>` is replaced in the DOM whenever `cell.type` changes to an animated type, forcing the browser to restart the CSS animation from frame 0. Animation class names (`animate-visit-pop`, `animate-path-reveal`, etc.) are defined as utility classes in `globals.css`.

All time-based stepping uses **`requestAnimationFrame` loops** — never `setTimeout`/`setInterval`. There are three independent RAF loops:
1. `useAlgorithm` — steps the algorithm generator at the configured speed delay
2. `useAlgorithm` (path reveal) — reveals path cells one-by-one after the algorithm finishes, before confetti fires
3. `useGrid` (maze) — steps the maze generator at 14 ms/step

### Algorithm pipeline

All four algorithms (`astar`, `dijkstra`, `bfs`, `dfs` in `src/algorithms/`) are **ES6 generator functions** that `yield AlgorithmStep` on every explored node and `return AlgorithmStep` when done. `getAlgorithmGenerator()` in `src/algorithms/index.ts` resets all cell scores/parents before handing the grid to the chosen algorithm.

`AlgorithmStep` carries a full `GridMatrix` snapshot (`grid`), the current position, frontier/visited arrays, the reconstructed `path`, and metrics. The grid snapshot inside each step is a deep clone (`JSON.parse(JSON.stringify(...))`).

### Grid / cell data model

`Cell` (in `src/types/grid.ts`) embeds all pathfinding scores directly: `distance`, `gScore`, `fScore`, `hScore`, `parent`. `CellType` is a union of visual states: `'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'current' | 'frontier'`. The type field is what drives both rendering color and CSS animation class.

### Maze generation

`generateRecursiveBacktrackingMaze` in `src/utils/gridUtils.ts` is a generator that yields `MazeStep` (grid snapshot + isDone) after every wall-carve. Key constraint: passage nodes must sit at **odd row AND odd col** coordinates. Start `(1,1)` is always valid; the default end `(rows-2, cols-2)` can land on an even coordinate for even-sized grids. The generator snaps both positions to the nearest odd-odd node via `snapToPassage()`, then carves a corridor back to the original positions via `carveToSnapped()`. After the DFS, ~18% of removable walls are opened to add loops.

### State ownership

| Concern | Hook |
|---|---|
| Grid matrix, maze gen, cell toggling, size | `useGrid` |
| Algorithm run/pause/step, path reveal, confetti | `useAlgorithm` |
| Efficiency score derived from current step | `useMetrics` |
| Light/dark mode with localStorage | `useTheme` + `ThemeProvider` |

`useAlgorithm` receives `grid` and `setGrid` from `useGrid` as props — it does not own the grid. It calls `setGrid` with functional updates in the path-reveal loop.

### Styling conventions

CSS custom properties (`--background`, `--foreground`, `--surface`, `--border`, `--accent-primary`, `--text-muted`, etc.) are defined in `globals.css` for both `:root` (light) and `.dark` modes. Inline `style` props use these variables for theme-aware colours; Tailwind utility classes handle layout and spacing. Glassmorphism panels use `backdrop-filter: blur()` + semi-transparent backgrounds.

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
