import fs from "fs";
import path from "path";
import { solve } from "../src/core/solver.js";
import { createRNG } from "../src/core/daily-seed.js";
import { LEVELS } from "../src/data/levels.js";

/**
 * Procedural Deterministic Campaign Expansion Generator
 * Generates Chapters 11 through 20 (100 levels) with mathematical solvability proofs.
 */

const CHAPTER_SPECS = [
  {
    num: 11,
    phase: "Singularity",
    levels: [
      { name: "Singularity Point", w: 6, h: 6, moves: 7 },
      { name: "Gravitational Well", w: 6, h: 6, moves: 7 },
      { name: "Orbital Decay", w: 6, h: 6, moves: 8 },
      { name: "Tidal Force", w: 7, h: 7, moves: 8 },
      { name: "Spacetime Warp", w: 7, h: 7, moves: 8 },
      { name: "Event Boundary", w: 7, h: 7, moves: 9 },
      { name: "Accretion Flow", w: 7, h: 7, moves: 8 },
      { name: "Schwarzschild Radius", w: 7, h: 7, moves: 9 },
      { name: "Frame Dragging", w: 7, h: 7, moves: 9 },
      { name: "Graviton Core", w: 7, h: 7, moves: 9 }
    ]
  },
  {
    num: 12,
    phase: "Quantum Leap",
    levels: [
      { name: "Superposition", w: 7, h: 7, moves: 7 },
      { name: "Wave Collapse", w: 7, h: 7, moves: 8 },
      { name: "Entanglement", w: 7, h: 7, moves: 8 },
      { name: "Tunneling Vector", w: 7, h: 7, moves: 8 },
      { name: "Planck Constant", w: 7, h: 7, moves: 9 },
      { name: "Schrodinger Path", w: 7, h: 7, moves: 9 },
      { name: "Quantum Decoherence", w: 7, h: 7, moves: 9 },
      { name: "Interference Pattern", w: 7, h: 7, moves: 10 },
      { name: "Phase Shift", w: 7, h: 7, moves: 10 },
      { name: "Zero-Point Flux", w: 7, h: 7, moves: 10 }
    ]
  },
  {
    num: 13,
    phase: "Event Horizon",
    levels: [
      { name: "Null Surface", w: 7, h: 7, moves: 8 },
      { name: "Photon Sphere", w: 7, h: 7, moves: 8 },
      { name: "Ergosphere", w: 7, h: 7, moves: 8 },
      { name: "Hawking Flux", w: 7, h: 7, moves: 9 },
      { name: "Gravitational Lens", w: 7, h: 7, moves: 9 },
      { name: "Point of No Return", w: 7, h: 7, moves: 9 },
      { name: "Cosmic Censorship", w: 7, h: 7, moves: 10 },
      { name: "Kerr Metric", w: 7, h: 7, moves: 10 },
      { name: "Chandra Limit", w: 7, h: 7, moves: 10 },
      { name: "Singular Horizon", w: 7, h: 7, moves: 10 }
    ]
  },
  {
    num: 14,
    phase: "Hypercube",
    levels: [
      { name: "Tesseract", w: 7, h: 7, moves: 8 },
      { name: "Fourth Dimension", w: 7, h: 7, moves: 8 },
      { name: "Orthogonal Fold", w: 7, h: 7, moves: 9 },
      { name: "Hyperplane", w: 8, h: 8, moves: 9 },
      { name: "Polytope", w: 8, h: 8, moves: 9 },
      { name: "Simplex Leap", w: 8, h: 8, moves: 10 },
      { name: "Rotational Splay", w: 8, h: 8, moves: 10 },
      { name: "Shadow Projection", w: 8, h: 8, moves: 10 },
      { name: "Hypervolume", w: 8, h: 8, moves: 11 },
      { name: "Dimensional Apex", w: 8, h: 8, moves: 11 }
    ]
  },
  {
    num: 15,
    phase: "Chrono Loop",
    levels: [
      { name: "Temporal Loop", w: 8, h: 8, moves: 8 },
      { name: "Closed Timelike Curve", w: 8, h: 8, moves: 9 },
      { name: "Retrocausality", w: 8, h: 8, moves: 9 },
      { name: "Causal Echo", w: 8, h: 8, moves: 9 },
      { name: "Grandfather Paradox", w: 8, h: 8, moves: 10 },
      { name: "Bootstrap Circuit", w: 8, h: 8, moves: 10 },
      { name: "Time Dilation", w: 8, h: 8, moves: 10 },
      { name: "Chronosphere", w: 8, h: 8, moves: 11 },
      { name: "Chrono Stasis", w: 8, h: 8, moves: 11 },
      { name: "Eternal Return", w: 8, h: 8, moves: 11 }
    ]
  },
  {
    num: 16,
    phase: "Stellar Corona",
    levels: [
      { name: "Corona Burst", w: 8, h: 8, moves: 9 },
      { name: "Solar Wind", w: 8, h: 8, moves: 9 },
      { name: "Photosphere", w: 8, h: 8, moves: 10 },
      { name: "Prominence Leap", w: 8, h: 8, moves: 10 },
      { name: "Magnetic Reconnection", w: 8, h: 8, moves: 10 },
      { name: "Chromosphere", w: 8, h: 8, moves: 11 },
      { name: "Heliosphere", w: 8, h: 8, moves: 11 },
      { name: "Coronal Mass Surge", w: 8, h: 8, moves: 11 },
      { name: "Solar Flare", w: 8, h: 8, moves: 12 },
      { name: "Stellar Zenith", w: 8, h: 8, moves: 12 }
    ]
  },
  {
    num: 17,
    phase: "Dark Matter",
    levels: [
      { name: "WIMP Halo", w: 8, h: 8, moves: 9 },
      { name: "Cold Dark Matter", w: 8, h: 8, moves: 10 },
      { name: "Gravitational Veil", w: 8, h: 8, moves: 10 },
      { name: "Baryon Acoustic Wave", w: 8, h: 8, moves: 10 },
      { name: "Axion Resonance", w: 8, h: 8, moves: 11 },
      { name: "Hidden Sector", w: 8, h: 8, moves: 11 },
      { name: "Filament Lattice", w: 8, h: 8, moves: 11 },
      { name: "Dark Velocity", w: 8, h: 8, moves: 12 },
      { name: "Galactic Web", w: 8, h: 8, moves: 12 },
      { name: "Cosmic Shadow", w: 8, h: 8, moves: 12 }
    ]
  },
  {
    num: 18,
    phase: "Supercluster",
    levels: [
      { name: "Laniakea", w: 8, h: 8, moves: 10 },
      { name: "Great Attractor", w: 8, h: 8, moves: 10 },
      { name: "Virgo Supercluster", w: 8, h: 8, moves: 11 },
      { name: "Cosmic Void", w: 8, h: 8, moves: 11 },
      { name: "Perseus-Pisces", w: 8, h: 8, moves: 11 },
      { name: "Shapley Concentration", w: 8, h: 8, moves: 12 },
      { name: "Galaxy Filament", w: 8, h: 8, moves: 12 },
      { name: "Deep Field Node", w: 8, h: 8, moves: 12 },
      { name: "Mega-Parsec Weave", w: 8, h: 8, moves: 13 },
      { name: "Cosmic Macrocosm", w: 8, h: 8, moves: 13 }
    ]
  },
  {
    num: 19,
    phase: "Void Nexus",
    levels: [
      { name: "Bootes Void", w: 8, h: 8, moves: 10 },
      { name: "Abyssal Gate", w: 8, h: 8, moves: 11 },
      { name: "Entropy Peak", w: 8, h: 8, moves: 11 },
      { name: "Cosmic Chasm", w: 8, h: 8, moves: 11 },
      { name: "Null Continuum", w: 8, h: 8, moves: 12 },
      { name: "Oblivion Vector", w: 8, h: 8, moves: 12 },
      { name: "Desolation Node", w: 8, h: 8, moves: 13 },
      { name: "Absolute Zero", w: 8, h: 8, moves: 13 },
      { name: "Terminal Vacuum", w: 8, h: 8, moves: 14 },
      { name: "Vacuum Metastability", w: 8, h: 8, moves: 14 }
    ]
  },
  {
    num: 20,
    phase: "Omniscience",
    levels: [
      { name: "Cosmic Mind", w: 8, h: 8, moves: 11 },
      { name: "First Principles", w: 8, h: 8, moves: 12 },
      { name: "Unified Field", w: 8, h: 8, moves: 12 },
      { name: "Quantum Gravity", w: 8, h: 8, moves: 12 },
      { name: "Omniscient Sight", w: 8, h: 8, moves: 13 },
      { name: "Ultimate Constant", w: 8, h: 8, moves: 13 },
      { name: "Monad", w: 8, h: 8, moves: 14 },
      { name: "The Final Theorem", w: 8, h: 8, moves: 14 },
      { name: "Singular Truth", w: 8, h: 8, moves: 14 },
      { name: "Omega Point", w: 8, h: 8, moves: 15 }
    ]
  }
];

