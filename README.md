# System Design Diagram Tool

A drag-and-drop system design diagram editor. React + TypeScript + Vite, built on
[React Flow](https://reactflow.dev), styled with CSS Modules and design tokens.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` type-checks and produces a production bundle;
`npm run typecheck` and `npm run lint` run standalone.

## What's here

- A palette of system-design shapes (servers, load balancers, databases, caches, CDNs, DNS,
  message queues, and more) you drag onto a canvas and connect with labeled arrows.
- Resize, recolor, and relabel any shape; undo/redo history.
- Multiple diagrams saved to `localStorage`, switchable from the toolbar.
- Export the current diagram as a high-resolution PNG (editor chrome like selection outlines
  and connection handles is excluded from the export) or as JSON.
- Full light/dark theme (`system` / `light` / `dark`).

## Architecture

```
src/
  app/                     ThemeProvider (light/dark/system)
  components/
    atoms/                 Button, IconButton, ThemeToggle
    organisms/              TopNav
    templates/               AppShell
  features/designer/        The diagram editor itself
    components/              Toolbar, Palette, PropertiesPanel
    nodes/                    ShapeNode (renders every shape kind)
    edges/                    LabeledEdge
    hooks/                    DesignerContext (nodes/edges state, history, save/export)
    data/                     Palette definitions, per-shape defaults, localStorage persistence
  pages/DesignerPage/        Routes the editor into the app shell
  router/                    react-router-dom route table
  styles/                    tokens.css (design tokens), global.css (reset)
```

`/` renders the diagram tool directly — it's the only real route (a catch-all 404 page
handles anything else).
