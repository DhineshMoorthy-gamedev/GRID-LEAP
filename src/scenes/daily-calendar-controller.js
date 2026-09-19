/**
 * Daily Challenge Calendar & Archive Controller
 * Handles month-by-month navigation, day tile rendering,
 * completion status indicators, and launch date (Sept 16, 2026) floor gating.
 */

import { SceneRouter } from "./scene-router.js";
import { DailyManager, LAUNCH_DATE_KEY } from "../state/daily-manager.js";
import { AudioEngine } from "../audio/audio-engine.js";
import { getTodayDateKey } from "../core/daily-seed.js";
import { SVG_ICONS } from "./game-renderer.js";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const DailyCalendarController = {
  dom: {},
  currentYear: 2026,
  currentMonth: 8, // 0-indexed: 8 = September
  onPlayDateCallback: null,

  init({ onPlayDate }) {
    this.onPlayDateCallback = onPlayDate;

    this.dom = {
      modal: document.getElementById("dailyCalendarModal"),
      closeBtn: document.getElementById("dailyCalendarCloseBtn"),
      prevMonthBtn: document.getElementById("dailyCalPrevBtn"),
      nextMonthBtn: document.getElementById("dailyCalNextBtn"),
      monthTitle: document.getElementById("dailyCalMonthTitle"),
      gridContainer: document.getElementById("dailyCalGrid"),
      statCompleted: document.getElementById("dailyCalStatCompleted"),
      statStreak: document.getElementById("dailyCalStatStreak"),
      statTotal: document.getElementById("dailyCalStatTotal")
    };

    // Set initial view to current month
    const today = new Date();
    this.currentYear = today.getUTCFullYear();
    this.currentMonth = today.getUTCMonth();

    // Event Listeners
    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.close();
      });
    }

    if (this.dom.modal) {
      this.dom.modal.addEventListener("click", (e) => {
        if (e.target === this.dom.modal) {
          AudioEngine.playNavBack();
          this.close();
        }
      });
    }

    if (this.dom.prevMonthBtn) {
      this.dom.prevMonthBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.changeMonth(-1);
      });
    }

    if (this.dom.nextMonthBtn) {
      this.dom.nextMonthBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.changeMonth(1);
      });
    }
  },

  open(year = null, month = null) {
    if (year !== null && month !== null) {
      this.currentYear = year;
      this.currentMonth = month;
    } else {
      const today = new Date();
      this.currentYear = today.getUTCFullYear();
      this.currentMonth = today.getUTCMonth();
    }

    this.render();
    SceneRouter.pushModal("DAILY_CALENDAR");
  },

  close() {
    SceneRouter.popModal();
  },

  changeMonth(delta) {
    let nextMonth = this.currentMonth + delta;
    let nextYear = this.currentYear;

    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    // Don't allow navigating prior to Launch Year/Month (Sept 2026)
    const [launchY, launchM] = LAUNCH_DATE_KEY.split("-").map(Number);
    if (nextYear < launchY || (nextYear === launchY && nextMonth < (launchM - 1))) {
      return;
    }

    // Don't allow navigating into future months beyond today's month
    const today = new Date();
    const todayY = today.getUTCFullYear();
    const todayM = today.getUTCMonth();
    if (nextYear > todayY || (nextYear === todayY && nextMonth > todayM)) {
      return;
    }

    this.currentYear = nextYear;
    this.currentMonth = nextMonth;
    this.render();
  },

  render() {
    const data = DailyManager.getMonthGridData(this.currentYear, this.currentMonth);
    const [launchY, launchM] = LAUNCH_DATE_KEY.split("-").map(Number);
    const today = new Date();
    const todayY = today.getUTCFullYear();
    const todayM = today.getUTCMonth();

    // 1. Month Title & Nav Buttons
    if (this.dom.monthTitle) {
      this.dom.monthTitle.textContent = `${MONTH_NAMES[this.currentMonth]} ${this.currentYear}`;
    }

    if (this.dom.prevMonthBtn) {
      const isAtLaunch = (this.currentYear === launchY && this.currentMonth === (launchM - 1));
      this.dom.prevMonthBtn.disabled = isAtLaunch;
      this.dom.prevMonthBtn.style.opacity = isAtLaunch ? "0.3" : "1";
    }

    if (this.dom.nextMonthBtn) {
      const isAtLatest = (this.currentYear === todayY && this.currentMonth === todayM);
      this.dom.nextMonthBtn.disabled = isAtLatest;
      this.dom.nextMonthBtn.style.opacity = isAtLatest ? "0.3" : "1";
    }

    // 2. Stats Strip
    if (this.dom.statCompleted) {
      this.dom.statCompleted.textContent = `${data.completedInMonth}/${data.availableInMonth}`;
    }
    if (this.dom.statStreak) {
      this.dom.statStreak.innerHTML = `${DailyManager.data.currentStreak} ${SVG_ICONS.flame}`;
    }
    if (this.dom.statTotal) {
      this.dom.statTotal.textContent = `${data.totalAllTimeCompleted}`;
    }

    // 3. Grid Generation
    if (!this.dom.gridContainer) return;
    this.dom.gridContainer.innerHTML = "";

    // Weekday headers
    WEEKDAY_NAMES.forEach(dayName => {
      const header = document.createElement("div");
      header.className = "cal-weekday-header";
      header.textContent = dayName;
      this.dom.gridContainer.appendChild(header);
    });

    // Empty offset slots before startWeekday
    for (let i = 0; i < data.startWeekday; i++) {
      const emptySlot = document.createElement("div");
      emptySlot.className = "cal-day-tile empty";
      this.dom.gridContainer.appendChild(emptySlot);
    }

    // Day Tiles
    data.days.forEach(day => {
      const tile = document.createElement("button");
      tile.className = "cal-day-tile";
      tile.dataset.date = day.dateKey;
      tile.tabIndex = 0;

      if (day.isBeforeLaunch) {
        tile.classList.add("before-launch");
        tile.innerHTML = `
          <span class="day-num">${day.dayNum}</span>
          <span class="day-unreleased-dash">—</span>
        `;
        tile.disabled = true;
      } else if (day.isFuture) {
        tile.classList.add("future");
        tile.innerHTML = `
          <span class="day-num">${day.dayNum}</span>
          <span class="day-lock-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
        `;
        tile.disabled = true;
      } else if (day.isCompleted) {
        tile.classList.add("completed");
        if (day.isToday) tile.classList.add("today");
        tile.innerHTML = `
          <span class="day-num">${day.dayNum}</span>
          <span class="day-check-circle" aria-label="Completed">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        `;
        tile.addEventListener("click", () => this.handleTileClick(day.dateKey));
      } else if (day.isToday) {
        tile.classList.add("today", "playable");
        tile.innerHTML = `
          <span class="day-num">${day.dayNum}</span>
          <span class="day-play-pill">TODAY</span>
        `;
        tile.addEventListener("click", () => this.handleTileClick(day.dateKey));
      } else {
        // Missed past day (Playable archive)
        tile.classList.add("playable", "past-archive");
        tile.innerHTML = `
          <span class="day-num">${day.dayNum}</span>
          <span class="day-play-icon">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
          </span>
        `;
        tile.addEventListener("click", () => this.handleTileClick(day.dateKey));
      }

      if (this.selectedDateKey === day.dateKey) {
        tile.classList.add("selected-focus");
      }

      this.dom.gridContainer.appendChild(tile);
    });
  },

  handleTileClick(dateKey) {
    AudioEngine.playNavBack();
    this.close();
    if (typeof this.onPlayDateCallback === "function") {
      this.onPlayDateCallback(dateKey);
    }
  },

  /**
   * Keyboard Arrow Navigation across Calendar Grid
   */
  navigateDay(deltaRow, deltaCol) {
    const tiles = Array.from(this.dom.gridContainer?.querySelectorAll("button.cal-day-tile") || []);
    if (tiles.length === 0) return;

    let currentIndex = tiles.findIndex(t => t.dataset.date === this.selectedDateKey);
    if (currentIndex === -1) {
      // Find today or first playable tile
      currentIndex = tiles.findIndex(t => t.classList.contains("today") || t.classList.contains("playable") || t.classList.contains("completed"));
      if (currentIndex === -1) currentIndex = 0;
    }

    const targetIndex = currentIndex + (deltaRow * 7) + deltaCol;

    if (targetIndex < 0) {
      // Navigate to previous month
      this.changeMonth(-1);
      const newTiles = Array.from(this.dom.gridContainer?.querySelectorAll("button.cal-day-tile") || []);
      if (newTiles.length > 0) {
        const dest = deltaRow < 0 ? Math.max(0, newTiles.length - 7 + (currentIndex % 7)) : newTiles.length - 1;
        this.selectTile(newTiles[dest]);
      }
      return;
    }

    if (targetIndex >= tiles.length) {
      // Navigate to next month
      this.changeMonth(1);
      const newTiles = Array.from(this.dom.gridContainer?.querySelectorAll("button.cal-day-tile") || []);
      if (newTiles.length > 0) {
        const dest = deltaRow > 0 ? Math.min(newTiles.length - 1, currentIndex % 7) : 0;
        this.selectTile(newTiles[dest]);
      }
      return;
    }

    this.selectTile(tiles[targetIndex]);
  },

  selectTile(tileEl) {
    if (!tileEl) return;
    const tiles = this.dom.gridContainer?.querySelectorAll("button.cal-day-tile") || [];
    tiles.forEach(t => t.classList.remove("selected-focus"));
    tileEl.classList.add("selected-focus");
    tileEl.focus();
    this.selectedDateKey = tileEl.dataset.date;
  },

  playSelectedDay() {
    if (!this.selectedDateKey) return;
    const tile = this.dom.gridContainer?.querySelector(`button.cal-day-tile[data-date="${this.selectedDateKey}"]`);
    if (tile && !tile.disabled) {
      tile.click();
    } else {
      AudioEngine.playBlocked?.();
    }
  }
};
