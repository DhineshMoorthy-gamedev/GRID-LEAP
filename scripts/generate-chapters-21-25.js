import fs from "fs";
import path from "path";
import { solve } from "../src/core/solver.js";
import { createRNG } from "../src/core/daily-seed.js";
import { LEVELS } from "../src/data/levels.js";

/**
 * Procedural Deterministic Campaign Expansion Generator
 * Generates Chapters 21 through 25 (50 levels, 9x9 grids) with mathematical solvability proofs.
 */

const CHAPTER_SPECS = [
  {
    num: 21,
    phase: "Wormhole",
    levels: [
      { name: "Einstein-Rosen", w: 9, h: 9, moves: 8 },
      { name: "Throat Collapse", w: 9, h: 9, moves: 8 },
      { name: "Exotic Matter", w: 9, h: 9, moves: 8 },
      { name: "Spacetime Bridge", w: 9, h: 9, moves: 9 },
      { name: "Lorentzian Transit", w: 9, h: 9, moves: 9 },
      { name: "Casimir Pressure", w: 9, h: 9, moves: 9 },
      { name: "Traversable Void", w: 9, h: 9, moves: 10 },
      { name: "Gravitational Pinch", w: 9, h: 9, moves: 10 },
      { name: "Ring Singularity", w: 9, h: 9, moves: 10 },
      { name: "Chronal Conduit", w: 9, h: 9, moves: 11 }
    ]
  },
  {
    num: 22,
    phase: "Cosmic String",
    levels: [
      { name: "Topological Defect", w: 9, h: 9, moves: 9 },
      { name: "Linear Singularity", w: 9, h: 9, moves: 9 },
      { name: "Relativistic Whip", w: 9, h: 9, moves: 9 },
      { name: "Tension Vector", w: 9, h: 9, moves: 10 },
      { name: "Gravitational Wake", w: 9, h: 9, moves: 10 },
      { name: "Spacetime Cleave", w: 9, h: 9, moves: 10 },
      { name: "Oscillating Loop", w: 9, h: 9, moves: 11 },
      { name: "Cusp Burst", w: 9, h: 9, moves: 11 },
      { name: "Superconducting String", w: 9, h: 9, moves: 11 },
      { name: "Cosmic Lensing", w: 9, h: 9, moves: 12 }
    ]
  },
  {
    num: 23,
    phase: "Nebula Core",
    levels: [
      { name: "Stellar Nursery", w: 9, h: 9, moves: 9 },
      { name: "Emission Spectra", w: 9, h: 9, moves: 10 },
      { name: "Accretion Shroud", w: 9, h: 9, moves: 10 },
      { name: "Bipolar Outflow", w: 9, h: 9, moves: 10 },
      { name: "Bok Globule", w: 9, h: 9, moves: 11 },
      { name: "Herbig-Haro Jet", w: 9, h: 9, moves: 11 },
      { name: "Ionization Front", w: 9, h: 9, moves: 11 },
      { name: "Proto-Sun Ignition", w: 9, h: 9, moves: 12 },
      { name: "Shockwave Compression", w: 9, h: 9, moves: 12 },
      { name: "Thermonuclear Spark", w: 9, h: 9, moves: 13 }
    ]
  },
  {
    num: 24,
    phase: "Dark Energy",
    levels: [
      { name: "Quintessence", w: 9, h: 9, moves: 10 },
      { name: "Cosmological Lambda", w: 9, h: 9, moves: 10 },
      { name: "Metric Expansion", w: 9, h: 9, moves: 11 },
      { name: "Phantom Energy", w: 9, h: 9, moves: 11 },
      { name: "Repulsive Gravity", w: 9, h: 9, moves: 11 },
      { name: "Negative Pressure", w: 9, h: 9, moves: 12 },
      { name: "Hubble Tension", w: 9, h: 9, moves: 12 },
      { name: "The Big Rip", w: 9, h: 9, moves: 13 },
      { name: "Cosmic Horizon", w: 9, h: 9, moves: 13 },
      { name: "Dark Sector Apex", w: 9, h: 9, moves: 14 }
    ]
  },
  {
    num: 25,
    phase: "Infinity Apex",
    levels: [
      { name: "Transfinite Jump", w: 9, h: 9, moves: 10 },
      { name: "Hilbert Hotel", w: 9, h: 9, moves: 11 },
      { name: "Aleph Null", w: 9, h: 9, moves: 11 },
      { name: "Absolute Continuum", w: 9, h: 9, moves: 12 },
      { name: "Cantor Dust", w: 9, h: 9, moves: 12 },
      { name: "Infinite Cascade", w: 9, h: 9, moves: 13 },
      { name: "The Final Monolith", w: 9, h: 9, moves: 13 },
      { name: "Singular Synthesis", w: 9, h: 9, moves: 14 },
      { name: "Cosmic Archon", w: 9, h: 9, moves: 14 },
      { name: "Infinity Protocol", w: 9, h: 9, moves: 15 }
    ]
  }
];

