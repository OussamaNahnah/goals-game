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
  let currentWall = { x: null, y: null }; // absolute wall coords on master grid
  let initialized = false;
  let animating = false; // true while a step animation is running
  let skipAnim  = false; // set true mid-animation to snap to end
  let ctx_anim  = null;  // canvas context reused by animation helpers
  let pendingGoalBox = null; // { corners, goalIndex } of the NEXT matching goal, drawn persistently after each step

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
    if (pendingGoalBox) drawGoalBoundaryBox(ctx, pendingGoalBox, 1);
  }

  // --- Animation helpers ---

  // Draw an explicit robot list at a given alpha using ctx_anim.
  function drawListFX(list, alpha) {
    if (alpha <= 0) return;
    const colorMap = window.letterColorMap || {};
    list.forEach(([color, x, y]) => {
      const { cx, cy } = worldToCanvas(x, y);
      const inBounds = isWithinBoundary(x, y);
      ctx_anim.globalAlpha = alpha;
      ctx_anim.fillStyle = colorMap[color] || 'gray';
      ctx_anim.beginPath(); ctx_anim.arc(cx, cy, 8, 0, Math.PI * 2); ctx_anim.fill();
      ctx_anim.setLineDash([]);
      ctx_anim.strokeStyle = inBounds ? '#000' : '#e53935';
      ctx_anim.lineWidth = 2; ctx_anim.stroke();
      ctx_anim.fillStyle = '#fff';
      ctx_anim.font = 'bold 12px Arial';
      ctx_anim.textAlign = 'center'; ctx_anim.textBaseline = 'middle';
      ctx_anim.fillText(color, cx, cy);
      ctx_anim.globalAlpha = 1;
    });
  }

  // Draw the real goal boundary box (rotated + translated into master-grid world coords).
  // goalBox = { corners: [[wx,wy], ...4 corners in order], goalIndex }
  function drawGoalBoundaryBox(ctx, goalBox, alpha) {
    if (!goalBox || alpha <= 0) return;
    const { corners, goalIndex } = goalBox;
    const pts = corners.map(([wx, wy]) => worldToCanvas(wx, wy));

    ctx.save();
    // Light fill to shade the working region
    ctx.globalAlpha = alpha * 0.10;
    ctx.fillStyle = '#1565c0';
    ctx.beginPath();
    ctx.moveTo(pts[0].cx, pts[0].cy);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].cx, pts[i].cy);
    ctx.closePath();
    ctx.fill();

    // Dashed stroke
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#1565c0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(pts[0].cx, pts[0].cy);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].cx, pts[i].cy);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Badge at the top-left canvas corner of the bounding rect
    const minCx = Math.min(...pts.map(p => p.cx));
    const minCy = Math.min(...pts.map(p => p.cy));
    const label = `Goal ${goalIndex + 1}`;
    ctx.font = 'bold 11px Inter, Arial, sans-serif';
    const tw = ctx.measureText(label).width;
    const lpad = 5, lh = 17;
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(minCx, minCy - lh, tw + lpad * 2, lh);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, minCx + lpad, minCy - lh / 2);
    ctx.restore();
  }

  // Transition animation: robots fade at midpoint; current goal box shown throughout.
  // After animation ends, render() draws pendingGoalBox (the next goal).
  const ANIM_DURATION = 520;
  function animateStep(from, to, goalIndex, currentGoalBox) {
    const canvas = document.getElementById('movement-grid-canvas');
    if (!canvas) { render(); return; }
    ctx_anim  = canvas.getContext('2d');
    animating = true;
    skipAnim  = false;
    const start = performance.now();

    function frame(now) {
      const t = skipAnim ? 1 : Math.min((now - start) / ANIM_DURATION, 1);
      drawGrid(ctx_anim);
      drawBoundary(ctx_anim);

      // Show the current step's real goal boundary throughout the animation
      if (currentGoalBox) drawGoalBoundaryBox(ctx_anim, currentGoalBox, 1);

      // Main robots: fade 1→0.5, switch, fade 0.5→1
      if (t < 0.40) {
        drawListFX(from, 1 - (t / 0.40) * 0.5);
      } else if (t < 0.60) {
        drawListFX(to, 0.5);
      } else {
        drawListFX(to, 0.5 + ((t - 0.60) / 0.40) * 0.5);
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        animating = false;
        skipAnim  = false;
        render(); // render() will draw pendingGoalBox (next goal)
      }
    }
    requestAnimationFrame(frame);
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

    // Store absolute wall positions (wall always lands on the boundary edge)
    currentWall.x = wallX !== null ? (wallX <= 0 ? boundary.xmin : boundary.xmax) : null;
    currentWall.y = wallY !== null ? (wallY <= 0 ? boundary.ymin : boundary.ymax) : null;

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
    pendingGoalBox = null;
    render();
  }

  // --- Rotation helpers (matches Rust rotate_point / rotate_walls) ---
  function rotatePoint(x, y, angle) {
    switch (angle) {
      case 0:   return [x,  y];
      case 90:  return [y, -x];
      case 180: return [-x, -y];
      case 270: return [-y,  x];
      default:  return [x,  y];
    }
  }

  function rotateWalls(xWall, yWall, angle) {
    switch (angle) {
      case 0:   return [xWall, yWall];
      case 90:  return [yWall, xWall !== null ? -xWall : null];
      case 180: return [xWall !== null ? -xWall : null, yWall !== null ? -yWall : null];
      case 270: return [yWall !== null ? -yWall : null, xWall];
      default:  return [xWall, yWall];
    }
  }

  // Check if every robot in goalPositions has one match in currentPositions (color + coords).
  function matchPositions(currentPositions, goalPositions) {
    const used = new Set();
    for (const [gc, gx, gy] of goalPositions) {
      const idx = currentPositions.findIndex(([cc, cx, cy], i) =>
        !used.has(i) && cc === gc && cx === gx && cy === gy
      );
      if (idx < 0) return false;
      used.add(idx);
    }
    return true;
  }

  // --- Compute effective walls from boundary proximity ---
  // A boundary edge becomes a wall when any robot is within `vis` of it.
  function computeEffectiveWall(vis) {
    let xWall = null, yWall = null;
    for (const [, x, y] of robots) {
      if (xWall === null && boundary.xmax - x <= vis && boundary.xmax - x >= 0) xWall = boundary.xmax;
      if (xWall === null && x - boundary.xmin <= vis && x - boundary.xmin >= 0) xWall = boundary.xmin;
      if (yWall === null && boundary.ymax - y <= vis && boundary.ymax - y >= 0) yWall = boundary.ymax;
      if (yWall === null && y - boundary.ymin <= vis && y - boundary.ymin >= 0) yWall = boundary.ymin;
    }
    return { x: xWall, y: yWall };
  }

  // --- Helper: format a robot list for logging ---
  function fmtRobots(rs) {
    return rs.map(([c, x, y]) => `${c}(${x},${y})`).join(' ');
  }

  // Try every goal/rotation/reference combination.
  // Returns { robots, goalIndex, rotation } on success, or null.
  function tryNextStep() {
    const goals = window.activeSimulationConfigs;
    if (!goals || goals.length === 0 || robots.length === 0) {
      console.warn('[Next] No goals loaded or no robots on grid.');
      return null;
    }

    const vis = parseInt(document.getElementById('visibility-input')?.value) || 1;
    const effWall = computeEffectiveWall(vis);

    console.group(
      `[Next] robots: ${fmtRobots(robots)} | vis=${vis} | eff-wall x=${effWall.x ?? '–'} y=${effWall.y ?? '–'}`
    );

    for (let refIdx = 0; refIdx < robots.length; refIdx++) {
      const [, refX, refY] = robots[refIdx];
      const adjCurrent = robots.map(([c, x, y]) => [c, x - refX, y - refY]);
      const adjXWall   = effWall.x !== null ? effWall.x - refX : null;
      const adjYWall   = effWall.y !== null ? effWall.y - refY : null;

      for (let gi = 0; gi < goals.length; gi++) {
        const config   = goals[gi];
        const startPos = config.grids[0] || [];
        const endPos   = config.grids[config.grids.length - 1] || [];
        if (startPos.length === 0 || endPos.length === 0) continue;
        if (startPos.length !== robots.length) continue;

        let goalXWall = null, goalYWall = null;
        if (config.walls) {
          config.walls.forEach(wall => {
            if (wall.type === 'vertical')   goalXWall = wall.x1;
            if (wall.type === 'horizontal') goalYWall = wall.y1;
          });
        }

        for (let ruleRefIdx = 0; ruleRefIdx < startPos.length; ruleRefIdx++) {
          const [, ruleRefX, ruleRefY] = startPos[ruleRefIdx];
          const adjStart  = startPos.map(([c, x, y]) => [c, x - ruleRefX, y - ruleRefY]);
          const adjEnd    = endPos.map(([c, x, y])   => [c, x - ruleRefX, y - ruleRefY]);
          const gXWallAdj = goalXWall !== null ? goalXWall - ruleRefX : null;
          const gYWallAdj = goalYWall !== null ? goalYWall - ruleRefY : null;

          for (const angle of [0, 90, 180, 270]) {
            const rotStart = adjStart.map(([c, x, y]) => { const [rx, ry] = rotatePoint(x, y, angle); return [c, rx, ry]; });
            const rotEnd   = adjEnd.map(([c, x, y])   => { const [rx, ry] = rotatePoint(x, y, angle); return [c, rx, ry]; });
            const [rotGoalXWall, rotGoalYWall] = rotateWalls(gXWallAdj, gYWallAdj, angle);

            const xWallOk = adjXWall === null
              ? rotGoalXWall === null
              : rotGoalXWall !== null && adjXWall === rotGoalXWall;
            const yWallOk = adjYWall === null
              ? rotGoalYWall === null
              : rotGoalYWall !== null && adjYWall === rotGoalYWall;
            if (!xWallOk || !yWallOk) continue; // wall mismatch — skip silently

            const posMatch = matchPositions(adjCurrent, rotStart);
            console.log(
              `  Goal${gi + 1} ruleRef=${ruleRefIdx} ${angle}°` +
              ` | wall(x=${rotGoalXWall ?? '–'},y=${rotGoalYWall ?? '–'}) vs cur(x=${adjXWall ?? '–'},y=${adjYWall ?? '–'}) ✓` +
              ` | cur=[${fmtRobots(adjCurrent)}] vs goal=[${fmtRobots(rotStart)}]` +
              ` | pos: ${posMatch ? '✓ MATCH' : '✗ no match'}`
            );

            if (!posMatch) continue;

            const newRobots = robots.map(([c, x, y]) => {
              const adjX = x - refX;
              const adjY = y - refY;
              const si = rotStart.findIndex(([sc, sx, sy]) => sc === c && sx === adjX && sy === adjY);
              if (si >= 0) {
                const dx = rotEnd[si][1] - rotStart[si][1];
                const dy = rotEnd[si][2] - rotStart[si][2];
                // use rotEnd color (r2): may differ from current color (e.g. L→R in goal 2)
                return [rotEnd[si][0], x + dx, y + dy];
              }
              return [c, x, y];
            });

            console.log(
              `  ✓ APPLY Goal${gi + 1} | refRobot=${refIdx} ruleRef=${ruleRefIdx} rot=${angle}°` +
              ` | ${fmtRobots(robots)} → ${fmtRobots(newRobots)}`
            );
            console.groupEnd();
            // Compute real goal boundary corners in master-grid world coords
            const goalBounds = config.boundaries || { xmin: -2, xmax: 2, ymin: -2, ymax: 2 };
            const goalBoxCorners = [
              [goalBounds.xmin, goalBounds.ymin],
              [goalBounds.xmax, goalBounds.ymin],
              [goalBounds.xmax, goalBounds.ymax],
              [goalBounds.xmin, goalBounds.ymax],
            ].map(([bx, by]) => {
              const [rx, ry] = rotatePoint(bx - ruleRefX, by - ruleRefY, angle);
              return [rx + refX, ry + refY];
            });
            return {
              robots: newRobots, goalIndex: gi, rotation: angle,
              goalBox: { corners: goalBoxCorners, goalIndex: gi },
            };
          }
        }
      }
    }

    console.log('  ✗ No matching goal found for current positions.');
    console.groupEnd();
    return null;
  }

  // Highlight the goal frame in the simulator column.
  function highlightGoalFrame(goalIndex) {
    const frames = document.querySelectorAll('#simulator-column .simulation-frame');
    const frame  = frames[goalIndex];
    if (!frame) return;
    // Scroll the frame into view inside the simulator column
    frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Strip any previous flash, force reflow, re-add
    frame.classList.remove('goal-flash');
    void frame.offsetWidth; // reflow
    frame.classList.add('goal-flash');
    setTimeout(() => frame.classList.remove('goal-flash'), 1200);
  }

  // Perform one step: find a matching goal and update robots.
  function nextStep() {
    const btn  = document.getElementById('next-step-btn');
    const info = document.getElementById('next-step-info');

    if (animating) {
      skipAnim = true;
      requestAnimationFrame(() => nextStep());
      return;
    }

    const result = tryNextStep();

    if (result) {
      const from = robots.map(r => [...r]);  // snapshot before advancing
      robots = result.robots;                // advance logical state immediately
      // Peek what comes next so we can show the next goal's region after animation
      const peek = tryNextStep();
      pendingGoalBox = peek ? { corners: peek.goalBox.corners, goalIndex: peek.goalIndex } : null;
      animateStep(from, result.robots, result.goalIndex, result.goalBox);
      highlightGoalFrame(result.goalIndex);
      if (info) {
        info.textContent =
          `✓ Goal ${result.goalIndex + 1} | rot ${result.rotation}° | ${fmtRobots(result.robots)}`;
        info.style.color = '#1b5e20';
      }
      if (btn) {
        const orig = btn.style.background;
        btn.style.background = 'linear-gradient(145deg,#c8e6c9,#a5d6a7)';
        btn.style.color = '#1b5e20';
        setTimeout(() => { btn.style.background = orig; btn.style.color = '#1565c0'; }, 400);
      }
    } else {
      if (info) {
        info.textContent = '✗ No matching goal found';
        info.style.color = '#b71c1c';
      }
      if (btn) {
        btn.style.background = 'linear-gradient(145deg,#ffcdd2,#ef9a9a)';
        btn.style.color = '#b71c1c';
        setTimeout(() => {
          btn.style.background = 'linear-gradient(145deg,#e3f2fd,#bbdefb)';
          btn.style.color = '#1565c0';
        }, 500);
      }
    }
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

    const nextBtn = document.getElementById("next-step-btn");
    if (nextBtn) nextBtn.addEventListener("click", nextStep);
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
