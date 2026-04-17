# Master Grid — Full Modification Reference

This document records every modification made to the master grid panel and related features.
It is intended as a complete reference for reproducing the same changes in another project that uses the same goals simulator structure.

---

## Project Structure

```
index.html              — UI, layout, toggle panel logic, CSS
master-grid.js          — Self-contained master grid module (IIFE)
goals-simulator.js      — Goals editor, parseDefaultConfigs(), window.activeSimulationConfigs
default-colors.js       — defaultColorList, defaultNumRobots, defaultVisibility
default-goals.js        — defaultSimulationConfigList
```

**Key globals:**
- `window.activeSimulationConfigs` — parsed goal configs, set by goals-simulator.js
- `window.letterColorMap` — letter → CSS color string
- `window.initMovementGrid` — exported init function (called when panel opens)
- `window.refreshMovementGoalSelect` — exported function (called when goals change)

---

## Layout: Two-Panel Toggle (index.html)

### HTML structure
```
.main-container (flex row)
├── #simulator-column   (goals editor, always visible)
├── #resizeHandle       (8px drag handle, contains toggle buttons)
│   ├── #toggleMovementBtn   (.toggle-panel-btn)
│   └── #toggleEditorBtn     (.toggle-panel-btn)
├── #movement-column    (master grid panel, default OPEN)
└── #editor-column      (JSON textarea, default CLOSED)
```

### Toggle button design (.toggle-panel-btn)
Each button is a narrow vertical pill containing:
- `.tpb-arrow` span — shows `▾` (open) or `▸` (closed)
- `.tpb-label` span — rotated vertical text: `GRID` or `JSON`

CSS classes:
- `.is-open`  — green tint for Grid (`#f0fdf4` bg, `#86efac` border, `#166534` text)
- `.is-closed` — muted grey (`#f8fafc` bg, `#cbd5e1` border, `#94a3b8` text)
- `#toggleEditorBtn.is-open` — blue tint (`#eff6ff`, `#93c5fd`, `#1d4ed8`)

### Toggle JS logic (mutually exclusive — never both closed)
```js
function setMovementOpen(open) { ... }  // shows/hides #movement-column, updates btn class + arrow
function setEditorOpen(open)   { ... }  // shows/hides #editor-column, updates btn class + arrow

// Clicking open panel → SWITCHES to the other panel (never leaves both closed)
toggleMovementBtn.click: if open → setMovementOpen(false) + setEditorOpen(true)
                          if closed → setEditorOpen(false) + setMovementOpen(true) + initMovementGrid()
toggleEditorBtn.click:   if open → setEditorOpen(false) + setMovementOpen(true) + initMovementGrid()
                          if closed → setMovementOpen(false) + setEditorOpen(true)
```

---

## Master Grid Controls Row (index.html)

The controls are a single flat row inside `#grid-controls` using CSS class `.mgc-row`.

### CSS classes
| Class | Purpose |
|---|---|
| `.mgc-row` | Flex row, `#f4f7fb` bg, `1px #dde4ee` border, `7px` radius |
| `.mgc-label` | Uppercase muted label (`0.78em`, `#6b7280`) |
| `.mgc-sep` | 1×18px vertical separator (`#d1d9e6`) |
| `.mgc-select` | Styled `<select>` with focus ring |
| `.mgc-input` | Styled `<input type="number">` with focus ring |
| `.mgc-range-group` | Inline flex group for `X min → max` pairs |
| `.mgc-range-lbl` | Bold axis label (`X` / `Y`) |
| `.mgc-arrow` | `→` glyph between min/max inputs |
| `.mgc-chk-label` | Checkbox pill with hover state |

### Controls (in order)
1. **Goal** — `#goal-select` — dropdown listing Goal 1…N from `activeSimulationConfigs`
2. **Grid** — `#grid-size-select` — computed grid sizes (cols×rows), populated by `populateGridSizeSelect()`
3. **Bounds** — `#boundary-xmin` / `#boundary-xmax` / `#boundary-ymin` / `#boundary-ymax` — integer inputs, trigger `applyBoundaries()` on `change`
4. **Vis** — `#visibility-input` — integer 1–5, seeded from `defaultVisibility` on init
5. **Goal box** — `#show-goal-box` checkbox — toggles the blue dashed rectangle overlay
6. **Trail** — `#trail-mode-chk` checkbox — accumulated per-robot movement lines
7. **Path** — `#ghost-mode-chk` checkbox — swarm centroid path line (see below)
8. **Automaton** — `#automaton-chk` checkbox — goal-transition diagram
9. **Speed** — `#play-speed-select` — `0.5×`/`1×`/`1.25×`/`2×`/`4×`/`Fast` (ms values: 1500/900/720/500/250/100)

### Playback buttons
All wrapped in a unified pill container (`#f4f7fb` bg, `#dde4ee` border):
- `#reset-step-btn` — `⟳`, pink/rose style
- `#prev-step-btn` — `◀ Prev`, blue ghost style
- `#play-pause-btn` — `▶`/`⏸`, solid blue (`#1d4ed8`)
- `#next-step-btn` — `Next ▶`, blue ghost style
- `#next-step-info` — monospace status text below buttons

---

## master-grid.js — Module Internals

