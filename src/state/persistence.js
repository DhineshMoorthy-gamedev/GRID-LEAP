/**
 * Persistent Storage & Player Data Service
 */

const STORAGE_KEY = "number_grid_maze_save_v1";

export class StorageService {
  constructor(totalLevels = 10, key = STORAGE_KEY) {
    this.key = key;
    this.totalLevels = totalLevels;
    this.cachedData = null;
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) {
        this.cachedData = this.defaultState();
        return this.cachedData;
      }
      const parsed = JSON.parse(raw);
      this.cachedData = this.migrate(parsed);
      return this.cachedData;
    } catch (err) {
      console.warn("[Storage] Failed to read from storage, using defaults:", err);
      this.cachedData = this.defaultState();
      return this.cachedData;
    }
  }

  save(data) {
    try {
      this.cachedData = {
        ...this.cachedData,
        ...data,
        lastUpdated: Date.now()
      };
      localStorage.setItem(this.key, JSON.stringify(this.cachedData));
      return true;
    } catch (err) {
      console.warn("[Storage] Failed to save state:", err);
      return false;
    }
  }

  defaultState() {
    return {
      schemaVersion: 2,
      lastUpdated: Date.now(),
      lastPlayedLevel: 0,
      completed: new Array(this.totalLevels).fill(false),
      stars: new Array(this.totalLevels).fill(0),
      bestMoves: new Array(this.totalLevels).fill(null),
      settings: {
        hasSeenRules: false,
        devModeEnabled: false,
        soundEnabled: true,
        hapticsEnabled: true,
        relaxMode: false
      }
    };
  }

  migrate(data) {
    if (!data || typeof data !== "object") {
      return this.defaultState();
    }
    const completed = new Array(this.totalLevels).fill(false);
    if (Array.isArray(data.completed)) {
      data.completed.forEach((val, idx) => {
        if (idx < completed.length) completed[idx] = Boolean(val);
      });
    }

    const stars = new Array(this.totalLevels).fill(0);
    if (Array.isArray(data.stars)) {
      data.stars.forEach((val, idx) => {
        if (idx < stars.length) stars[idx] = Math.max(0, Math.min(3, parseInt(val, 10) || 0));
      });
    }

    const bestMoves = new Array(this.totalLevels).fill(null);
    if (Array.isArray(data.bestMoves)) {
      data.bestMoves.forEach((val, idx) => {
        if (idx < bestMoves.length && typeof val === "number" && val > 0) bestMoves[idx] = val;
      });
    }

    return {
      schemaVersion: 2,
      lastUpdated: data.lastUpdated || Date.now(),
      lastPlayedLevel: typeof data.lastPlayedLevel === "number" ? data.lastPlayedLevel : 0,
      completed,
      stars,
      bestMoves,
      settings: {
        hasSeenRules: Boolean(data.settings?.hasSeenRules),
        devModeEnabled: Boolean(data.settings?.devModeEnabled),
        soundEnabled: data.settings?.soundEnabled !== false,
        hapticsEnabled: data.settings?.hapticsEnabled !== false,
        relaxMode: Boolean(data.settings?.relaxMode)
      }
    };
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
      this.cachedData = this.defaultState();
    } catch (err) {
      console.warn("[Storage] Failed to clear storage:", err);
    }
  }
}
