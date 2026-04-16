# RoASt Goals Editor

A browser-based tool for defining and simulating robot-swarm coordination goals. Goals describe how a group of robots must rearrange themselves, possibly relative to boundary walls, in a bounded 2-D grid. The **Master Grid** panel lets you watch those rules play out step-by-step on a live canvas.

---

## File overview

| File | Role |
|---|---|
| `index.html` | Main layout, styles, control panel HTML, inline init scripts, standalone button wiring |
| `goals-simulator.js` | Parses goals JSON (`parseDefaultConfigs`), manages per-goal simulation frames, handles drag-and-drop of robots/waypoints onto canvases |
| `master-grid.js` | Self-contained IIFE — the Master Grid panel and all step-simulation logic |
| `default-goals.js` | Provides `defaultSimulationConfigList` (loaded at startup if no server data) |
| `default-colors.js` | Provides `defaultColorList` — maps robot-color letter → integer RGB |

---

## Goals data format

Each goal (after `parseDefaultConfigs` in `goals-simulator.js`) is an object:

```js
{
  grids: Position[][],        // grids[0] = initial positions, grids[n] = nth target
  walls: [{ type: 'vertical'|'horizontal', x1, y1, x2, y2 }],
  boundaries: { xmin, xmax, ymin, ymax },
  gridSteps: number[],        // steps budget per transition
  gridWaypoints: [...][],
  gridExclusivePoints: [...][],
}
```

`Position = [color: string, x: number, y: number]`

Goal positions are stored **relative** to the wall value. `x1` / `y1` of a wall object is the raw wall coordinate from the source JSON (`wall: [xWall, yWall]`).

---

## Coordinate system

- X grows right, Y grows up (standard math axes).
- `worldToCanvas(x, y)` → `cx = OFFSET + x * SCALE`, `cy = OFFSET − y * SCALE`  
  (`CANVAS_SIZE = 300`, `SCALE = 25`, `OFFSET = 150`).
- Robots drawn outside the boundary are shown with a **red** border.

---

## Master Grid panel (`master-grid.js`)

A self-contained IIFE. It reads from two globals set externally:
- `window.activeSimulationConfigs` — the parsed goal array (set by `goals-simulator.js`)
- `window.letterColorMap` — `{ letter: '#RRGGBB' }` (set by `index.html` inline script)

### Module state

| Variable | Type | Description |
|---|---|---|
| `boundary` | `{xmin,xmax,ymin,ymax}` | Current master-grid boundary (editable via inputs) |
| `robots` | `[color,x,y][]` | Current absolute robot positions on the master grid |
| `currentWall` | `{x,y}` | Absolute wall position loaded from a goal — used only during `loadGoal()` placement; **not** used during step matching |
| `initialized` | `boolean` | Guards one-time event-listener registration inside `init()` |

### Drawing functions

| Function | What it draws |
|---|---|
| `drawGrid(ctx)` | Light grey minor grid lines + darker axes |
| `drawBoundary(ctx)` | Solid black rectangle at the current boundary |
| `drawRobots(ctx)` | Filled coloured circles with letter labels; red stroke if out of bounds |
| `render()` | Calls the three above on `#movement-grid-canvas` |

### Loading a starting position — `loadGoal(configIndex)`

Called when the user picks a goal from the **Starting Goal** dropdown.

1. Reads `config.walls` to extract raw `wallX` / `wallY`.
2. Stores absolute wall in `currentWall`: `wallX ≤ 0 → boundary.xmin`, `wallX > 0 → boundary.xmax` (same logic for Y).
3. Converts goal's relative robot positions to absolute ones by shifting them so the wall aligns with the matching boundary edge:
   ```
   absX = relX + (wallX ≤ 0 ? boundary.xmin − wallX : boundary.xmax − wallX)
   ```
4. Calls `render()`.

---

## Step simulation — the "Next ▶" button

### Effective wall detection — `computeEffectiveWall(vis)`

Before each step the algorithm must decide whether the robots are currently "near a wall". This is dynamic — it depends on robot positions and the visibility radius, not just the loaded goal.

```
for each robot at (x, y):
  if boundary.xmax − x ≤ vis  →  xWall = boundary.xmax
  if x − boundary.xmin ≤ vis  →  xWall = boundary.xmin   (first hit wins)
  same for ymax / ymin
```

