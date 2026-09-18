/**
 * Grid Leap — Achievements Modal Controller
 * Renders achievement cards, progress metrics, category tabs, and unlocked badges.
 */

import { SceneRouter } from "./scene-router.js";
import { AchievementManager, ACHIEVEMENT_CATEGORIES } from "../state/achievement-manager.js";
import { GameState } from "../state/game-state.js";
import { AudioEngine } from "../audio/audio-engine.js";

export const AchievementsController = {
  dom: {},
  currentCategory: ACHIEVEMENT_CATEGORIES.ALL,

  init() {
    this.dom = {
      modal: document.getElementById("achievementsModal"),
      closeBtn: document.getElementById("achievementsCloseBtn"),
      statSummary: document.getElementById("achSummaryText"),
      heroSub: document.getElementById("achHeroSub"),
      heroRingFill: document.getElementById("achHeroRingFill"),
      tabsContainer: document.getElementById("achTabsContainer"),
      gridContainer: document.getElementById("achievementsGrid")
    };

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

    if (this.dom.tabsContainer) {
      this.dom.tabsContainer.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".ach-tab-btn");
        if (!tabBtn) return;
        const cat = tabBtn.dataset.category;
        if (cat) {
          AudioEngine.playNavBack();
          this.setCategory(cat);
        }
      });
    }
  },

  open() {
    AchievementManager.markAllAsViewed();
    this.render();
    SceneRouter.pushModal("ACHIEVEMENTS");
  },

  close() {
    SceneRouter.popModal();
  },

  setCategory(category) {
    this.currentCategory = category;
    this.render();
  },

  render() {
    const totalCompletedCampaign = (GameState.completed || []).filter(Boolean).length;
    const totalAllTimeDaily = (typeof window !== "undefined" && window.DailyManager) ? (window.DailyManager.getTotalCompletedCount?.() || 0) : 0;
    const dailyStreak = (typeof window !== "undefined" && window.DailyManager) ? (window.DailyManager.data?.currentStreak || 0) : 0;
    const todayKey = (typeof window !== "undefined" && window.DailyManager) ? (window.DailyManager.getTodayDateKey?.() || "") : "";
    const monthKey = todayKey.slice(0, 7);
    const dailyMonthCount = (typeof window !== "undefined" && window.DailyManager) ? (Object.keys(window.DailyManager.data?.history || {}).filter(k => k.startsWith(monthKey)).length) : 0;

    AchievementManager.syncExistingProgress(totalCompletedCampaign, dailyStreak, dailyMonthCount, totalAllTimeDaily);

    const stats = AchievementManager.getOverviewStats();
    const list = AchievementManager.getAchievementsList(
      this.currentCategory,
      totalCompletedCampaign,
      dailyStreak,
      dailyMonthCount,
      totalAllTimeDaily
    );

    // 1. Hero Showcase Progress & Stats
    if (this.dom.statSummary) {
      this.dom.statSummary.textContent = `${stats.unlockedCount} / ${stats.total} Unlocked`;
    }

    if (this.dom.heroSub) {
      this.dom.heroSub.textContent = `${stats.percent}% Completed`;
    }

    if (this.dom.heroRingFill) {
      this.dom.heroRingFill.setAttribute("stroke-dasharray", `${stats.percent}, 100`);
    }

    // 2. Category Tab Active State
    if (this.dom.tabsContainer) {
      const tabButtons = this.dom.tabsContainer.querySelectorAll(".ach-tab-btn");
      tabButtons.forEach(btn => {
        const isActive = btn.dataset.category === this.currentCategory;
        btn.classList.toggle("active", isActive);
      });
    }

    // 3. Grid / Rows Generation
    if (!this.dom.gridContainer) return;
    this.dom.gridContainer.innerHTML = "";

    list.forEach(item => {
      const row = document.createElement("div");
      row.className = `achievement-row ${item.isUnlocked ? "unlocked" : "locked"}`;

      row.innerHTML = `
        <div class="ach-emblem-disc ${item.isUnlocked ? "unlocked" : "locked"}">
          ${item.isUnlocked ? item.icon : `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          `}
        </div>
        <div class="ach-row-main">
          <div class="ach-row-title-bar">
            <h4 class="ach-row-title">${item.title}</h4>
            ${item.isUnlocked && item.unlockedDateStr ? `<span class="ach-row-date">${item.unlockedDateStr}</span>` : ''}
          </div>
          <p class="ach-row-desc">${item.description}</p>
        </div>
        <div class="ach-row-status">
          ${item.isUnlocked ? `
            <div class="ach-status-badge unlocked" title="Mastered">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          ` : `
            <div class="ach-status-badge locked">
              <span class="ach-badge-num">${item.progress}${item.unit || ""} / ${item.target}${item.unit || ""}</span>
            </div>
          `}
        </div>
      `;

      this.dom.gridContainer.appendChild(row);
    });
  }
};
