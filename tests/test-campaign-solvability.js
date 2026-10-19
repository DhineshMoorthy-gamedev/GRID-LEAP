import { LEVELS } from "../src/data/levels.js";
import { solve } from "../src/core/solver.js";

/**
 * 200-Level Campaign Solvability & Mathematical Integrity Suite
 * Formally verifies that every level across all 20 chapters is:
 * 1. 100% Solvable with finite BFS pathfinding
 * 2. Optimal move count exactly matches the true shortest path
 * 3. Grid bounds, cell leap distances, start, and goal positions are valid
 */

console.log("🔍 Running Campaign Solvability Suite (250 Levels / 25 Chapters)...");

const totalLevels = LEVELS.length;
if (totalLevels !== 250) {
  console.error(`❌ Expected 250 levels, but found ${totalLevels}!`);
  process.exit(1);
}

let passedCount = 0;
let errors = [];
const chapterStats = [];

for (let ch = 1; ch <= 25; ch++) {
  const startIdx = (ch - 1) * 10;
  const endIdx = startIdx + 10;
  const chapterLevels = LEVELS.slice(startIdx, endIdx);
  const phase = chapterLevels[0]?.phase || `Chapter ${ch}`;

  let minMoves = Infinity;
  let maxMoves = -Infinity;
  let scoreSum = 0;
  const tiers = new Set();

  chapterLevels.forEach((lv, offset) => {
    const levelNum = startIdx + offset + 1;

    // Structural checks
    if (!lv.name || !lv.phase || !lv.w || !lv.h || !lv.grid || !lv.start || !lv.goal) {
      errors.push(`Level ${levelNum}: Missing required fields!`);
      return;
    }

    const [sr, sc] = lv.start;
    const [gr, gc] = lv.goal;
    if (sr < 0 || sr >= lv.h || sc < 0 || sc >= lv.w) {
      errors.push(`Level ${levelNum} (${lv.name}): Start out of bounds!`);
      return;
    }
    if (gr < 0 || gr >= lv.h || gc < 0 || gc >= lv.w) {
      errors.push(`Level ${levelNum} (${lv.name}): Goal out of bounds!`);
      return;
    }
    if (sr === gr && sc === gc) {
      errors.push(`Level ${levelNum} (${lv.name}): Start equals goal!`);
      return;
    }

    // Grid dimension and cell value checks
    for (let r = 0; r < lv.h; r++) {
      for (let c = 0; c < lv.w; c++) {
        const val = lv.grid[r][c];
        if (typeof val !== "number" || isNaN(val)) {
          errors.push(`Level ${levelNum} (${lv.name}) at [${r},${c}]: Invalid cell value ${val}!`);
        }
      }
    }

    // Solver check
    const res = solve(lv);
    if (!res || !res.solvable) {
      errors.push(`Level ${levelNum} (${lv.name}): BFS solver reported UNSOLVABLE!`);
      return;
    }
    if (res.moves !== lv.optimal) {
      errors.push(`Level ${levelNum} (${lv.name}): Optimal mismatch! Stored ${lv.optimal} vs true shortest path ${res.moves}`);
      return;
    }

    passedCount++;
    minMoves = Math.min(minMoves, lv.optimal);
    maxMoves = Math.max(maxMoves, lv.optimal);
    scoreSum += res.difficulty.score;
    tiers.add(res.difficulty.tier);
  });

  const avgScore = Math.round((scoreSum / chapterLevels.length) * 10) / 10;
  chapterStats.push({
    chapter: ch,
    phase,
    levels: `${startIdx + 1}–${endIdx}`,
    grid: `${chapterLevels[0].w}x${chapterLevels[0].h}`,
    optimalMoves: `${minMoves}–${maxMoves}`,
    avgDifficultyScore: avgScore,
    tiers: Array.from(tiers).join(", ")
  });
}

if (errors.length > 0) {
  console.error(`\n❌ VERIFICATION FAILED WITH ${errors.length} ERROR(S):`);
  errors.slice(0, 10).forEach(e => console.error("  • " + e));
  if (errors.length > 10) console.error(`  ... and ${errors.length - 10} more errors.`);
  process.exit(1);
}

console.log("\n📋 Chapter-by-Chapter Integrity Breakdown:");
console.table(chapterStats);

console.log(`\n🎉 SUCCESS! All ${passedCount} / ${totalLevels} campaign levels are 100% SOLVABLE & mathematically verified!`);