function generateCandidate({ name, phase, w, h, targetMoves, seed }) {
  let attempt = 0;
  const maxAttempts = 1500;

  while (attempt < maxAttempts) {
    const rng = createRNG((seed + attempt * 7919) >>> 0);
    const grid = Array.from({ length: h }, () => Array(w).fill(0));

    // Goal positions on 9x9 board
    const goalPositions = [
      [0, 0], [0, w - 1], [h - 1, 0], [h - 1, w - 1],
      [1, 1], [1, w - 2], [h - 2, 1], [h - 2, w - 2],
      [2, 2], [2, w - 3], [h - 3, 2], [h - 3, w - 3],
      [Math.floor(h / 2), Math.floor(w / 2)]
    ];
    const goal = goalPositions[Math.floor(rng() * goalPositions.length)];
    grid[goal[0]][goal[1]] = 0;

    let curr = [goal[0], goal[1]];
    const visited = new Set([`${curr[0]},${curr[1]}`]);
    const path = [curr];

    const maxDim = Math.max(w, h);
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let s = 0; s < targetMoves; s++) {
      const candidates = [];
      for (const [dr, dc] of dirs) {
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
      const pick = candidates[Math.floor(rng() * candidates.length)];
      grid[pick.r][pick.c] = pick.k;
      curr = [pick.r, pick.c];
      visited.add(`${curr[0]},${curr[1]}`);
      path.push(curr);
    }

    if (path.length - 1 >= targetMoves - 1) {
      const start = path[path.length - 1];

      // Fill decoys
      const nonPathCoords = [];
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          if (!visited.has(`${r},${c}`)) nonPathCoords.push([r, c]);
        }
      }

      for (const [r, c] of nonPathCoords) {
        if (r === goal[0] && c === goal[1]) {
          grid[r][c] = 0;
          continue;
        }

        const validK = [];
        for (let k = 1; k < maxDim; k++) {
          const targets = [
            [r - k, c], [r + k, c], [r, c - k], [r, c + k]
          ].filter(([tr, tc]) => tr >= 0 && tr < h && tc >= 0 && tc < w);
          if (targets.length > 0) validK.push(k);
        }

        grid[r][c] = validK.length > 0
          ? validK[Math.floor(rng() * validK.length)]
          : 1 + Math.floor(rng() * (maxDim - 1));
      }

      const candidate = {
        name,
        phase,
        w,
        h,
        start,
        goal,
        grid,
        optimal: path.length - 1
      };

      const res = solve(candidate);
      if (res.solvable && res.moves >= targetMoves - 1 && res.moves <= targetMoves + 2) {
        candidate.optimal = res.moves;
        return candidate;
      }
    }
    attempt++;
  }

  // Fallback search
  for (let fallback = 0; fallback < 3000; fallback++) {
    const rng = createRNG((seed + 88888 + fallback * 509) >>> 0);
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const goal = [h - 1, w - 1];
    let curr = [goal[0], goal[1]];
    const visited = new Set([`${curr[0]},${curr[1]}`]);
    const path = [curr];
    const maxDim = Math.max(w, h);
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let s = 0; s < targetMoves; s++) {
      const candidates = [];
      for (const [dr, dc] of dirs) {
        for (let k = 1; k < maxDim; k++) {
          const sr = curr[0] - dr * k;
          const sc = curr[1] - dc * k;
          if (sr >= 0 && sr < h && sc >= 0 && sc < w && !visited.has(`${sr},${sc}`)) {
            candidates.push({ r: sr, c: sc, k });
          }
        }
      }
      if (candidates.length === 0) break;
      const pick = candidates[Math.floor(rng() * candidates.length)];
      grid[pick.r][pick.c] = pick.k;
      curr = [pick.r, pick.c];
      visited.add(`${curr[0]},${curr[1]}`);
      path.push(curr);
    }

    if (path.length - 1 >= 7) {
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          if (r === goal[0] && c === goal[1]) grid[r][c] = 0;
          else if (grid[r][c] === 0) grid[r][c] = 1 + Math.floor(rng() * (maxDim - 1));
        }
      }
      const candidate = { name, phase, w, h, start: path[path.length - 1], goal, grid, optimal: 0 };
      const res = solve(candidate);
      if (res.solvable && res.moves >= 7) {
        candidate.optimal = res.moves;
        return candidate;
      }
    }
  }

  throw new Error(`Failed to generate solvable level "${name}" (Target ${targetMoves} moves)`);
}

console.log(`🚀 Generating 50 new campaign levels for Chapters 21–25 (9x9 Grids)...`);
const newLevels = [];
let baseSeed = 201001;

CHAPTER_SPECS.forEach((chap) => {
  console.log(`\n📦 Generating Chapter ${chap.num}: ${chap.phase} (10 levels, 9x9)...`);
  chap.levels.forEach((spec, idx) => {
    const levelNumber = (chap.num - 1) * 10 + idx + 1;
    const seed = baseSeed + levelNumber * 1013;
    const level = generateCandidate({
      name: spec.name,
      phase: chap.phase,
      w: spec.w,
      h: spec.h,
      targetMoves: spec.moves,
      seed
    });
    const verification = solve(level);
    console.log(`  ✓ Level ${levelNumber}: "${level.name}" [${level.w}x${level.h}] Optimal: ${level.optimal} (Score: ${verification.difficulty.score})`);
    newLevels.push(level);
  });
});

console.log(`\n✅ Successfully generated all ${newLevels.length} new levels!`);

// Combine existing 200 levels with the 50 new levels
const totalLevels = [...LEVELS.slice(0, 200), ...newLevels];
console.log(`📊 Total campaign size: ${totalLevels.length} levels.`);

// Write back to src/data/levels.js
const fileHeader = `// Handcrafted & Algorithmic 250-Level Campaign Dataset\n// 25 Thematic Chapters, 10 Levels Each (3x3 to 9x9 Grids)\nexport const LEVELS = `;
const fileContent = fileHeader + JSON.stringify(totalLevels, null, 2) + ";\n";

const levelsPath = path.resolve("src/data/levels.js");
fs.writeFileSync(levelsPath, fileContent, "utf8");
console.log(`💾 Saved updated dataset to ${levelsPath}`);
