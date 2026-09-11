import { solve } from "./solver.js";
import { hashStringToSeed, createRNG } from "./daily-seed.js";

/**
 * Procedural Deterministic Daily Level Generator
 * Creates a valid, engaging Grid Leap puzzle based on a calendar seed.
 */
export function generateDailyLevel(dateKey) {
  const baseSeed = hashStringToSeed(dateKey);
  let attempt = 0;
  const maxAttempts = 100;

  // Determine grid size based on day of week
  // UTC day of week: 0 (Sun) to 6 (Sat)
  const d = new Date(dateKey + "T00:00:00Z");
  const dayOfWeek = isNaN(d.getTime()) ? 1 : d.getUTCDay();

  // Weekend: 5x5, Weekdays: 4x4 or 5x5
  const size = (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5) ? 5 : 4;
  const minMoves = size === 5 ? 5 : 4;

  while (attempt < maxAttempts) {
    const rng = createRNG((baseSeed + attempt * 7919) >>> 0);
    const candidate = buildCandidatePuzzle(size, size, rng, dateKey, minMoves);

    if (candidate) {
      const solverResult = solve(candidate);
      if (solverResult.solvable && solverResult.moves >= minMoves) {
        candidate.optimal = solverResult.moves;
        candidate.difficulty = solverResult.difficulty;
        return candidate;
      }
    }
    attempt++;
  }

  // Fallback safe 4x4 if search space was unusually constrained
  return getFallbackDailyLevel(dateKey);
}

/**
 * Builds candidate level via reverse path walk
 */
function buildCandidatePuzzle(w, h, rng, dateKey, targetSteps) {
  const grid = Array.from({ length: h }, () => Array(w).fill(0));
  
  // Goal at bottom-right corner or random corner
  const goal = [h - 1, w - 1];
  grid[goal[0]][goal[1]] = 0;

  // Start reverse walk from goal
  let curr = [goal[0], goal[1]];
  const visited = new Set();
  visited.add(`${curr[0]},${curr[1]}`);
  const path = [curr];

  const steps = targetSteps + Math.floor(rng() * 3); // targetSteps to targetSteps + 2
  const maxDim = Math.max(w, h);

  for (let s = 0; s < steps; s++) {
    // Determine potential jump sources that could jump to curr
    const candidates = [];
    const dirs = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    for (const [dr, dc] of dirs) {
      // jump distance k from 1 to maxDim - 1
      for (let k = 1; k < maxDim; k++) {
        const sr = curr[0] - dr * k;
        const sc = curr[1] - dc * k;
        if (sr >= 0 && sr < h && sc >= 0 && sc < w) {
          const key = `${sr},${sc}`;
          if (!visited.has(key)) {
            candidates.push({ r: sr, c: sc, k });
          }
        }
      }
    }

    if (candidates.length === 0) break;

    // Pick random candidate jump source
    const pick = candidates[Math.floor(rng() * candidates.length)];
    grid[pick.r][pick.c] = pick.k;
    curr = [pick.r, pick.c];
    visited.add(`${curr[0]},${curr[1]}`);
    path.push(curr);
  }

  // If path is too short, reject
  if (path.length < targetSteps) {
    return null;
  }

  const start = path[path.length - 1];

  // Fill remaining unvisited cells with plausible decoy numbers
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (r === goal[0] && c === goal[1]) {
        grid[r][c] = 0;
      } else if (grid[r][c] === 0) {
        // Pick plausible jump distance between 1 and maxDim - 1
        // Bias slightly towards 1 and 2 for tighter connectivity
        const val = 1 + Math.floor(rng() * (maxDim - 1));
        grid[r][c] = val;
      }
    }
  }

  return {
    name: `Daily Challenge • ${dateKey}`,
    phase: "Daily",
    w,
    h,
    start,
    goal,
    grid,
    optimal: path.length - 1,
    isDaily: true,
    dateKey
  };
}

/**
 * Deterministic fallback level if search budget expires
 */
function getFallbackDailyLevel(dateKey) {
  return {
    name: `Daily Challenge • ${dateKey}`,
    phase: "Daily",
    w: 4,
    h: 4,
    start: [0, 0],
    goal: [3, 3],
    grid: [
      [2, 1, 2, 1],
      [1, 3, 1, 2],
      [2, 1, 1, 1],
      [1, 2, 1, 0]
    ],
    optimal: 4,
    isDaily: true,
    dateKey
  };
}
