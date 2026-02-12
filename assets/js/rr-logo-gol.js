/**
 * Glitch animation for RR logo SVG.
 * Never more than 70% of cells off. Each tick toggles a small random number
 * of cells on/off. After 20s glitch, logo fills in progressively then holds 4s. No fading.
 */
(function () {
  const CELL = 22;
  const VIEWBOX_W = 571.76;
  const VIEWBOX_H = 533.35;
  const COLS = Math.ceil(VIEWBOX_W / CELL);
  const ROWS = Math.ceil(VIEWBOX_H / CELL);
  const MAX_OFF_RATIO = 0.7;
  const GLITCH_INTERVAL_MIN_MS = 40;
  const GLITCH_INTERVAL_MAX_MS = 140;
  const TOGGLE_PER_TICK_MIN = 1;
  const TOGGLE_PER_TICK_MAX = 4;
  const GLITCH_PHASE_MS = 20000;
  const FILL_PHASE_MS = 3000;
  const FULL_HOLD_MS = 4000;
  const DEAD_OPACITY = 0;

  function cellKey(c, r) {
    return c + ',' + r;
  }

  function getElementCell(el) {
    let cx, cy;
    if (el.tagName === 'rect') {
      const x = parseFloat(el.getAttribute('x')) || 0;
      const y = parseFloat(el.getAttribute('y')) || 0;
      const w = parseFloat(el.getAttribute('width')) || 0;
      const h = parseFloat(el.getAttribute('height')) || 0;
      cx = x + w / 2;
      cy = y + h / 2;
    } else {
      try {
        const b = el.getBBox();
        cx = b.x + b.width / 2;
        cy = b.y + b.height / 2;
      } catch (e) {
        return null;
      }
    }
    const col = Math.floor(cx / CELL);
    const row = Math.floor(cy / CELL);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    return { col, row, key: cellKey(col, row) };
  }

  function run() {
    const svgs = document.querySelectorAll('.rr-logo-header svg');
    if (!svgs.length) return;

    const elementByCell = new Map();
    svgs.forEach(function (svg) {
      const elements = [].slice.call(svg.querySelectorAll('rect, path'));
      elements.forEach(function (el) {
        const cell = getElementCell(el);
        if (!cell) return;
        if (!elementByCell.has(cell.key)) elementByCell.set(cell.key, []);
        elementByCell.get(cell.key).push(el);
      });
    });

    const allCells = Array.from(elementByCell.keys());
    const totalCells = allCells.length;
    const maxOff = Math.max(0, Math.floor(totalCells * MAX_OFF_RATIO));
    const currentOff = new Set();
    const allVisible = new Set(allCells);
    let lastGlitchTime = null;
    let nextGlitchInMs = 0;
    let cycleStartTime = null;
    let phase = 'glitch';
    let fillStartTime = null;
    let fillOrder = null;
    let rafId = null;

    function applyOpacities(visibleSet) {
      elementByCell.forEach(function (els, key) {
        const opacity = visibleSet.has(key) ? 1 : DEAD_OPACITY;
        els.forEach(function (el) {
          el.style.transition = 'none';
          el.style.opacity = opacity;
        });
      });
    }

    function pickRandomCell() {
      return allCells[Math.floor(Math.random() * totalCells)];
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function tick(timestamp) {
      if (cycleStartTime === null) cycleStartTime = timestamp;
      const elapsedInPhase = timestamp - cycleStartTime;

      if (phase === 'full') {
        if (elapsedInPhase >= FULL_HOLD_MS) {
          phase = 'glitch';
          cycleStartTime = timestamp;
          lastGlitchTime = timestamp;
          nextGlitchInMs = GLITCH_INTERVAL_MIN_MS + Math.random() * (GLITCH_INTERVAL_MAX_MS - GLITCH_INTERVAL_MIN_MS);
        }
      } else if (phase === 'filling') {
        const fillElapsed = timestamp - fillStartTime;
        const progress = Math.min(1, fillElapsed / FILL_PHASE_MS);
        const numRevealed = Math.floor(progress * fillOrder.length);
        currentOff.clear();
        for (let i = numRevealed; i < fillOrder.length; i++) currentOff.add(fillOrder[i]);
        const visible = new Set(allCells.filter(function (k) { return !currentOff.has(k); }));
        applyOpacities(visible);
        if (progress >= 1) {
          phase = 'full';
          cycleStartTime = timestamp;
          currentOff.clear();
          applyOpacities(allVisible);
          fillOrder = null;
        }
      } else {
        if (elapsedInPhase >= GLITCH_PHASE_MS) {
          const toFill = Array.from(currentOff);
          if (toFill.length === 0) {
            phase = 'full';
            cycleStartTime = timestamp;
            applyOpacities(allVisible);
          } else {
            phase = 'filling';
            fillStartTime = timestamp;
            fillOrder = shuffle(toFill);
          }
        } else {
          if (lastGlitchTime === null) {
            lastGlitchTime = timestamp;
            nextGlitchInMs = GLITCH_INTERVAL_MIN_MS + Math.random() * (GLITCH_INTERVAL_MAX_MS - GLITCH_INTERVAL_MIN_MS);
          }
          if (timestamp - lastGlitchTime >= nextGlitchInMs) {
            lastGlitchTime = timestamp;
            nextGlitchInMs = GLITCH_INTERVAL_MIN_MS + Math.random() * (GLITCH_INTERVAL_MAX_MS - GLITCH_INTERVAL_MIN_MS);

            const numToggles = TOGGLE_PER_TICK_MIN + Math.floor(Math.random() * (TOGGLE_PER_TICK_MAX - TOGGLE_PER_TICK_MIN + 1));
            const tried = new Set();
            for (let i = 0; i < numToggles; i++) {
              const key = pickRandomCell();
              if (tried.has(key)) continue;
              tried.add(key);

              if (currentOff.has(key)) {
                currentOff.delete(key);
              } else if (currentOff.size < maxOff) {
                currentOff.add(key);
              }
            }
            const visible = new Set(allCells.filter(function (k) { return !currentOff.has(k); }));
            applyOpacities(visible);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    applyOpacities(new Set(allCells));
    rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
