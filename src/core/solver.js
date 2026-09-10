import { calculateLegalDestinations } from "./rules.js";

/**
 * Pure BFS Graph Solver and Level Pathfinding Analyzer
 */
export function solve(level, fromPos = null) {
  const { w, h, grid, start, goal } = level;
  const s = fromPos || start;
  const key = (r, c) => `${r},${c}`;
  const unkey = (k) => k.split(",").map(Number);

  const dist = new Map();
  const parent = new Map();
  dist.set(key(...s), 0);
  const q = [s];
  let head = 0;
  let path = null;

  while (head < q.length) {
    const [r, c] = q[head++];
    if (r === goal[0] && c === goal[1] && !path) {
      path = [];
      let currKey = key(r, c);
      while (currKey) {
        path.unshift(unkey(currKey));
        currKey = parent.get(currKey);
      }
    }
    const exits = calculateLegalDestinations(level, [r, c]);
    for (const e of exits) {
      const nr = e.r, nc = e.c;
      if (!dist.has(key(nr, nc))) {
        dist.set(key(nr, nc), dist.get(key(r, c)) + 1);
        parent.set(key(nr, nc), key(r, c));
        q.push([nr, nc]);
      }
    }
  }

  if (!path) {
    return {
      solvable: false,
      moves: 0,
      distance: null,
      path: [],
      reachableCount: dist.size,
      difficulty: {
        score: 0,
        tier: "UNSOLVABLE",
        label: "Unsolvable",
        color: "var(--danger)",
        metrics: { optimalMoves: 0, decoyCount: 0, maxTrapDepth: 0, avgBranching: 0 }
      }
    };
  }

  const moves = path.length - 1;
  const reachableCount = dist.size;
  const decoyCount = Math.max(0, reachableCount - path.length);

  // Solution path branching factor
  let branchSum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const exits = calculateLegalDestinations(level, path[i]);
    branchSum += exits.length;
  }
  const avgBranching = (path.length > 1) ? Math.round((branchSum / (path.length - 1)) * 10) / 10 : 1;

  // Maximum trap depth
  // Fast O(V+E) reverse BFS to identify all cells that can reach the goal
  const canReachGoalSet = new Set([key(...goal)]);
  const revAdj = new Map();
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const exits = calculateLegalDestinations(level, [r, c]);
      for (const e of exits) {
        const ek = key(e.r, e.c);
        if (!revAdj.has(ek)) revAdj.set(ek, []);
        revAdj.get(ek).push(key(r, c));
      }
    }
  }

  const revQ = [key(...goal)];
  let revHead = 0;
  while (revHead < revQ.length) {
    const currKey = revQ[revHead++];
    const preds = revAdj.get(currKey) || [];
    for (const p of preds) {
      if (!canReachGoalSet.has(p)) {
        canReachGoalSet.add(p);
        revQ.push(p);
      }
    }
  }

  let maxTrapDepth = 0;
  for (const [k] of dist.entries()) {
    if (!canReachGoalSet.has(k)) {
      const pos = unkey(k);
      const tDist = new Map();
      tDist.set(k, 1);
      const tQ = [pos];
      let tHead = 0;
      let localMax = 1;
      while (tHead < tQ.length) {
        const curr = tQ[tHead++];
        const cd = tDist.get(key(...curr));
        localMax = Math.max(localMax, cd);
        const exits = calculateLegalDestinations(level, curr);
        for (const e of exits) {
          const ek = key(e.r, e.c);
          if (!tDist.has(ek)) {
            tDist.set(ek, cd + 1);
            tQ.push([e.r, e.c]);
          }
        }
      }
      maxTrapDepth = Math.max(maxTrapDepth, localMax);
    }
  }

  const difficulty = calculateDifficulty(level, moves, decoyCount, maxTrapDepth, avgBranching);

  return {
    solvable: true,
    moves,
    distance: moves, // for backwards compatibility
    path,
    reachableCount,
    decoyCount,
    maxTrapDepth,
    avgBranching,
    difficulty
  };
}

/**
 * Mathematical Difficulty Score Engine
 */
export function calculateDifficulty(level, moves, decoyCount, maxTrapDepth, avgBranching) {
  const { w, h } = level;
  const gridComplexity = Math.sqrt(w * h);

  const raw = (moves * 3.5) + (decoyCount * 1.0) + (maxTrapDepth * 2.0) + (avgBranching * 2.5) + (gridComplexity * 0.8);
  let score = Math.min(10.0, Math.max(1.0, (raw - 7.5) / 5.2));
  score = Math.round(score * 10) / 10;

  let tier = "EASY";
  let label = "Easy / Tutorial";
  let color = "var(--teal)";

  if (score >= 8.0) {
    tier = "MASTER";
    label = "Master / Expert";
    color = "var(--danger)";
  } else if (score >= 5.5) {
    tier = "HARD";
    label = "Hard / Deceptive";
    color = "var(--amber)";
  } else if (score >= 3.0) {
    tier = "MEDIUM";
    label = "Medium / Planning";
    color = "var(--sky)";
  }

  return {
    score,
    tier,
    label,
    color,
    metrics: {
      optimalMoves: moves,
      decoyCount,
      maxTrapDepth,
      avgBranching,
      gridComplexity: Math.round(gridComplexity * 10) / 10
    }
  };
}

export function validateAll(levels) {
  let validCount = 0;
  levels.forEach((lv, i) => {
    const res = solve(lv);
    const d = res ? res.distance : null;
    if (d === null) {
      console.error(`[VALIDATION FAILED] Level ${i + 1} (${lv.name}): no solution found!`);
    } else if (d !== lv.optimal) {
      console.warn(`[OPTIMAL MISMATCH] Level ${i + 1} (${lv.name}): solver says ${d} vs stored ${lv.optimal}`);
    } else {
      validCount++;
    }
  });
  if (validCount === levels.length) {
    console.log(`[LEVEL VALIDATION SUCCESS] All ${levels.length} handcrafted levels verified and passed BFS solver.`);
  }
}
