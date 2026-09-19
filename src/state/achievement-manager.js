/**
 * Grid Leap — Local In-Game Achievement System Engine
 * 100% Client-Side, Privacy-First, Zero-Login, Offline Persistence.
 */

import { AudioEngine } from "../audio/audio-engine.js";
import { PlatformBridge } from "../platform/lifecycle.js";
import { formatDisplayDate } from "../core/daily-seed.js";

export const ACHIEVEMENT_CATEGORIES = {
  ALL: "all",
  CAMPAIGN: "campaign",
  MASTERY: "mastery",
  DAILY: "daily",
  STRATEGY: "strategy",
  TIME: "time"
};

export const ACHIEVEMENT_DEFINITIONS = [
  // ==========================================
  // Category A: Campaign Progression
  // ==========================================
  {
    id: "first_leap",
    category: ACHIEVEMENT_CATEGORIES.CAMPAIGN,
    title: "First Leap",
    description: "Complete your very first puzzle (Level 01)",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    target: 1
  },
  {
    id: "chapter_origins",
    category: ACHIEVEMENT_CATEGORIES.CAMPAIGN,
    title: "Origins Master",
    description: "Conquer the entire opening chapter (Levels 1–10)",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    target: 10
  },
  {
    id: "level_25_clear",
    category: ACHIEVEMENT_CATEGORIES.CAMPAIGN,
    title: "Wayfinder",
    description: "Conquer 25 campaign levels across the grid",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
    target: 25
  },
  {
    id: "level_50_clear",
    category: ACHIEVEMENT_CATEGORIES.CAMPAIGN,
    title: "Halfway Legend",
    description: "Conquer 50 campaign levels across the grid",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10"/></svg>`,
    target: 50
  },
  {
    id: "campaign_complete",
    category: ACHIEVEMENT_CATEGORIES.CAMPAIGN,
    title: "Grid Grandmaster",
    description: "Complete all 100 levels in the campaign",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.45 1-1 1H7 M14 14.66V17c0 .55.45 1 1 1h2 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
    target: 100
  },

  // ==========================================
  // Category B: Mastery & Efficiency
  // ==========================================
  {
    id: "flawless_run",
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    title: "Flawless Path",
    description: "Clear any level beyond Chapter 1 (Level 11+) with 3 hearts & 0 dead ends",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    target: 1
  },
  {
    id: "optimal_10",
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    title: "Precision Master",
    description: "Solve 10 levels in exact optimal moves",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    target: 10
  },
  {
    id: "optimal_25",
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    title: "Grand Tactician",
    description: "Solve 25 levels in exact optimal moves",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    target: 25
  },
  {
    id: "long_distance",
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    title: "Master of Distance",
    description: "Solve any level requiring 6+ steps in exact optimal moves",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    target: 1
  },
  {
    id: "clutch_solve",
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    title: "On the Edge",
    description: "Complete a level with only 1 green heart (life) remaining",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    target: 1
  },

  // ==========================================
  // Category C: Daily Challenge & Calendar Archive
  // ==========================================
  {
    id: "daily_initiate",
    category: ACHIEVEMENT_CATEGORIES.DAILY,
    title: "Daily Ritual",
    description: "Complete your first Daily Challenge",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    target: 1
  },
  {
    id: "streak_3",
    category: ACHIEVEMENT_CATEGORIES.DAILY,
    title: "Sparks Flying",
    description: "Build a 3-day Daily Challenge streak",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`,
    target: 3
  },
  {
    id: "streak_7",
    category: ACHIEVEMENT_CATEGORIES.DAILY,
    title: "Unstoppable Flame",
    description: "Maintain a 7-day Daily Challenge streak",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2c1.5 3 3 5 4 7 2 4 1 8-2 11-1 1-3 2-5 2s-4-1-5-2c-3-3-4-7-2-11 1-2 2.5-4 4-7 1.5 2 2.5 4 3 6 .5-2 1.5-4 3-6z"/></svg>`,
    target: 7
  },
  {
    id: "time_traveler",
    category: ACHIEVEMENT_CATEGORIES.DAILY,
    title: "Time Traveler",
    description: "Solve any past archive puzzle in the Puzzle Calendar",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/></svg>`,
    target: 1
  },
  {
    id: "month_collector",
    category: ACHIEVEMENT_CATEGORIES.DAILY,
    title: "Month Collector",
    description: "Complete 15 daily challenges in a single calendar month",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>`,
    target: 15
  },

  // ==========================================
  // Category D: Strategy & Exploration
  // ==========================================
  {
    id: "tactical_undo",
    category: ACHIEVEMENT_CATEGORIES.STRATEGY,
    title: "Rethink & Rewind",
    description: "Use Undo 10 times cumulatively to recalculate paths",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
    target: 10
  },
  {
    id: "guiding_light",
    category: ACHIEVEMENT_CATEGORIES.STRATEGY,
    title: "Guiding Light",
    description: "Use Compass Hint (💡) to illuminate the next step",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 5.5V17h8v-2.5c1.5-1 3-3 3-5.5a7 7 0 0 0-7-7z"/></svg>`,
    target: 1
  },
  {
    id: "tenacious",
    category: ACHIEVEMENT_CATEGORIES.STRATEGY,
    title: "Never Give Up",
    description: "Hit a dead-end, restart the level, and solve it",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
    target: 1
  },
  {
    id: "grid_scholar",
    category: ACHIEVEMENT_CATEGORIES.STRATEGY,
    title: "Grid Scholar",
    description: "Complete all lessons in the interactive tutorial",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    target: 1
  },
  {
    id: "personal_best",
    category: ACHIEVEMENT_CATEGORIES.STRATEGY,
    title: "Self Improver",
    description: "Replay a cleared level and solve it in fewer moves",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    target: 1
  },

  // ==========================================
  // Category E: Time Spent & Dedication
  // ==========================================
  {
    id: "time_5_min",
    category: ACHIEVEMENT_CATEGORIES.TIME,
    title: "Warm-Up Leap",
    description: "Spend 5 minutes exploring and solving puzzles",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    target: 5,
    unit: "m"
  },
  {
    id: "time_15_min",
    category: ACHIEVEMENT_CATEGORIES.TIME,
    title: "Deep Focus",
    description: "Spend 15 minutes immersed in the grid",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
    target: 15,
    unit: "m"
  },
  {
    id: "time_30_min",
    category: ACHIEVEMENT_CATEGORIES.TIME,
    title: "Flow State",
    description: "Accumulate 30 minutes of active puzzle solving",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    target: 30,
    unit: "m"
  },
  {
    id: "time_60_min",
    category: ACHIEVEMENT_CATEGORIES.TIME,
    title: "Hourglass Master",
    description: "Spend 1 full hour (60 minutes) mastering the numbers",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>`,
    target: 60,
    unit: "m"
  },
  {
    id: "time_120_min",
    category: ACHIEVEMENT_CATEGORIES.TIME,
    title: "Timeless Explorer",
    description: "Accumulate 2 hours (120 minutes) immersed in Grid Leap",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><circle cx="12" cy="12" r="9"/></svg>`,
    target: 120,
    unit: "m"
  }
];

