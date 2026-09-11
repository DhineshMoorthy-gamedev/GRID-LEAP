import { generateDailyLevel } from "../src/core/daily-generator.js";
import { solve } from "../src/core/solver.js";

/**
 * Solvability Verification Suite for Daily Challenges
 * Tests 1,095 consecutive days (3 full years) to prove 100% solvability.
 */
console.log("🔍 Running Daily Challenge Solvability Suite (3 Years / 1,095 Seeds)...");

const totalDays = 365 * 3;
const startDate = new Date("2026-01-01T00:00:00Z");
let passed = 0;
let minMoves = Infinity;
let maxMoves = 0;
const diffDistribution = { EASY: 0, MEDIUM: 0, HARD: 0, EXPERT: 0, MASTER: 0 };

for (let i = 0; i < totalDays; i++) {
  const d = new Date(startDate.getTime() + i * 86400000);
  const dateKey = d.toISOString().slice(0, 10);
  const level = generateDailyLevel(dateKey);
  const res = solve(level);

  if (!res.solvable || res.moves < 4) {
    console.error(`❌ FAILED: Date ${dateKey} produced an unsolvable or trivial level!`, res);
    process.exit(1);
  }

  passed++;
  if (res.moves < minMoves) minMoves = res.moves;
  if (res.moves > maxMoves) maxMoves = res.moves;

  const tier = res.difficulty?.tier || "MEDIUM";
  diffDistribution[tier] = (diffDistribution[tier] || 0) + 1;
}

console.log(`✅ ALL ${passed} / ${totalDays} SEEDS ARE 100% SOLVABLE!`);
console.log(`📊 Optimal Moves Range: ${minMoves} to ${maxMoves} moves`);
console.log(`📊 Difficulty Distribution:`, diffDistribution);
