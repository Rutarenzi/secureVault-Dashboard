# SecureVault Dashboard

A modern, high-performance File Explorer UI built for SecureVault Inc. — an enterprise cloud storage platform serving law firms and banks.

---

## Live Demo

[SecureVault](https://secure-vault-dashboard-weld.vercel.app/)
---
## Design File

[Figma](https://www.figma.com/design/XoAZ6r8PI846in5K0JBANO/SecureVault-Design-System?node-id=0-1&m=dev&t=2p6Ur8GmOzdoOy45-1)

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm 9+

### Install & Run

```bash
git clone https://github.com/Rutarenzi/secureVault-Dashboard.git
cd secureVault-Dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** — latest concurrent features
- **Vite 6** — fast dev server and build tool
- **CSS Modules** — scoped, component-level styles (zero external UI libraries)
- **Custom Design System**  `src/index.css`





## Recursive Strategy

The file tree is powered by a recursive `TreeNode` component (`src/components/TreeNode.jsx`).

**Key design decisions:**

1. **Flat maps over tree traversal** — On mount, `buildMaps()` in `fileUtils.js` flattens the entire tree into two O(1) lookup maps: `nodeMap` (id → node) and `parentMap` (id → parentId). This avoids repeated traversal on every render.

2. **Recursive rendering** — `TreeNode` renders itself for each child when a folder is expanded. React's reconciler handles diffing efficiently. The component is wrapped in `memo()` to prevent unnecessary re-renders.

3. **Expansion state is external** — A `Set<string>` of expanded IDs lives in the top-level store (`useVaultStore`), not inside each node. This makes collapse-all, expand-all, and search-driven expansion trivial — one state update re-renders the whole tree cleanly.

4. **Search auto-expansion** — `computeSearchMatches()` does a single DFS pass, marks all matching nodes AND their ancestors, and mutates the `expanded` set to force-open parent folders. Nodes not in `searchMatches` return `null` early, keeping the DOM minimal.

5. **Keyboard navigation** — `flattenVisible()` produces a flat ordered array of currently-visible nodes in DOM order. Arrow key handlers simply increment/decrement the index into this array — no tree traversal needed at interaction time.

---




###  Keyboard Accessibility
- `↑` / `↓` — move focus between visible items
- `→` — expand folder
- `←` — collapse folder (or jump to parent)
- `Enter` — select item / toggle folder
- `/` — focus search from anywhere


### Search & Filter
- Live search filters the tree
- Matching items deep in folders force those folders to expand
- Match count badge shown in topbar
- Matched text highlighted inline

---

## Wildcard Feature: Right-Click Context Menu + Star System

**What it is:**  
A full right-click context menu on every file and folder, combined with a persistent star/bookmark system.

**Why I chose it:**  
Enterprise users managing thousands of legal and financial files need quick access to important documents without hunting through the tree every time. The star system lets users mark critical files (e.g. active case documents, compliance checklists) for instant recognition. The context menu exposes power actions — copy path, star, expand/collapse, download — without cluttering the UI.

**Business value:**  
- Reduces time-to-file for repeat access patterns (a lawyer returning to the same case folder daily)
- Copy Path enables integration workflows — users can paste vault paths into other internal tools
- The "Recently Viewed" panel in the Properties sidebar further accelerates repeat navigation
- Zero learning curve — right-click is a universal interaction pattern

**Additional added features:**
- **Recently Viewed** — last 8 accessed items shown in the Properties Panel when nothing is selected
- **Grid view** — main panel shows folder contents as a card grid (folders + files grouped separately)
- **Breadcrumb navigation** — clickable path trail updates as you navigate

- **Collapse All / Expand All** — topbar controls for power navigation


---

## Project Structure

```
src/
├── components/
│   ├── TopBar.jsx / .module.css        # Search, brand, global actions
│   ├── Sidebar.jsx / .module.css       # Tree container + footer
│   ├── TreeNode.jsx / .module.css      # Recursive tree node
│   ├── MainPanel.jsx / .module.css     # Grid view + breadcrumb
│   ├── PropertiesPanel.jsx / .module.css  # File metadata + actions
│   ├── ContextMenu.jsx / .module.css   # Right-click menu
│   └── Toast.jsx / .module.css         # Notification toasts
├── hooks/
│   ├── useVaultStore.js                # Centralized app state
│   └── useKeyboard.js                  # Keyboard navigation logic
├── utils/
│   └── fileUtils.js                    # Icons, types, maps, search
├── data.json                           # Vault file structure
├── App.jsx                             # Root layout + wiring
├── App.module.css                      # Grid layout
├── index.css                           # Design tokens + global styles
└── main.jsx                            # React 19 entry point
```

---



https://secure-vault-dashboard-weld.vercel.app/


author: client@rutagarama.com

