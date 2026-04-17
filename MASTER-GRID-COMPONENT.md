# Master Grid — Reusable Component Guide

> Copy this component into any HTML page by following the 4 steps below.

---

## Step 1 — Copy the HTML

Paste this block wherever you want the grid panel to appear:

```html
<!-- ═══════════════════════════════════════════════
     MASTER GRID COMPONENT — HTML
     Required element IDs must stay exactly as-is
     ═════════════════════════════════════════════ -->

<div id="movement-column" style="display:flex; flex-direction:column; padding:15px; border:1px solid #d1d9e0; border-radius:8px; background:#fff; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,.05);">

  <!-- Controls Row -->
  <div id="grid-controls" style="margin-bottom:14px;">
    <div class="mgc-row">
      <span class="mgc-label">Goal</span>
      <select id="goal-select" class="mgc-select" style="min-width:110px;">
        <option value="">-- Select --</option>
      </select>
      <div class="mgc-sep"></div>
      <span class="mgc-label">Grid</span>
      <select id="grid-size-select" class="mgc-select" style="font-family:monospace; min-width:140px;"></select>
      <div class="mgc-sep"></div>
      <span class="mgc-label">Bounds</span>
      <div class="mgc-range-group">
        <span class="mgc-range-lbl">X</span>
        <input type="number" id="boundary-xmin" value="-6" min="-20" max="0"  class="mgc-input" style="width:48px;">
        <span class="mgc-arrow">→</span>
        <input type="number" id="boundary-xmax" value="6"  min="0"   max="20" class="mgc-input" style="width:48px;">
      </div>
      <div class="mgc-range-group">
        <span class="mgc-range-lbl">Y</span>
        <input type="number" id="boundary-ymin" value="-6" min="-20" max="0"  class="mgc-input" style="width:48px;">
        <span class="mgc-arrow">→</span>
        <input type="number" id="boundary-ymax" value="6"  min="0"   max="20" class="mgc-input" style="width:48px;">
      </div>
      <div class="mgc-sep"></div>
      <span class="mgc-label">Vis</span>
      <input type="number" id="visibility-input" value="1" min="1" max="5" class="mgc-input" style="width:42px;" title="Robot visibility radius (1–5)">
      <div class="mgc-sep"></div>
      <label class="mgc-chk-label">
        <input type="checkbox" id="show-goal-box" checked style="accent-color:#1565c0;">
        Goal box
      </label>
      <label class="mgc-chk-label">
        <input type="checkbox" id="trail-mode-chk" style="accent-color:#e65100;">
        Trail
      </label>
      <label class="mgc-chk-label">
        <input type="checkbox" id="ghost-mode-chk" style="accent-color:#0369a1;">
        Path
      </label>
      <label class="mgc-chk-label">
        <input type="checkbox" id="automaton-chk" style="accent-color:#6a1b9a;">
        Automaton
      </label>
      <div class="mgc-sep"></div>
      <span class="mgc-label">Speed</span>
      <select id="play-speed-select" class="mgc-select">
        <option value="1500">0.5×</option>
        <option value="900">1×</option>
        <option value="720" selected>1.25×</option>
        <option value="500">2×</option>
        <option value="250">4×</option>
        <option value="100">Fast</option>
      </select>
    </div>
  </div>

  <!-- Canvas Area -->
  <div id="canvas-area" style="flex:1; display:flex; flex-direction:row; align-items:center; justify-content:center; gap:10px; overflow:auto; min-height:320px; flex-wrap:wrap;">
    <div id="movement-grid-container" style="border:3px solid #000; border-radius:4px; background:#fff; flex-shrink:0;">
      <canvas id="movement-grid-canvas" width="300" height="300" style="cursor:pointer;"></canvas>
    </div>
    <div id="automaton-container" style="display:none; border:1px solid #cce5ff; border-radius:4px; background:#f8fbff; flex-shrink:0;">
      <canvas id="automaton-canvas" width="280" height="280"></canvas>
    </div>
  </div>

  <!-- Playback Controls -->
  <div style="text-align:center; margin-top:10px; flex-shrink:0;">
    <div style="display:inline-flex; gap:6px; align-items:center; background:#f4f7fb; border:1px solid #dde4ee; border-radius:8px; padding:6px 10px;">
      <button id="reset-step-btn" title="Reset" style="padding:6px 12px;font-size:1em;font-weight:700;background:#fff;color:#be185d;border:1px solid #f9a8d4;border-radius:6px;cursor:pointer;">&#8634;</button>
      <div style="width:1px;height:20px;background:#dde4ee;"></div>
      <button id="prev-step-btn"  title="Previous (←)" style="padding:6px 14px;font-size:.88em;font-weight:600;background:#fff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:6px;cursor:pointer;">&#9664; Prev</button>
      <button id="play-pause-btn" title="Play (Space)"  style="padding:6px 18px;font-size:1.05em;font-weight:700;background:#1d4ed8;color:#fff;border:1px solid transparent;border-radius:6px;cursor:pointer;min-width:44px;">&#9654;</button>
      <button id="next-step-btn"  title="Next (→)"     style="padding:6px 14px;font-size:.88em;font-weight:600;background:#fff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:6px;cursor:pointer;">Next &#9654;</button>
    </div>
    <div id="next-step-info" style="font-size:.75em;margin-top:5px;min-height:1.3em;color:#64748b;font-family:monospace;letter-spacing:.02em;"></div>
  </div>

</div>
<!-- ═══════════════════ END MASTER GRID HTML ═══════════════════ -->
```

---

## Step 2 — Copy the CSS

Paste inside a `<style>` tag (or your stylesheet):

