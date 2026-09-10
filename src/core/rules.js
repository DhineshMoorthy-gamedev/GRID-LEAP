/**
 * Exact-distance Movement Rules & Validation Logic
 */

export function calculateLegalDestinations(level, playerPos) {
  if (!playerPos || !level) return [];
  const [r, c] = playerPos;
  const val = level.grid[r][c];
  if (!val || val <= 0) return [];
  const options = [
    { dr: -val, dc: 0, dir: "up" },
    { dr: val, dc: 0, dir: "down" },
    { dr: 0, dc: -val, dir: "left" },
    { dr: 0, dc: val, dir: "right" },
  ];
  return options
    .map(o => ({ ...o, r: r + o.dr, c: c + o.dc }))
    .filter(o => {
      if (o.r < 0 || o.r >= level.h || o.c < 0 || o.c >= level.w) return false;
      const destVal = level.grid[o.r][o.c];
      const isGoal = isGoalCell(level, [o.r, o.c]);
      if (destVal === 0 && !isGoal) return false;
      return true;
    });
}

export function isGoalCell(level, playerPos) {
  if (!level || !playerPos) return false;
  return playerPos[0] === level.goal[0] && playerPos[1] === level.goal[1];
}

export function isDeadEndState(destinations, isGoal) {
  return destinations.length === 0 && !isGoal;
}