### State variables
```js
let boundary = { xmin, xmax, ymin, ymax }   // current master grid boundary
let robots   = [[color, x, y], ...]          // current robot positions (world coords)
let currentWall = { x: null|number, y: null|number }  // absolute wall position on master grid
let trailMode   = false    // draw accumulated per-robot arrows
let ghostMode   = false    // draw swarm centroid path
let trajectories = []      // [{goalIndex, segments:[{color,fx,fy,tx,ty}]}]
let history      = []      // ring-buffer (max 100) of previous robot snapshots for prevStep
let pendingGoalBox = null  // {corners, goalIndex} drawn after each step
let showAutomaton  = false
```

### Robot positioning on load (`loadGoal(configIndex)`)

When a goal is selected, robots are placed into the master grid boundary:

**Wall axis (x or y):**
```
offset = wallValue <= 0 ? boundary.min - wallValue : boundary.max - wallValue
```
This anchors the robot group so the wall lands on the boundary edge.

**No-wall axis — FIXED behaviour:**
```js
const boundaryCenter = (boundary.min + boundary.max) / 2;
offset = boundaryCenter - groupCenter;
```
Centers the robot group at the **boundary midpoint** (not world origin `0`).  
This is critical for even-sized grids (e.g. 6-column grid gives boundary `[-3, 2]`, center = `-0.5`) — without this fix robots land off-center and can be within visibility range of a boundary, incorrectly triggering wall detection.

### Grid size computation (`computeGridSizes`)
```js
const B = vis * (nRobots + 1) + 3;
// generates 8 candidate sizes: [B, B+1, B+2] × [B, B+1, B+2] (minus one combo)
// each size maps to symmetric bounds via colsToBounds(n):
//   odd n  → [-floor(n/2), floor(n/2)]
//   even n → [-floor(n/2), floor(n/2)-1]
```
Also includes a manual `13×13  [-6→6]` preset.

### Visibility input initialization
```js
// In init(), after setting up the visInput element:
if (typeof defaultVisibility !== 'undefined') {
  visInput.value = defaultVisibility;
}
```
This seeds the value from `default-colors.js` so if the server overwrites that file, the UI reflects the new value on next page load.

---

## Step Matching Logic (`tryNextStep`)

For each robot as reference point:
1. Subtract reference robot position → relative coords
2. Compute effective wall: boundary edge is a "wall" if any robot is within `vis` distance of it
3. For each goal config × each rule reference robot × each rotation (0°/90°/180°/270°):
   - Rotate goal start positions and wall coords
   - Check wall match (null must match null exactly)
   - Check position match (color + relative coords)
4. On match: compute `(dx, dy)` from rotated goal start→end, apply to all robots
5. Store `segments = [{color, fx, fy, tx, ty}]` for trail/path rendering

---

## Overlay Features

### Trail mode (`trailMode`)
- Draws **all accumulated steps** as per-robot colored arrow lines
- Each step gets a color from `TRAIL_COLORS[]` indexed by `goalIndex`
- Most recent step drawn at full alpha; older steps at 0.55
- Arrow line + arrowhead at destination per robot per step
- `trajectories = []` on reset

### Path mode (`ghostMode`) — Swarm Centroid Path
Draws a **single continuous line** representing the swarm's movement strategy:

1. Compute starting centroid: average (x,y) of all robots' from-positions of step 1
2. For each step: compute ending centroid (average tx,ty of all segments)
3. Draw a solid line connecting all centroids in sequence
4. Small dots (r=3) at intermediate centroids
5. Arrowhead at **midpoint** of each segment (not at destination, to avoid overlap with robot dot)
6. Large bold dot (r=5) at current (last) centroid

Color: `#0369a1` (blue)

Segments include `color` field so robot identity is preserved (needed if extending to per-robot mode).

### Goal Box overlay
- Blue dashed rectangle (`#1565c0`) with 10% fill tint
- Corners computed by rotating/translating goal boundary in master-grid world coords
- Badge label `Goal N` drawn at top-left corner of bounding rect

### Automaton diagram
- Shows goal-transition graph from the execution trace
- Canvas: `#automaton-canvas` (280×280)
- Container: `#automaton-container`
- Layout:
  - If `#canvas-area` width ≥ 630px → grid + automaton **side by side** (flex-direction: row)
  - Otherwise → stacked vertically
- Checked at toggle time via `area.offsetWidth`

---

## Keyboard Shortcuts

Handler: `document.addEventListener('keydown', ...)`

**Previous (broken) logic:** blocked all `INPUT`, `SELECT`, `TEXTAREA` tags — so clicking a checkbox or select inside the panel broke keyboard control.

**Fixed logic:**
```js
const isTextEntry = ['INPUT','TEXTAREA'].includes(focused?.tagName)
                    && focused?.type !== 'checkbox'
                    && focused?.type !== 'radio';
const insidePanel = movementCol && movementCol.contains(focused);
if (isTextEntry && !insidePanel) return;  // only block text fields OUTSIDE the panel
```

Keys (only when `#movement-grid-canvas` is visible):
| Key | Action |
|---|---|
| `Space` | toggle play/pause |
| `ArrowRight` | stop play + next step |
| `ArrowLeft` | stop play + prev step |

---

## files Modified

| File | Changes |
|---|---|
| `master-grid.js` | loadGoal centering fix, ghostMode/drawGhost, trailMode segments+color, visibility init from defaultVisibility, keyboard fix, automaton layout, computeEffectiveWall, tryNextStep |
| `index.html` | toggle button redesign (.toggle-panel-btn), toggle JS (mutually exclusive, never-empty), controls row redesign (.mgc-*), playback bar redesign, canvas-area flex layout, Path/Ghost checkbox, automaton layout logic |
| `default-colors.js` | read-only reference: provides `defaultVisibility` and `defaultNumRobots` |