```css
/* ═══════════════════════════════════════
   MASTER GRID COMPONENT — CSS
   ═════════════════════════════════════ */

#grid-controls { margin-bottom: 14px; }
.mgc-row {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 7px 10px; border-radius: 7px;
  background: #f4f7fb; border: 1px solid #dde4ee; margin-bottom: 6px;
}
.mgc-label {
  font-size: .78em; font-weight: 600; color: #6b7280;
  text-transform: uppercase; letter-spacing: .05em; white-space: nowrap;
}
.mgc-sep   { width: 1px; height: 18px; background: #d1d9e6; flex-shrink: 0; margin: 0 2px; }
.mgc-arrow { font-size: .75em; color: #94a3b8; }
.mgc-range-group { display: inline-flex; align-items: center; gap: 4px; }
.mgc-range-lbl   { font-size: .8em; font-weight: 700; color: #475569; min-width: 12px; text-align: center; }
.mgc-select {
  padding: 4px 7px; border: 1px solid #c9d4e2; border-radius: 5px;
  font-size: .85em; background: #fff; color: #1e293b; cursor: pointer;
}
.mgc-select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,.15); }
.mgc-input {
  border: 1px solid #c9d4e2; border-radius: 5px; padding: 4px 5px;
  font-size: .85em; background: #fff; color: #1e293b; text-align: center;
}
.mgc-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,.15); }
.mgc-chk-label {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: .82em; font-weight: 600; color: #374151;
  white-space: nowrap; cursor: pointer; user-select: none;
  padding: 3px 8px 3px 6px; border-radius: 5px; border: 1px solid transparent;
  transition: background .15s, border-color .15s;
}
.mgc-chk-label:hover { background: #e8eef6; border-color: #c9d4e2; }
.mgc-chk-label input[type=checkbox] { width: 13px; height: 13px; cursor: pointer; margin: 0; }

/* Goal flash animation (used when a goal is matched) */
.goal-index-badge {
  font-size: .72em; font-weight: 700; color: #fff; background: #5f7a99;
  border-radius: 4px; padding: 1px 7px; margin-right: 8px; flex-shrink: 0;
  letter-spacing: .03em; white-space: nowrap; transition: background .3s ease;
}
@keyframes goalFlashAnim {
  0%   { box-shadow: 0 0 0 3px #1976d2, 0 0 18px 6px rgba(25,118,210,.45); border-color: #1976d2; }
  40%  { box-shadow: 0 0 0 5px #42a5f5, 0 0 28px 10px rgba(66,165,245,.55); border-color: #42a5f5; }
  100% { box-shadow: 0 0 0 3px #1976d2, 0 0 18px 6px rgba(25,118,210,.45); border-color: #1976d2; }
}
.simulation-frame.goal-flash {
  animation: goalFlashAnim .55s ease-in-out;
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px #1976d2, 0 0 18px 6px rgba(25,118,210,.45) !important;
}
.simulation-frame.goal-flash .goal-index-badge { background: #1565c0; }
/* ══════════════════ END MASTER GRID CSS ══════════════════ */
```

---

## Step 3 — Provide the two required JS globals

The script reads these two globals — set them **before** calling `initMovementGrid()`:

```js
// 1. Array of goal config objects (same format as goals-simulator produces)
window.activeSimulationConfigs = [ /* your goals array */ ];

// 2. Map of robot letter → CSS hex color
window.letterColorMap = {
  "R": "#FF0000",
  "F": "#0000FF",
  // add more letters as needed
};
```

---

## Step 4 — Load the script and initialise

```html
<!-- Load the component script -->
<script src="master-grid.js"></script>

<script>
  // Call once after the page (and globals above) are ready
  window.initMovementGrid();

  // Call this whenever your goals array changes
  // (e.g. after loading new goals from a server)
  window.refreshMovementGoalSelect();
</script>
```

---

## Required element IDs (do not rename)

| ID | Element | Purpose |
|---|---|---|
| `movement-grid-canvas` | `<canvas>` | Main simulation grid |
| `automaton-canvas` | `<canvas>` | Goal-transition automaton |
| `automaton-container` | `<div>` | Wrapper shown/hidden by checkbox |
| `canvas-area` | `<div>` | Flex container for canvases |
| `movement-column` | `<div>` | Outer column (keyboard focus scope) |
| `goal-select` | `<select>` | Pick which goal to start from |
| `grid-size-select` | `<select>` | Auto-computed grid sizes |
| `boundary-xmin/xmax/ymin/ymax` | `<input number>` | Boundary range inputs |
| `visibility-input` | `<input number>` | Robot visibility radius |
| `play-speed-select` | `<select>` | Playback speed |
| `show-goal-box` | `<input checkbox>` | Toggle goal bounding box |
| `trail-mode-chk` | `<input checkbox>` | Toggle movement trail |
| `ghost-mode-chk` | `<input checkbox>` | Toggle centroid path |
| `automaton-chk` | `<input checkbox>` | Toggle automaton panel |
| `next-step-btn` | `<button>` | Step forward |
| `prev-step-btn` | `<button>` | Step backward |
| `reset-step-btn` | `<button>` | Reset to initial state |
| `play-pause-btn` | `<button>` | Toggle auto-play |
| `next-step-info` | `<div>` | Status / info bar |

---

## Public API

| Function | When to call |
|---|---|
| `window.initMovementGrid()` | Once on page load |
| `window.refreshMovementGoalSelect()` | After goals array changes |

---

## Optional globals

| Global | Default | Effect |
|---|---|---|
| `window.defaultVisibility` | `1` | Pre-fills the visibility input |
