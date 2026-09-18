/**
 * Deterministic PRNG & Daily Seed Derivation
 * Ensures every player generates the identical puzzle on a given calendar day.
 */

/**
 * FNV-1a 32-bit string hash
 */
export function hashStringToSeed(str, salt = "GRID_LEAP_DAILY_V1") {
  let h = 2166136261 >>> 0;
  const combined = str + salt;
  for (let i = 0; i < combined.length; i++) {
    h ^= combined.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 32-bit PRNG
 * Returns a function producing pseudo-random numbers in [0, 1)
 */
export function createRNG(seed) {
  let s = seed >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Get current UTC date key formatted as YYYY-MM-DD
 */
export function getTodayDateKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Formats a Date object or UTC date string into a user-friendly display (e.g. "Sep 11")
 */
export function formatDisplayDate(dateKey) {
  try {
    const parts = dateKey.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(Date.UTC(year, month, day));
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    }
  } catch (_) {}
  return dateKey;
}

/**
 * Derives the previous calendar day's date key (YYYY-MM-DD)
 */
export function getPreviousDateKey(dateKey) {
  try {
    const parts = dateKey.split("-").map(Number);
    const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] - 1));
    return d.toISOString().slice(0, 10);
  } catch (_) {
    return dateKey;
  }
}

/**
 * Derives the next calendar day's date key (YYYY-MM-DD)
 */
export function getNextDateKey(dateKey) {
  try {
    const parts = dateKey.split("-").map(Number);
    const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + 1));
    return d.toISOString().slice(0, 10);
  } catch (_) {
    return dateKey;
  }
}