`vis` is read live from `#visibility-input` (default 1, range 1–5). This means Goal 1 (wall = null) matches freely in open space, but once any robot is within 1 cell of a boundary edge Goal 1 is automatically disqualified and a wall-specific goal (e.g. Goal 2) takes over.

### Goal-matching algorithm — `tryNextStep()`

Mirrors the Rust `search_for_solutions_v1` / `compute_next_positions` logic.

```
effWall  = computeEffectiveWall(vis)                  // dynamic wall from boundary proximity

for each robot[refIdx] as current reference:
  adjCurrent  = robots shifted so robots[refIdx] = (0,0)
  adjXWall    = effWall.x − refX   (null if no wall)

  for each goal gi:
    startPos = goal.grids[0]
    endPos   = goal.grids[last]
    skip if robot count differs

    for each startPos[ruleRefIdx] as goal reference:
      adjStart  = startPos shifted so startPos[ruleRefIdx] = (0,0)
      adjEnd    = endPos   shifted by same offset
      gXWallAdj = goalXWall − ruleRefX

      for each angle in [0, 90, 180, 270]:
        rotStart, rotEnd = rotate adjStart/adjEnd by angle
        rotGoalWall      = rotateWalls(gXWallAdj, gYWallAdj, angle)

        wall check:  both null ✓ | both equal ✓ | mismatch → skip
        pos  check:  matchPositions(adjCurrent, rotStart)  → must match by color + coords

        on MATCH:
          for each current robot:
            find its entry in rotStart (by color + relative coords)
            dx = rotEnd[i].x − rotStart[i].x
            dy = rotEnd[i].y − rotStart[i].y
            newColor = rotEnd[i].color          ← color may change (e.g. L → R)
            newPos   = (x + dx, y + dy)
          return { robots: newRobots, goalIndex: gi, rotation: angle }

return null   // no matching goal
```

Key detail: **the end color (`rotEnd[i][0]`) is applied**, not the current robot color. Goals can include a color rename (e.g. Goal 2 maps L → R at the same time as moving).

### Rotation math

Matches the Rust `rotate_point` / `rotate_walls`:

| Angle | Point (x,y) → | xWall, yWall → |
|---|---|---|
| 0° | (x, y) | (xw, yw) |
| 90° | (y, −x) | (yw, −xw) |
| 180° | (−x, −y) | (−xw, −yw) |
| 270° | (−y, x) | (−yw, xw) |

**`rotatePoint(x, y, angle)`** — pure rotation of a 2-D point.  
**`rotateWalls(xWall, yWall, angle)`** — rotates wall scalars following the same convention.

### Position matching — `matchPositions(currentPositions, goalPositions)`

Greedy one-to-one match. For each entry in `goalPositions` find an unused entry in `currentPositions` with **identical color and coordinates**. Returns `false` on the first miss.

### Logging

Every `nextStep()` call opens a `console.group` showing:
- current robots, visibility, computed effective wall
- every wall-passing combination (goal index, ruleRef, angle, current vs goal positions, match result)
- the applied transition on success: `✓ APPLY Goal2 | ... → F(4,0) R(3,0)`

A status line `#next-step-info` below the button shows the last result inline on the page.

---

## Public API exported by `master-grid.js`

| Symbol | Caller | Purpose |
|---|---|---|
| `window.initMovementGrid` | `index.html` toggle handler | Re-initialises the grid panel when the movement column is opened |
| `window.refreshMovementGoalSelect` | `goals-simulator.js` | Repopulates `#goal-select` after goals are reloaded |

---

## Controls (inside `#movement-column`)

| Element id | Type | Purpose |
|---|---|---|
| `#goal-select` | `<select>` | Pick a starting goal; calls `loadGoal(index)` |
| `#boundary-xmin/xmax` | `<input number>` | Master-grid X boundary |
| `#boundary-ymin/ymax` | `<input number>` | Master-grid Y boundary |
| `#visibility-input` | `<input number>` | Visibility radius (default 1) — controls when a boundary edge is treated as a wall |
| `#movement-grid-canvas` | `<canvas 300×300>` | Live render target |
| `#next-step-btn` | `<button>` | Triggers `nextStep()` — finds matching goal, applies transition, re-renders |
| `#next-step-info` | `<div>` | Shows last step result inline (goal number, rotation, new positions) |
