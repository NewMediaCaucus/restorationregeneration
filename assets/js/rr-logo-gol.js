/**
 * Conway's Game of Life animation for RR logo SVG.
 * Maps logo cells to a grid. Each cell is either on (opacity 1) or off (opacity 0).
 * Conway's rules: birth on 3 neighbors, survive on 2 or 3, else die.
 * GoL runs 40s, then original cells slowly reappear one-by-one over 8s (48s total).
 */
(function () {
  const CELL = 22;
  const VIEWBOX_W = 571.76;
  const VIEWBOX_H = 533.35;
  const COLS = Math.ceil(VIEWBOX_W / CELL);
  const ROWS = Math.ceil(VIEWBOX_H / CELL);
  const FRAME_MS = 180;
  const GOL_DURATION_MS = 40000;
  const REAPPEAR_MS = 8000;
  const TOTAL_MS = GOL_DURATION_MS + REAPPEAR_MS;
  const DEAD_OPACITY = 0;

  function cellKey(c, r) {
    return c + ',' + r;
  }

  function getNeighbors(c, r) {
    const out = [];
    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        if (dc === 0 && dr === 0) continue;
        const nc = c + dc;
        const nr = r + dr;
        if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS) out.push(cellKey(nc, nr));
      }
    }
    return out;
  }

  function nextGeneration(liveSet) {
    const neighborCount = new Map();
    const consider = new Set(liveSet);
    liveSet.forEach(function (key) {
      const [c, r] = key.split(',').map(Number);
      getNeighbors(c, r).forEach(function (n) {
        consider.add(n);
        neighborCount.set(n, (neighborCount.get(n) || 0) + 1);
      });
    });
    const next = new Set();
    consider.forEach(function (key) {
      const count = neighborCount.get(key) || 0;
      const alive = liveSet.has(key);
      if (alive && (count === 2 || count === 3)) next.add(key);
      else if (!alive && count === 3) next.add(key);
    });
    return next;
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
    const svg = document.getElementById('rr-logo');
    if (!svg) return;

    const elements = [].slice.call(svg.querySelectorAll('rect, path'));
    const elementByCell = new Map();

    elements.forEach(function (el) {
      const cell = getElementCell(el);
      if (!cell) return;
      if (!elementByCell.has(cell.key)) elementByCell.set(cell.key, []);
      elementByCell.get(cell.key).push(el);
    });

    const initialLive = new Set(elementByCell.keys());
    const initialLiveOrdered = Array.from(initialLive);
    for (let i = initialLiveOrdered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialLiveOrdered[i], initialLiveOrdered[j]] = [initialLiveOrdered[j], initialLiveOrdered[i]];
    }
    let genCount = 0;
    let currentSet = new Set(initialLive);
    let startTime = null;
    let rafId = null;

    function applyOpacities(set) {
      elementByCell.forEach(function (els, key) {
        const opacity = set.has(key) ? 1 : DEAD_OPACITY;
        els.forEach(function (el) {
          el.style.transition = 'none';
          el.style.opacity = opacity;
        });
      });
    }

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= TOTAL_MS) {
        applyOpacities(initialLive);
        elements.forEach(function (el) {
          el.style.transition = '';
          el.style.opacity = '';
        });
        return;
      }

      if (elapsed < GOL_DURATION_MS) {
        const targetGen = Math.floor(elapsed / FRAME_MS);
        while (genCount < targetGen) {
          currentSet = nextGeneration(currentSet);
          genCount++;
        }
        applyOpacities(currentSet);
      } else {
        const reappearElapsed = elapsed - GOL_DURATION_MS;
        const t = Math.min(1, reappearElapsed / REAPPEAR_MS);
        const numRevealed = Math.floor(initialLiveOrdered.length * t);
        const revealed = new Set(initialLiveOrdered.slice(0, numRevealed));
        applyOpacities(revealed);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
