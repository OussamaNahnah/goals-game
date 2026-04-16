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
  let history = [];           // ring-buffer of up to 100 previous robot snapshots
  const HISTORY_MAX = 100;
  let playing = false;    // true when auto-play is active
  let playTimer = null;   // setInterval handle
  let trailMode = false;  // when true draw movement lines instead of (or over) dots
  let ghostMode = false;  // when true draw a single swarm-centroid path line across all steps
  let trajectories = [];  // [{goalIndex, segments:[{fx,fy,tx,ty}]}] — one entry per applied step
  let showAutomaton = false;   // show goal-transition automaton diagram
  let automatonCache = null;   // [{from,to}] — invalidated when goals change
  let activeGoalIdx  = -1;     // currently highlighted node in automaton

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
    if (trailMode && trajectories.length > 0) drawTrajectories(ctx, 0.75);
    if (ghostMode && trajectories.length > 0) drawGhost(ctx);
    drawRobots(ctx);
    const showBox = document.getElementById('show-goal-box')?.checked !== false;
    if (showBox && pendingGoalBox) drawGoalBoundaryBox(ctx, pendingGoalBox, 1);
    if (showAutomaton) drawAutomaton();
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

  // --- Trail / trajectory drawing ---
  const TRAIL_COLORS = [
    '#1565c0','#2e7d32','#e65100','#6a1b9a',
    '#00838f','#c62828','#4527a0','#558b2f',
    '#f57f17','#37474f',
  ];

  // Draw accumulated movement lines.
  // newestAlpha: alpha for the last (most recent) trajectory entry.
  function drawTrajectories(ctx, newestAlpha) {
    trajectories.forEach((traj, ti) => {
      const isNewest = ti === trajectories.length - 1;
      const alpha    = isNewest ? newestAlpha : 0.55;
      if (alpha <= 0) return;
      const color = TRAIL_COLORS[traj.goalIndex % TRAIL_COLORS.length];
      traj.segments.forEach(({ fx, fy, tx, ty }) => {
        if (fx === tx && fy === ty) return; // stationary robot — skip
        const p1 = worldToCanvas(fx, fy);
        const p2 = worldToCanvas(tx, ty);
        // Line
        ctx.save();
        ctx.globalAlpha = alpha * 0.65;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p1.cx, p1.cy); ctx.lineTo(p2.cx, p2.cy); ctx.stroke();
        // Arrowhead at destination
        ctx.globalAlpha = alpha;
        const ang  = Math.atan2(p2.cy - p1.cy, p2.cx - p1.cx);
        const aLen = 9, aWid = 0.38;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(p2.cx, p2.cy);
        ctx.lineTo(p2.cx - aLen * Math.cos(ang - aWid), p2.cy - aLen * Math.sin(ang - aWid));
        ctx.lineTo(p2.cx - aLen * Math.cos(ang + aWid), p2.cy - aLen * Math.sin(ang + aWid));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    });
  }

  // Draw a single continuous path connecting swarm centroids across all steps.
  // Represents the strategy/direction of the whole swarm as one long line.
  function drawGhost(ctx) {
    if (trajectories.length === 0) return;

    // Build centroid path: starting centroid + one centroid per step end.
    // Each trajectory entry has segments [{fx,fy,tx,ty}] — from = start, to = end.
    const points = []; // {cx, cy} in canvas coords

    // Starting centroid (from-positions of first step)
    const first = trajectories[0].segments;
    const sx = first.reduce((s, seg) => s + seg.fx, 0) / first.length;
    const sy = first.reduce((s, seg) => s + seg.fy, 0) / first.length;
    points.push(worldToCanvas(sx, sy));

    // End centroid for every step
    for (const traj of trajectories) {
      const segs = traj.segments;
      const ex = segs.reduce((s, seg) => s + seg.tx, 0) / segs.length;
      const ey = segs.reduce((s, seg) => s + seg.ty, 0) / segs.length;
      points.push(worldToCanvas(ex, ey));
    }

    if (points.length < 2) return;

    const SWARM_PATH_COLOR = '#0369a1';

    ctx.save();

    // Draw the continuous path
    ctx.globalAlpha = 0.80;
    ctx.strokeStyle = SWARM_PATH_COLOR;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].cx, points[0].cy);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].cx, points[i].cy);
    ctx.stroke();

    // Small dot at each centroid waypoint
    ctx.globalAlpha = 0.60;
    ctx.fillStyle = SWARM_PATH_COLOR;
    for (let i = 0; i < points.length - 1; i++) {
      ctx.beginPath();
      ctx.arc(points[i].cx, points[i].cy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Arrowhead at every segment end (direction indicators)
    ctx.globalAlpha = 0.90;
    ctx.fillStyle = SWARM_PATH_COLOR;
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1], p2 = points[i];
      if (Math.abs(p2.cx - p1.cx) < 1 && Math.abs(p2.cy - p1.cy) < 1) continue; // no movement
      const ang  = Math.atan2(p2.cy - p1.cy, p2.cx - p1.cx);
      // Place arrowhead at midpoint so it doesn't overlap the robot dot
      const mx = (p1.cx + p2.cx) / 2, my = (p1.cy + p2.cy) / 2;
      const aLen = 8, aWid = 0.42;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - aLen * Math.cos(ang - aWid), my - aLen * Math.sin(ang - aWid));
      ctx.lineTo(mx - aLen * Math.cos(ang + aWid), my - aLen * Math.sin(ang + aWid));
      ctx.closePath();
      ctx.fill();
    }

    // Filled dot at the current (last) centroid — slightly larger
    const last = points[points.length - 1];
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = SWARM_PATH_COLOR;
    ctx.beginPath();
    ctx.arc(last.cx, last.cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(last.cx, last.cy, 5, 0, Math.PI * 2);
    ctx.stroke();

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

      // Trail: all previous at fixed alpha, newest fades in with t
      if (trailMode && trajectories.length > 0) drawTrajectories(ctx_anim, t);
      if (ghostMode && trajectories.length > 0) drawGhost(ctx_anim);

      // Show the current step's real goal boundary throughout the animation
      const showBox = document.getElementById('show-goal-box')?.checked !== false;
      if (showBox && currentGoalBox) drawGoalBoundaryBox(ctx_anim, currentGoalBox, 1);

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

    if (firstGrid.length > 0) {
      const xs = firstGrid.map(([, x]) => x);
      const ys = firstGrid.map(([,, y]) => y);
      const groupCx = (Math.min(...xs) + Math.max(...xs)) / 2;
      const groupCy = (Math.min(...ys) + Math.max(...ys)) / 2;

      // Each axis handled independently:
      //   wall present → anchor to boundary edge via wall formula
      //   no wall      → center the group at the boundary midpoint (keeps robots far from both edges)
      const boundaryCenterX = (boundary.xmin + boundary.xmax) / 2;
      const boundaryCenterY = (boundary.ymin + boundary.ymax) / 2;
      const offsetX = wallX === null
        ? boundaryCenterX - groupCx
        : (wallX <= 0 ? boundary.xmin - wallX : boundary.xmax - wallX);
      const offsetY = wallY === null
        ? boundaryCenterY - groupCy
        : (wallY <= 0 ? boundary.ymin - wallY : boundary.ymax - wallY);

      robots = firstGrid.map(([c, relX, relY]) => [
        c,
        Math.round(relX + offsetX),
        Math.round(relY + offsetY),
      ]);
    } else {
      robots = [];
    }
    pendingGoalBox = null;
    history = [];
    trajectories = [];
    automatonCache = null;
    activeGoalIdx = -1;
    if (playing) stopPlay();
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
      if (history.length >= HISTORY_MAX) history.shift(); // drop oldest when full
      history.push(from);                    // save for prevStep
      // Record trajectory segment for trail mode
      const segments = from.map((r, i) => ({ color: r[0], fx: r[1], fy: r[2], tx: result.robots[i][1], ty: result.robots[i][2] }));
      trajectories.push({ goalIndex: result.goalIndex, segments });
      automatonCache = null;                 // rebuild automaton trace on next draw
      robots = result.robots;                // advance logical state immediately
      activeGoalIdx = result.goalIndex;      // highlight in automaton
      const peek = tryNextStep();
      const showBox = document.getElementById('show-goal-box')?.checked !== false;
      pendingGoalBox = (showBox && peek) ? { corners: peek.goalBox.corners, goalIndex: peek.goalIndex } : null;
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
      // No match — stop auto-play
      if (playing) stopPlay();
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

  // Step back to the previous robot snapshot.
  function prevStep() {
    if (animating) { skipAnim = true; requestAnimationFrame(() => prevStep()); return; }
    if (history.length === 0) return;
    const prev = history.pop();
    const from = robots.map(r => [...r]);
    robots = prev;
    trajectories.pop(); // undo last trail segment
    automatonCache = null; // rebuild automaton trace on next draw
    activeGoalIdx = -1;
    pendingGoalBox = null;
    // Animate backwards (swap from/to) — reuse same function
    animateStep(from, robots, -1, null);
    const info = document.getElementById('next-step-info');
    if (info) { info.textContent = '↩ Step back'; info.style.color = '#555'; }
  }

  // Auto-play: call nextStep on an interval.
  function getPlayInterval() {
    return parseInt(document.getElementById('play-speed-select')?.value) || 720;
  }
  function startPlay() {
    if (playing) return;
    playing = true;
    updatePlayBtn();
    nextStep();
    playTimer = setInterval(() => {
      if (!playing) return;
      nextStep();
    }, getPlayInterval());
  }
  function stopPlay() {
    playing = false;
    clearInterval(playTimer);
    playTimer = null;
    updatePlayBtn();
  }
  function togglePlay() { playing ? stopPlay() : startPlay(); }

  // Reset to the initial state of the selected goal.
  function resetStep() {
    if (playing) stopPlay();
    if (animating) { skipAnim = true; }
    const sel = document.getElementById('goal-select');
    const idx = sel ? parseInt(sel.value) : NaN;
    if (!isNaN(idx)) {
      loadGoal(idx); // loadGoal already clears history, pendingGoalBox, stops play
    }
    const info = document.getElementById('next-step-info');
    if (info) { info.textContent = '↺ Reset'; info.style.color = '#555'; }
  }
  function updatePlayBtn() {
    const btn = document.getElementById('play-pause-btn');
    if (!btn) return;
    btn.textContent = playing ? '⏸' : '▶';
    btn.title = playing ? 'Pause (Space)' : 'Play (Space)';
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

  // --- Grid-size helpers ---
  function colsToBounds(n) {
    const half = Math.floor(n / 2);
    return n % 2 === 1
      ? { min: -half,      max: half      }   // odd: symmetric
      : { min: -half,      max: half - 1  };  // even: one extra on negative side
  }

  function computeGridSizes() {
    const vis      = parseInt(document.getElementById('visibility-input')?.value) ||
                     (typeof defaultVisibility  !== 'undefined' ? defaultVisibility  : 1);
    const nRobots  = typeof defaultNumRobots !== 'undefined' ? defaultNumRobots : 3;
    const B = vis * (nRobots + 1) + 3;
    return [
      [B,   B  ], [B,   B+1], [B,   B+2],
      [B+1, B  ], [B+1, B+1], [B+1, B+2],
      [B+2, B  ], [B+2, B+1],
    ].map(([cols, rows]) => {
      const xb = colsToBounds(cols);
      const yb = colsToBounds(rows);
      return { cols, rows, xmin: xb.min, xmax: xb.max, ymin: yb.min, ymax: yb.max };
    });
  }

  function applyGridSize(size) {
    document.getElementById('boundary-xmin').value = size.xmin;
    document.getElementById('boundary-xmax').value = size.xmax;
    document.getElementById('boundary-ymin').value = size.ymin;
    document.getElementById('boundary-ymax').value = size.ymax;
    applyBoundaries();
  }

  function populateGridSizeSelect() {
    const sel = document.getElementById('grid-size-select');
    if (!sel) return;
    const sizes = computeGridSizes();
    const prevVal = sel.value;
    sel.innerHTML = '';
    sizes.forEach((s, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${s.cols}×${s.rows}  [${s.xmin}→${s.xmax}] [${s.ymin}→${s.ymax}]`;
      sel.appendChild(opt);
    });
    // Separator
    const sep = document.createElement('option');
    sep.disabled = true;
    sep.textContent = '──────────────────';
    sel.appendChild(sep);
    // Manual preset: -6→6, -6→6
    const preset = document.createElement('option');
    preset.value = 'preset-6';
    preset.textContent = '13×13  [-6→6] [-6→6]';
    sel.appendChild(preset);
    // Restore previous selection if valid, otherwise default to last computed size
    const restored = parseInt(prevVal);
    if (!isNaN(restored) && restored < sizes.length) {
      sel.value = restored;
      applyGridSize(sizes[restored]);
    } else if (prevVal === 'preset-6') {
      sel.value = 'preset-6';
      // don't re-apply, boundaries already set
    } else {
      sel.value = sizes.length - 1;
      applyGridSize(sizes[sizes.length - 1]);
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
      // Auto-select first goal only if there are actual goals in the list
      if (sel.options.length > 1) {
        sel.value = '0';
        loadGoal(0);
      }
    }
    automatonCache = null; // goals changed — rebuild on next draw
  }

  // --- Automaton diagram ---

  // Build the automaton from the *actual execution trace* (trajectories).
  // Each unique consecutive pair gi→gj found in the trace becomes an edge.
  // The diagram therefore grows step by step as the simulation runs.
  function buildAutomaton() {
    if (trajectories.length === 0) return [];
    const path = trajectories.map(t => t.goalIndex);
    const seen = new Set();
    const out  = [];
    for (let i = 0; i < path.length - 1; i++) {
      const key = `${path[i]}-${path[i + 1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ from: path[i], to: path[i + 1] });
      }
    }
    // Self-loops are handled by the key above (same gi→gi)
    return out;
  }

  function _arrowHead(ctx, x, y, angle, size, color) {
    const spread = 0.38;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - spread), y - size * Math.sin(angle - spread));
    ctx.lineTo(x - size * Math.cos(angle + spread), y - size * Math.sin(angle + spread));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function _curvedArrow(ctx, x1, y1, x2, y2, nodeR, bend, color, lw) {
    const dx = x2-x1, dy = y2-y1;
    const dist = Math.sqrt(dx*dx+dy*dy);
    if (dist < 1) return;
    const ux = dx/dist, uy = dy/dist;
    const px = -uy, py = ux;                    // perpendicular (left)
    const sx = x1 + ux*nodeR, sy = y1 + uy*nodeR; // start on circle edge
    const ex = x2 - ux*nodeR, ey = y2 - uy*nodeR; // end on circle edge
    const mx = (sx+ex)/2 + px*bend, my = (sy+ey)/2 + py*bend; // control point
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
    // arrowhead angle = tangent at endpoint of quadratic curve at t=1: 2*(p2-p1)
    const tgx = ex - mx, tgy = ey - my;
    _arrowHead(ctx, ex, ey, Math.atan2(tgy, tgx), 8, color);
    ctx.restore();
  }

  function drawAutomaton() {
    const canvas = document.getElementById('automaton-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const goals = window.activeSimulationConfigs;
    if (!goals || goals.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#999'; ctx.font = '11px Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('No goals loaded', canvas.width/2, canvas.height/2);
      return;
    }

    if (!automatonCache) automatonCache = buildAutomaton();
    const transitions = automatonCache;
    const N = goals.length;

    // Auto-resize canvas to a square that comfortably fits all nodes in a circle
    const size = N <= 2 ? 160 : N <= 4 ? 220 : N <= 8 ? 280 : 320;
    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Node radius based on N
    const R = Math.min(18, Math.max(10, Math.floor(100 / N)));
    const pad = R + 10;
    const circleR = Math.min(W, H) / 2 - pad;

    // Place nodes evenly on a circle, starting from the top (-π/2)
    const nodes = Array.from({length: N}, (_, i) => {
      if (N === 1) return { x: W/2, y: H/2, angle: -Math.PI/2 };
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / N;
      return {
        x: W/2 + circleR * Math.cos(angle),
        y: H/2 + circleR * Math.sin(angle),
        angle
      };
    });

    // Identify bidirectional pairs (bend arcs in opposite directions)
    const bidir = new Set();
    transitions.forEach(t => {
      if (t.from !== t.to && transitions.some(u => u.from === t.to && u.to === t.from))
        bidir.add(`${Math.min(t.from,t.to)}-${Math.max(t.from,t.to)}`);
    });

    // Draw edges first (under nodes)
    transitions.forEach(({ from, to }) => {
      const color = TRAIL_COLORS[from % TRAIL_COLORS.length];
      const isActive = (from === activeGoalIdx);
      const lw = isActive ? 2.5 : 1.5;
      const p1 = nodes[from], p2 = nodes[to];

      if (from === to) {
        // Self-loop: small arc radiating outward from the ring
        const outAngle = p1.angle;
        const lx = p1.x + Math.cos(outAngle) * (R + R * 1.0);
        const ly = p1.y + Math.sin(outAngle) * (R + R * 1.0);
        const loopR = R * 0.72;
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(lx, ly, loopR, 0.3, Math.PI * 2 - 0.3, false);
        ctx.stroke();
        _arrowHead(ctx, lx + Math.sin(0.3)*loopR, ly + loopR*Math.cos(0.3)*0.1 + loopR*0.95,
          Math.PI*0.5 + 0.3, 7, color);
        ctx.restore();
      } else {
        const key = `${Math.min(from,to)}-${Math.max(from,to)}`;
        const bend = bidir.has(key)
          ? (from < to ? -R * 1.6 : R * 1.6)
          : -R * 0.5;
        _curvedArrow(ctx, p1.x, p1.y, p2.x, p2.y, R, bend, color, lw);
      }
    });

    // Which goals have been visited in the trace so far?
    const visitedGoals = new Set(trajectories.map(t => t.goalIndex));

    // Draw nodes on top
    for (let i = 0; i < N; i++) {
      const { x, y } = nodes[i];
      const isActive  = i === activeGoalIdx;
      const isVisited = visitedGoals.has(i);
      const color = TRAIL_COLORS[i % TRAIL_COLORS.length];
      ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? color : (isVisited ? '#e8f5e9' : '#f5f5f5');
      ctx.fill();
      ctx.strokeStyle = isVisited ? color : '#ccc';
      ctx.lineWidth = isActive ? 3 : 2; ctx.stroke();
      ctx.fillStyle = isActive ? '#fff' : (isVisited ? color : '#bbb');
      ctx.font = `bold ${Math.max(8, R - 2)}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`G${i+1}`, x, y);
    }
  }

  // --- Init (called every time panel opens) ---
  function init() {
    populateGoalSelect();
    populateGridSizeSelect();
    render();

    if (initialized) return;
    initialized = true;

    ["boundary-xmin", "boundary-xmax", "boundary-ymin", "boundary-ymax"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", applyBoundaries);
    });

    const sel = document.getElementById("goal-select");
    if (sel) sel.addEventListener("change", applyBoundaries);

    const nextBtn = document.getElementById('next-step-btn');
    if (nextBtn) nextBtn.addEventListener('click', nextStep);

    const prevBtn = document.getElementById('prev-step-btn');
    if (prevBtn) prevBtn.addEventListener('click', prevStep);

    const resetBtn = document.getElementById('reset-step-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetStep);

    const playBtn = document.getElementById('play-pause-btn');
    if (playBtn) playBtn.addEventListener('click', togglePlay);

    const showBoxChk = document.getElementById('show-goal-box');
    if (showBoxChk) showBoxChk.addEventListener('change', () => {
      if (!showBoxChk.checked) pendingGoalBox = null;
      render();
    });

    const trailChk = document.getElementById('trail-mode-chk');
    if (trailChk) trailChk.addEventListener('change', () => {
      trailMode = trailChk.checked;
      if (!trailMode) trajectories = [];
      render();
    });

    const ghostChk = document.getElementById('ghost-mode-chk');
    if (ghostChk) ghostChk.addEventListener('change', () => {
      ghostMode = ghostChk.checked;
      if (!ghostMode) trajectories = [];
      render();
    });

    const automChk = document.getElementById('automaton-chk');
    if (automChk) automChk.addEventListener('change', () => {
      showAutomaton = automChk.checked;
      const cont = document.getElementById('automaton-container');
      const area = document.getElementById('canvas-area');
      if (cont) cont.style.display = showAutomaton ? 'block' : 'none';
      if (area && showAutomaton) {
        // Side-by-side if the column is wide enough (≥630px), else stack vertically
        const wide = area.offsetWidth >= 630;
        area.style.flexDirection = wide ? 'row' : 'column';
        area.style.alignItems = 'center';
      } else if (area) {
        area.style.flexDirection = 'row';
        area.style.alignItems = 'center';
      }
      if (showAutomaton) { automatonCache = null; drawAutomaton(); }
    });

    const gridSizeSel = document.getElementById('grid-size-select');
    if (gridSizeSel) gridSizeSel.addEventListener('change', () => {
      if (gridSizeSel.value === 'preset-6') {
        applyGridSize({ xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
      } else {
        const sizes = computeGridSizes();
        applyGridSize(sizes[parseInt(gridSizeSel.value)]);
      }
    });

    const visInput = document.getElementById('visibility-input');
    if (visInput) {
      // Seed default from defaultVisibility constant if input still has the placeholder value
      if (typeof defaultVisibility !== 'undefined') {
        visInput.value = defaultVisibility;
      }
      visInput.addEventListener('change', () => populateGridSizeSelect());
    }

    document.addEventListener('keydown', (e) => {
      // Only act when the movement panel is visible
      const panel = document.getElementById('movement-grid-canvas');
      if (!panel || !panel.offsetParent) return;
      // Block only if focus is on a text-entry field that is NOT inside the movement column
      const movementCol = document.getElementById('movement-column');
      const focused = document.activeElement;
      const isTextEntry = ['INPUT','TEXTAREA'].includes(focused?.tagName) &&
                          focused?.type !== 'checkbox' && focused?.type !== 'radio';
      const insidePanel = movementCol && movementCol.contains(focused);
      if (isTextEntry && !insidePanel) return;
      if (e.code === 'Space')           { e.preventDefault(); togglePlay(); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); stopPlay(); nextStep(); }
      else if (e.code === 'ArrowLeft')  { e.preventDefault(); stopPlay(); prevStep(); }
    });
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