const STORAGE_KEY = "grid_leap_achievements_v1";

class LocalAchievementManager {
  constructor() {
    this.data = {
      unlocked: {},          // { [id]: { unlocked: true, unlockedAt: timestamp } }
      stats: {
        totalUndos: 0,
        optimalCount: 0,
        hintUsed: false,
        restartedAfterDeadEnd: false,
        tutorialCompleted: false,
        totalPlayTimeSeconds: 0
      },
      viewed: {}             // { [id]: boolean }
    };

    this.bannerQueue = [];
    this.isBannerShowing = false;
    this.bannerTimeout = null;
    this.onUnlockListeners = [];
    this.playTimeTimer = null;
    this.lastTickTime = null;
    this.unsavedSeconds = 0;
  }

  init() {
    this.load();
    this.ensureToastContainer();
  }

  load() {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = {
          unlocked: parsed.unlocked || {},
          stats: {
            totalUndos: parsed.stats?.totalUndos || 0,
            optimalCount: parsed.stats?.optimalCount || 0,
            hintUsed: Boolean(parsed.stats?.hintUsed),
            restartedAfterDeadEnd: Boolean(parsed.stats?.restartedAfterDeadEnd),
            tutorialCompleted: Boolean(parsed.stats?.tutorialCompleted),
            totalPlayTimeSeconds: Number(parsed.stats?.totalPlayTimeSeconds) || 0
          },
          viewed: parsed.viewed || {}
        };
      }
    } catch (e) {
      console.warn("[AchievementManager] Load error:", e);
    }
  }

  startPlayTimeTicker() {
    if (this.playTimeTimer) return;
    this.lastTickTime = Date.now();
    this.unsavedSeconds = 0;

    this.playTimeTimer = setInterval(() => {
      const now = Date.now();
      const deltaSec = Math.min(5, Math.max(1, Math.round((now - (this.lastTickTime || now)) / 1000)));
      this.lastTickTime = now;
      this.tickPlayTime(deltaSec);
    }, 1000);
  }

  stopPlayTimeTicker() {
    if (this.playTimeTimer) {
      clearInterval(this.playTimeTimer);
      this.playTimeTimer = null;
    }
    if (this.unsavedSeconds > 0) {
      this.save();
      this.unsavedSeconds = 0;
    }
  }

  tickPlayTime(deltaSec = 1) {
    if (!this.data.stats.totalPlayTimeSeconds) this.data.stats.totalPlayTimeSeconds = 0;
    this.data.stats.totalPlayTimeSeconds += deltaSec;
    this.unsavedSeconds = (this.unsavedSeconds || 0) + deltaSec;

    const totalMinutes = Math.floor(this.data.stats.totalPlayTimeSeconds / 60);

    // Check time-based milestones
    if (totalMinutes >= 5) this.unlock("time_5_min");
    if (totalMinutes >= 15) this.unlock("time_15_min");
    if (totalMinutes >= 30) this.unlock("time_30_min");
    if (totalMinutes >= 60) this.unlock("time_60_min");
    if (totalMinutes >= 120) this.unlock("time_120_min");

    // Throttled persistence every 20 seconds
    if (this.unsavedSeconds >= 20) {
      this.save();
      this.unsavedSeconds = 0;
    }
  }

  save() {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("[AchievementManager] Save error:", e);
    }
  }

  ensureToastContainer() {
    if (typeof document === "undefined") return null;
    let container = document.getElementById("achievementToastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "achievementToastContainer";
      container.className = "achievement-toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  isUnlocked(id) {
    return Boolean(this.data.unlocked[id]?.unlocked);
  }

  unlock(id, silent = false) {
    if (this.isUnlocked(id)) return false;

    const def = ACHIEVEMENT_DEFINITIONS.find(a => a.id === id);
    if (!def) return false;

    this.data.unlocked[id] = {
      unlocked: true,
      unlockedAt: Date.now()
    };
    this.data.viewed[id] = silent ? true : false;
    this.save();

    if (!silent) {
      // Trigger Right-Sliding Toast Notification & Effects
      this.showToast(def);
      AudioEngine.playAchievementUnlocked();
      PlatformBridge.vibrateSuccess?.();

      // Notify UI listeners
      this.onUnlockListeners.forEach(fn => {
        try { fn(def); } catch (_) {}
      });

      this.updateHomeBadge();
    }
    return true;
  }

  syncExistingProgress(completedCampaignCount = 0, dailyStreak = 0, dailyMonthCount = 0, totalAllTimeDaily = 0) {
    if (completedCampaignCount >= 1) this.unlock("first_leap", true);
    if (completedCampaignCount >= 10) this.unlock("chapter_origins", true);
    if (completedCampaignCount >= 25) this.unlock("level_25_clear", true);
    if (completedCampaignCount >= 50) this.unlock("level_50_clear", true);
    if (completedCampaignCount >= 100) this.unlock("campaign_complete", true);

    if (totalAllTimeDaily >= 1) this.unlock("daily_initiate", true);
    if (dailyStreak >= 3) this.unlock("streak_3", true);
    if (dailyStreak >= 7) this.unlock("streak_7", true);
    if (dailyMonthCount >= 15) this.unlock("month_collector", true);
  }

  showToast(def) {
    if (typeof document === "undefined") return;
    const container = this.ensureToastContainer();
    if (!container) return;

    // Dismiss oldest toast if more than 3 are actively showing
    const activeToasts = container.querySelectorAll(".ach-toast-card:not(.hide)");
    if (activeToasts.length >= 3) {
      const oldest = activeToasts[0];
      oldest.classList.add("hide");
      oldest.classList.remove("show");
      setTimeout(() => {
        if (oldest.isConnected) oldest.remove();
      }, 350);
    }

    const toast = document.createElement("div");
    toast.className = "ach-toast-card";
    toast.innerHTML = `
      <div class="ach-toast-icon">
        ${def.icon}
      </div>
      <div class="ach-toast-body">
        <span class="ach-toast-eyebrow">ACHIEVEMENT UNLOCKED</span>
        <h4 class="ach-toast-title">${def.title}</h4>
        <p class="ach-toast-desc">${def.description}</p>
      </div>
    `;

    this.attachSwipeDismiss(toast);
    container.appendChild(toast);

    // Trigger smooth CSS slide-in from right
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add("show");
      });
    });

    // Auto-dismiss after 4.2 seconds
    setTimeout(() => {
      if (toast.isConnected && !toast.classList.contains("hide")) {
        toast.classList.add("hide");
        toast.classList.remove("show");
        setTimeout(() => {
          if (toast.isConnected) toast.remove();
        }, 350);
      }
    }, 4200);
  }

  attachSwipeDismiss(toast) {
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
        currentX = startX;
        isSwiping = true;
        toast.style.transition = "none";
      }
    };

    const onTouchMove = (e) => {
      if (!isSwiping || !e.touches || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX;
      const dx = currentX - startX;
      if (dx > 0) {
        toast.style.transform = `translateX(${dx}px)`;
        toast.style.opacity = `${Math.max(0, 1 - dx / 220)}`;
      }
    };

    const onTouchEnd = () => {
      if (!isSwiping) return;
      isSwiping = false;
      const dx = currentX - startX;
      toast.style.transition = "transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 200ms ease";
      if (dx > 45) {
        toast.classList.add("hide");
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";
        setTimeout(() => {
          if (toast.isConnected) toast.remove();
        }, 280);
      } else {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
      }
    };

    toast.addEventListener("touchstart", onTouchStart, { passive: true });
    toast.addEventListener("touchmove", onTouchMove, { passive: true });
    toast.addEventListener("touchend", onTouchEnd, { passive: true });

    // Mouse drag support for desktop testing
    let isMouseDown = false;
    const onMouseDown = (e) => {
      isMouseDown = true;
      startX = e.clientX;
      currentX = startX;
      toast.style.transition = "none";
      toast.style.cursor = "grabbing";
    };

    const onMouseMove = (e) => {
      if (!isMouseDown) return;
      currentX = e.clientX;
      const dx = currentX - startX;
      if (dx > 0) {
        toast.style.transform = `translateX(${dx}px)`;
        toast.style.opacity = `${Math.max(0, 1 - dx / 220)}`;
      }
    };

    const onMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      toast.style.cursor = "grab";
      const dx = currentX - startX;
      toast.style.transition = "transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 200ms ease";
      if (dx > 45) {
        toast.classList.add("hide");
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";
        setTimeout(() => {
          if (toast.isConnected) toast.remove();
        }, 280);
      } else {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
      }
    };

    toast.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  updateHomeBadge() {
    const badge = document.getElementById("achievementsBadgeDot");
    if (badge) {
      const unviewedCount = this.getUnviewedCount();
      badge.style.display = unviewedCount > 0 ? "block" : "none";
    }
  }

  getUnviewedCount() {
    return Object.keys(this.data.unlocked).filter(id => !this.data.viewed[id]).length;
  }

  markAllAsViewed() {
    Object.keys(this.data.unlocked).forEach(id => {
      this.data.viewed[id] = true;
    });
    this.save();
    this.updateHomeBadge();
  }

  /**
   * Evaluates achievement triggers on game events
   */
  check(eventType, payload = {}) {
    switch (eventType) {
      // ----------------------------------------------------
      // 1. Campaign Level Completed
      // ----------------------------------------------------
      case "LEVEL_COMPLETED": {
        const {
          levelIndex,
          completedCount,
          moveCount,
          optimal,
          livesRemaining,
          deadEndsEncountered,
          isNewBest,
          isImprovedReplay,
          hadDeadEndBeforeRestart
        } = payload;

        // Level 1 clear (Index 0)
        if (levelIndex >= 0) {
          this.unlock("first_leap");
        }

        // Chapter 1 Origins clear (Levels 1-10, index 9 completed)
        if (levelIndex >= 9 || completedCount >= 10) {
          this.unlock("chapter_origins");
        }

        // 25 levels clear
        if (completedCount >= 25) {
          this.unlock("level_25_clear");
        }

        // 50 levels clear
        if (completedCount >= 50) {
          this.unlock("level_50_clear");
        }

        // 100 levels clear (All 100 campaign levels)
        if (completedCount >= 100) {
          this.unlock("campaign_complete");
        }

        // Flawless Path: Beyond Chapter 1 (Level 11+ / index >= 10), 3 full lives, 0 dead ends
        if (levelIndex >= 10 && livesRemaining >= 3 && deadEndsEncountered === 0) {
          this.unlock("flawless_run");
        }

        // On the edge: 1 heart remaining
        if (livesRemaining === 1) {
          this.unlock("clutch_solve");
        }

        // Exact optimal move solve
        if (moveCount <= optimal) {
          this.data.stats.optimalCount = (this.data.stats.optimalCount || 0) + 1;
          this.save();

          if (this.data.stats.optimalCount >= 10) {
            this.unlock("optimal_10");
          }
          if (this.data.stats.optimalCount >= 25) {
            this.unlock("optimal_25");
          }

          // 6+ step board in exact optimal
          if (optimal >= 6) {
            this.unlock("long_distance");
          }
        }

        // Tenacious: solved after restarting from a dead end
        if (hadDeadEndBeforeRestart) {
          this.unlock("tenacious");
        }

        // Self improver: beat previous best moves when replaying an already-cleared level
        if (isImprovedReplay) {
          this.unlock("personal_best");
        }
        break;
      }

      // ----------------------------------------------------
      // 2. Daily Challenge Completed
      // ----------------------------------------------------
      case "DAILY_COMPLETED": {
        const { isPastArchive, streak, monthCount } = payload;

        // Daily Initiate
        this.unlock("daily_initiate");

        // Time traveler: past archive date
        if (isPastArchive) {
          this.unlock("time_traveler");
        }

        // Streaks
        if (streak >= 3) {
          this.unlock("streak_3");
        }
        if (streak >= 7) {
          this.unlock("streak_7");
        }

        // 15 daily solves in a calendar month
        if (monthCount >= 15) {
          this.unlock("month_collector");
        }
        break;
      }

      // ----------------------------------------------------
      // 3. Undo Used
      // ----------------------------------------------------
      case "UNDO_USED": {
        this.data.stats.totalUndos = (this.data.stats.totalUndos || 0) + 1;
        this.save();
        if (this.data.stats.totalUndos >= 10) {
          this.unlock("tactical_undo");
        }
        break;
      }

      // ----------------------------------------------------
      // 4. Compass Hint Used
      // ----------------------------------------------------
      case "HINT_USED": {
        this.data.stats.hintUsed = true;
        this.save();
        this.unlock("guiding_light");
        break;
      }

      // ----------------------------------------------------
      // 5. Interactive Tutorial Completed
      // ----------------------------------------------------
      case "TUTORIAL_COMPLETED": {
        this.data.stats.tutorialCompleted = true;
        this.save();
        this.unlock("grid_scholar");
        break;
      }

      default:
        break;
    }
  }

  reset() {
    this.stopPlayTimeTicker();
    this.data = {
      unlocked: {},
      stats: {
        totalUndos: 0,
        optimalCount: 0,
        hintUsed: false,
        restartedAfterDeadEnd: false,
        tutorialCompleted: false,
        totalPlayTimeSeconds: 0
      },
      viewed: {}
    };
    this.save();
    this.updateHomeBadge();
  }

  /**
   * Retrieves list of all achievements with active progress, status, and formatted timestamps
   */
  getAchievementsList(category = ACHIEVEMENT_CATEGORIES.ALL, totalCompletedCampaign = 0, dailyStreak = 0, dailyMonthCount = 0, totalAllTimeDaily = 0) {
    return ACHIEVEMENT_DEFINITIONS.filter(def => {
      if (category === ACHIEVEMENT_CATEGORIES.ALL) return true;
      return def.category === category;
    }).map(def => {
      const unlockedInfo = this.data.unlocked[def.id];
      const isUnlocked = Boolean(unlockedInfo?.unlocked);
      let progress = isUnlocked ? def.target : 0;

      // Progressive calculations
      if (!isUnlocked) {
        if (def.id === "first_leap") {
          progress = Math.min(totalCompletedCampaign, 1);
        } else if (def.id === "chapter_origins" || def.id === "level_25_clear" || def.id === "level_50_clear" || def.id === "campaign_complete") {
          progress = Math.min(totalCompletedCampaign, def.target);
        } else if (def.id === "daily_initiate") {
          progress = Math.min(totalAllTimeDaily, 1);
        } else if (def.id === "streak_3" || def.id === "streak_7") {
          progress = Math.min(dailyStreak, def.target);
        } else if (def.id === "month_collector") {
          progress = Math.min(dailyMonthCount, def.target);
        } else if (def.id === "optimal_10" || def.id === "optimal_25") {
          progress = Math.min(this.data.stats.optimalCount || 0, def.target);
        } else if (def.id === "tactical_undo") {
          progress = Math.min(this.data.stats.totalUndos || 0, def.target);
        } else if (def.id === "guiding_light") {
          progress = this.data.stats.hintUsed ? 1 : 0;
        } else if (def.id === "grid_scholar") {
          progress = this.data.stats.tutorialCompleted ? 1 : 0;
        } else if (def.id === "tenacious") {
          progress = this.data.stats.restartedAfterDeadEnd ? 1 : 0;
        } else if (def.id.startsWith("time_")) {
          const totalMinutes = Math.floor((this.data.stats.totalPlayTimeSeconds || 0) / 60);
          progress = Math.min(totalMinutes, def.target);
        } else {
          progress = 0;
        }
      }

      const unlockedDateStr = isUnlocked && unlockedInfo.unlockedAt
        ? new Date(unlockedInfo.unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

      return {
        ...def,
        isUnlocked,
        progress,
        unlockedDateStr
      };
    });
  }

  getOverviewStats() {
    const total = ACHIEVEMENT_DEFINITIONS.length;
    const unlockedCount = Object.keys(this.data.unlocked).filter(id => this.data.unlocked[id]?.unlocked).length;
    const percent = Math.round((unlockedCount / total) * 100);
    const unviewedCount = this.getUnviewedCount();

    return {
      total,
      unlockedCount,
      percent,
      unviewedCount
    };
  }

  onUnlock(listener) {
    if (typeof listener === "function") {
      this.onUnlockListeners.push(listener);
    }
  }
}

export const AchievementManager = new LocalAchievementManager();
