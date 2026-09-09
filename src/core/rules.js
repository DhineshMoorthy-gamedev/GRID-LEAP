/**
 * Exact-distance Movement Rules & Validation Logic
 */

export function calculateLegalDestinations(level, playerPos) {
  if (!playerPos || !level) return [];
  const [r, c] = playerPos;
  const val = level.grid[r][c];
  const options = [
    { dr: -val, dc: 0, dir: "up" },
    { dr: val, dc: 0, dir: "down" },
    { dr: 0, dc: -val, dir: "left" },
    { dr: 0, dc: val, dir: "right" },
  ];
  return options
    .map(o => ({ ...o, r: r + o.dr, c: c + o.dc }))
    .filter(o => o.r >= 0 && o.r < level.h && o.c >= 0 && o.c < level.w);
}

export function isGoalCell(level, playerPos) {
  if (!level || !playerPos) return false;
  return playerPos[0] === level.goal[0] && playerPos[1] === level.goal[1];
}

export function isDeadEndState(destinations, isGoal) {
  return destinations.length === 0 && !isGoal;
}
