# Policy — Read Before Starting Any Mission

> **Rule:** Every mission starts here. Read this file fully before writing any code.
> Update the "Missions" section before starting and correct it after finishing (do NOT change context, only extend/fix).

---

## Project Overview

**RoASt Goals Editor** — A browser-based tool to define and visualise robot-swarm coordination goals.

| File | Role |
|---|---|
| `index.html` | Main layout, styles, inline init scripts, button wiring |
| `goals-simulator.js` | Parses goals JSON, renders simulation frames (one per goal), handles drag-and-drop of robots/waypoints onto canvas grids |
| `master-grid.js` | Self-contained IIFE module; draws the "Master Grid" canvas panel; reads `window.activeSimulationConfigs` and `window.letterColorMap` |
| `default-goals.js` | Provides `defaultSimulationConfigList` (loaded at startup) |
| `default-colors.js` | Provides `defaultColorList` (letter → integer RGB) |
| `PLAN.md` | Legacy plan file (kept for reference, may be outdated) |

### Goal data shape (after `parseDefaultConfigs`)

```js
{
  id: string,
  grids: Position[][], // grids[0] = initial, grids[n] = nth target
  walls: [{type:'vertical'|'horizontal', x1, y1, x2, y2}],
  boundaries: {xmin, xmax, ymin, ymax},
  // ...
}
```

`Position = [color: string, x: number, y: number]`

### Coordinate conventions

- X grows to the right, Y grows upward (math coords).
- `worldToCanvas(x, y)` in `master-grid.js`: `cx = OFFSET + x*SCALE`, `cy = OFFSET - y*SCALE`.
- `CANVAS_SIZE = 300`, `SCALE = 25`, `OFFSET = 150`.

### Wall convention (goals-simulator)

Goals store walls as *relative* positions (`x1`/`y1` in wall objects equals the raw wall value).  
When `loadGoal` places robots in the master grid it shifts them so the wall lands on the boundary edge:
- vertical wall `wx`: absolute wall = `wx ≤ 0 → boundary.xmin` ; `wx > 0 → boundary.xmax`
- horizontal wall `wy`: absolute wall = `wy ≤ 0 → boundary.ymin` ; `wy > 0 → boundary.ymax`

---

## Coding Conventions

- `master-grid.js` is a **self-contained IIFE** — no imports/exports; public surface via `window.*`.
- Do **not** add global variables outside the IIFE in `master-grid.js`.
- HTML elements referenced by `master-grid.js` live inside `#movement-column` in `index.html`.
- Button wiring for standalone features goes in the `DOMContentLoaded` block at the bottom of `index.html`; low-level grid logic stays in `master-grid.js`.
- Keep rotation helpers consistent with the Rust reference: `rotatePoint(x,y,90) → (y, -x)`.

---

## Rotation Reference (from Rust source)

```
angle=0:   (x, y)   →  (x,  y)
angle=90:  (x, y)   →  (y, -x)
angle=180: (x, y)   → (-x, -y)
angle=270: (x, y)   → (-y,  x)
```

Wall rotation (x_wall, y_wall):
```
0°:   (xw, yw)
90°:  (yw, -xw)       // y_wall→x_wall ; x_wall→ -y_wall
180°: (-xw, -yw)
270°: (-yw, xw)       // y_wall→ -x_wall ; x_wall→ y_wall
```

---

## Missions

### Mission 1 — Master Grid + Toggle Panels  *(completed)*

Added the Master Grid panel (`movement-column`) with:
- Goal selector dropdown populated from `activeSimulationConfigs`
- Boundary inputs (xmin/xmax/ymin/ymax)
- 300×300 canvas rendering robots relative to boundary
- Wall-aware absolute positioning when loading a goal
- Toggle buttons (movement / editor panel), mutually exclusive

---

### Mission 2 — "Next" Button: goal-matching step simulation  *(current)*

**Goal:** Simulate one step of robot movement on the master grid by finding a goal whose starting pattern matches the current robot positions, then applying the corresponding transition.

#### User story

> Click **Next** → find a matching goal (handling all 4 rotations + arbitrary reference robot) → move robots to the target positions of that goal.

#### Algorithm (ported from Rust `search_for_solutions_v1`)

1. **For each current robot as reference** (`refIdx`):
   - Shift all current robots so `robots[refIdx]` is at `(0,0)` → `adjCurrent[]`
   - Shift absolute wall by same offset → `adjXWall`, `adjYWall`

2. **For each goal** in `activeSimulationConfigs`:
   - `startPos = grids[0]`, `endPos = grids[last]`
   - Skip if robot-count differs from current count
   - Read goal's raw wall values `goalXWall` / `goalYWall`

3. **For each robot in `startPos` as rule reference** (`ruleRefIdx`):
   - Adjust `startPos` and `endPos` so `startPos[ruleRefIdx]` is at `(0,0)`
   - Adjust goal walls by same offset → `adjGoalXWall`, `adjGoalYWall`

4. **For each rotation** in `[0, 90, 180, 270]`:
   - Rotate all adjusted start/end positions and walls
   - **Wall check**: both null ✓ | both equal value ✓ | mismatch ✗
   - **Position check** (`matchPositions`): every rotated start robot has a matching robot (same color, same relative position) in `adjCurrent`
   - On match: for each robot compute `Δ = rotEnd[i] - rotStart[i]`, apply `Δ` to absolute position
   - Update `robots`, re-render, **return** (first match wins)

5. If no match found across all goals/refs/rotations → show visual feedback (button flash red).

#### Effective wall (dynamic) — visibility rule

`currentWall` stores the wall from the loaded goal (used for initial placement). During **Next** matching, walls are computed dynamically from boundary proximity:

```js
// boundary edge is a wall if any robot is within visibility distance of it
function computeEffectiveWall(vis) { ... }
```

- `boundary.xmax - x ≤ vis` → xWall = boundary.xmax  
- `x - boundary.xmin ≤ vis` → xWall = boundary.xmin  
- Same for y. First hit wins (xmax checked before xmin).

**Why this matters**: Goal 1 (no wall) keeps firing until robots reach a boundary edge. E.g. L(5,0)+F(4,0) with xmax=6, vis=1 → xWall=6 computed dynamically. Goal 1 (wall=null) is then skipped; Goal 2 (wall x=2 relative → 6 absolute) matches.

#### New state in `master-grid.js`

```js
let currentWall = { x: null, y: null }; // absolute wall — used only for initial loadGoal placement
```
Updated in `loadGoal()` after computing `wallX`/`wallY`. NOT used in tryNextStep (uses computeEffectiveWall instead).

#### New HTML element (inside `#movement-column`, below canvas)

```html
<div style="text-align:center; margin-top: 10px; flex-shrink: 0;">
  <button id="next-step-btn" ...>Next ▶</button>
</div>
```

#### Files to change

| File | Change |
|---|---|
| `master-grid.js` | Add `currentWall`, update `loadGoal`, add `rotatePoint`, `rotateWalls`, `matchPositions`, `tryNextStep`, `nextStep`; wire button in `init()` |
| `index.html` | Add `#next-step-btn` element inside `#movement-column` below canvas container |