function generateCandidate({ name, phase, w, h, targetMoves, seed }) {
  let attempt = 0;
  const maxAttempts = 1200;

  while (attempt < maxAttempts) {
    const rng = createRNG((seed + attempt * 7919) >>> 0);
    const grid = Array.from({ length: h }, () => Array(w).fill(0));

    // Select goal position (corner or inner edge)
    const goalPositions = [
      [0, 0], [0, w - 1], [h - 1, 0], [h - 1, w - 1],
      [1, 1], [1, w - 2], [h - 2, 1], [h - 2, w - 2]
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

    // If path reached at least targetMoves - 1
    if (path.length - 1 >= targetMoves - 1) {
      const start = path[path.length - 1];

      // Non-path cells set:
      const nonPathCoords = [];
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          if (!visited.has(`${r},${c}`)) nonPathCoords.push([r, c]);
        }
      }

      // Populate decoys: prefer jumps targeting other non-path cells to create rich trap networks
      for (const [r, c] of nonPathCoords) {
        if (r === goal[0] && c === goal[1]) {
          grid[r][c] = 0;
          continue;
        }

        // Find candidate jumps that land within board
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

  // Backup fallback: broaden search
  for (let fallback = 0; fallback < 2000; fallback++) {
    const rng = createRNG((seed + 99999 + fallback * 313) >>> 0);
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

    if (path.length - 1 >= 5) {
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          if (r === goal[0] && c === goal[1]) grid[r][c] = 0;
          else if (grid[r][c] === 0) grid[r][c] = 1 + Math.floor(rng() * (maxDim - 1));
        }
      }
      const candidate = { name, phase, w, h, start: path[path.length - 1], goal, grid, optimal: 0 };
      const res = solve(candidate);
      if (res.solvable && res.moves >= 6) {
        candidate.optimal = res.moves;
        return candidate;
      }
    }
  }

  throw new Error(`Failed to generate solvable level "${name}" (Target ${targetMoves} moves) within ${maxAttempts} attempts`);
}

console.log(`🚀 Generating 100 new campaign levels for Chapters 11–20...`);
const newLevels = [];
let baseSeed = 101001;

CHAPTER_SPECS.forEach((chap) => {
  console.log(`\n📦 Generating Chapter ${chap.num}: ${chap.phase} (10 levels)...`);
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

// Combine existing 100 levels with the 100 new levels
const totalLevels = [...LEVELS.slice(0, 100), ...newLevels];
console.log(`📊 Total campaign size: ${totalLevels.length} levels.`);

// Write back to src/data/levels.js
const fileHeader = `// Handcrafted & Algorithmic 200-Level Campaign Dataset\n// 20 Thematic Chapters, 10 Levels Each (3x3 to 8x8 Grids)\nexport const LEVELS = `;
const fileContent = fileHeader + JSON.stringify(totalLevels, null, 2) + ";\n";

const levelsPath = path.resolve("src/data/levels.js");
fs.writeFileSync(levelsPath, fileContent, "utf8");
console.log(`💾 Saved updated dataset to ${levelsPath}`);
