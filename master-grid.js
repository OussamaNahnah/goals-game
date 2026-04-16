// === MASTER GRID ===
// Self-contained module. Only external dependency:
//   - window.activeSimulationConfigs  (read-only, set by goals-simulator.js)
//   - window.letterColorMap           (set by index.html inline script)
//   - window.refreshMovementGoalSelect (exported below, called by goals-simulator.js)

(function () {
  // --- Constants ---
  const CANVAS_SIZE = 300;
  const SCALE = 25;
  const OFFSET = CANVAS_SIZE / 2;

  // --- State ---
  let boundary = { xmin: -6, xmax: 6, ymin: -6, ymax: 6 };
  let robots = [];
  let initialized = false;

  // --- Coordinate helpers ---
  function worldToCanvas(x, y) {
    return { cx: OFFSET + x * SCALE, cy: OFFSET - y * SCALE };
  }

  function isWithinBoundary(x, y) {
    return x >= boundary.xmin && x <= boundary.xmax &&
           y >= boundary.ymin && y <= boundary.ymax;
  }

  // --- Drawing ---
  function drawGrid(ctx) {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 1;
    for (let i = -12; i <= 12; i++) {
      if (i === 0) continue;
      const { cx } = worldToCanvas(i, 0);
      ctx.beginPath(); ctx.moveTo(cx + 0.5, 0); ctx.lineTo(cx + 0.5, CANVAS_SIZE); ctx.stroke();
      const { cy } = worldToCanvas(0, i);
      ctx.beginPath(); ctx.moveTo(0, cy + 0.5); ctx.lineTo(CANVAS_SIZE, cy + 0.5); ctx.stroke();
    }

    ctx.strokeStyle = "#b0b0b0";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, OFFSET + 0.5); ctx.lineTo(CANVAS_SIZE, OFFSET + 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(OFFSET + 0.5, 0); ctx.lineTo(OFFSET + 0.5, CANVAS_SIZE); ctx.stroke();
  }

  function drawBoundary(ctx) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    const { cx: x0 } = worldToCanvas(boundary.xmin, 0);
    const { cx: x1 } = worldToCanvas(boundary.xmax, 0);
    const { cy: y0 } = worldToCanvas(0, boundary.ymax);
    const { cy: y1 } = worldToCanvas(0, boundary.ymin);
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }

  function drawRobots(ctx) {
    const colorMap = window.letterColorMap || {};
    const fallback = (typeof simConfig !== 'undefined' && simConfig.colors) ? simConfig.colors : {};
    robots.forEach(([color, x, y]) => {
      const { cx, cy } = worldToCanvas(x, y);
      const inBounds = isWithinBoundary(x, y);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = colorMap[color] || fallback[color] || "gray";
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.setLineDash([]);
      ctx.strokeStyle = inBounds ? "#000" : "#e53935";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(color, cx, cy);
    });
  }

  function render() {
    const canvas = document.getElementById("movement-grid-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawGrid(ctx);
    drawBoundary(ctx);
    drawRobots(ctx);
  }

  // --- Load goal positions ---
  function loadGoal(configIndex) {
    const configs = window.activeSimulationConfigs;
    if (!configs || !configs[configIndex]) return;

    const config = configs[configIndex];
    let wallX = null, wallY = null;

    if (config.walls) {
      config.walls.forEach(wall => {
        if (wall.type === "vertical")   wallX = wall.x1;
        if (wall.type === "horizontal") wallY = wall.y1;
      });
    }

    const firstGrid = config.grids[0] || [];

    if (wallX === null && wallY === null) {
      robots = firstGrid.map(([c, x, y]) => [c, x, y]);
    } else {
      robots = firstGrid.map(([c, relX, relY]) => {
        let absX = relX, absY = relY;
        if (wallX !== null)
          absX = relX + (wallX <= 0 ? boundary.xmin - wallX : boundary.xmax - wallX);
        if (wallY !== null)
          absY = relY + (wallY <= 0 ? boundary.ymin - wallY : boundary.ymax - wallY);
        return [c, Math.round(absX), Math.round(absY)];
      });
    }
    render();
  }

  // --- Boundary apply ---
  function applyBoundaries() {
    const xmin = parseInt(document.getElementById("boundary-xmin").value) || -6;
    const xmax = parseInt(document.getElementById("boundary-xmax").value) || 6;
    const ymin = parseInt(document.getElementById("boundary-ymin").value) || -6;
    const ymax = parseInt(document.getElementById("boundary-ymax").value) || 6;
    boundary = { xmin, xmax, ymin, ymax };

    const sel = document.getElementById("goal-select");
    const idx = sel ? parseInt(sel.value) : NaN;
    if (!isNaN(idx)) {
      loadGoal(idx);
    } else {
      render();
    }
  }

  // --- Goal select populate ---
  function populateGoalSelect() {
    const sel = document.getElementById("goal-select");
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Select a Goal --</option>';
    const configs = window.activeSimulationConfigs;
    if (configs && configs.length > 0) {
      configs.forEach((cfg, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `Goal ${i + 1}`;
        sel.appendChild(opt);
      });
    }
  }

  // --- Init (called every time panel opens) ---
  function init() {
    populateGoalSelect();
    render();

    if (initialized) return;
    initialized = true;

    ["boundary-xmin", "boundary-xmax", "boundary-ymin", "boundary-ymax"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", applyBoundaries);
    });

    const sel = document.getElementById("goal-select");
    if (sel) sel.addEventListener("change", applyBoundaries);
  }

  // --- Auto-init on page load ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // --- Public API ---
  window.initMovementGrid          = init;
  window.refreshMovementGoalSelect = populateGoalSelect;
})();
