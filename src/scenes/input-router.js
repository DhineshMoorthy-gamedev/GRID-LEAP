/**
 * Input Routing, Gesture Handlers, and Modality Detection
 */

import { SceneRouter } from "./scene-router.js";
import { TargetConfig } from "../platform/target-config.js";

// Helper to set active input modality on document body
function setInputModality(modality) {
  if (typeof document !== "undefined" && document.body) {
    document.body.dataset.inputModality = modality;
  }
}

export function setupInputRouter({
  onMoveDirection,
  onUndo,
  onRestart,
  onToggleDev,
  onToggleSolution,
  onShowPause,
  onShowLevelSelect,
  onNextLevel,
  onCloseRules,
  onHomePlay,
  onDailyPlay,
  onOpenSettings,
  onOpenHelp,
  boardElement,
  swipeContainer,
  onStepForward,
  onStepBackward,
  onToggleAutoPlay,
  onToggleTheme,
  onToggleTrail,
  onToggleFullscreen
}) {
  // Initialize input modality based on target mode & device capabilities
  if (typeof window !== "undefined") {
    if (TargetConfig.isPlayStore) {
      setInputModality("touch");
    } else {
      const isTouch = "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const hasFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setInputModality(hasFinePointer && !isTouch ? "keyboard" : (isTouch ? "touch" : "keyboard"));
    }

    window.addEventListener("touchstart", () => setInputModality("touch"), { passive: true });
  }

  // Keyboard navigation & hotkeys
  window.addEventListener("keydown", (e) => {
    // Switch modality to keyboard upon key press on non-playstore targets
    if (!TargetConfig.isPlayStore) {
      setInputModality("keyboard");
    }

    // Allow Enter key to toggle focused checkboxes (Sound, Haptics, etc.)
    if (e.target && e.target.tagName === "INPUT" && e.target.type === "checkbox" && e.key === "Enter") {
      e.preventDefault();
      e.target.click();
      return;
    }

    // Don't intercept typing in text inputs or textareas
    if (e.target && (e.target.tagName === "TEXTAREA" || (e.target.tagName === "INPUT" && e.target.type !== "checkbox") || e.target.isContentEditable)) {
      return;
    }

    const currentScreen = SceneRouter.getCurrentScreen();
    const isWinModalOpen = SceneRouter.isModalOpen("WIN") || document.getElementById("winOverlay")?.classList.contains("show");
    const isFinalModalOpen = SceneRouter.isModalOpen("FINAL") || document.getElementById("finalOverlay")?.classList.contains("show");
    const isSettingsOpen = SceneRouter.isModalOpen("SETTINGS") || document.getElementById("settingsModal")?.classList.contains("show");
    const isTutorialOpen = SceneRouter.isModalOpen("RULES") || document.getElementById("rulesModal")?.classList.contains("show");
    const isPauseOpen = SceneRouter.isModalOpen("PAUSE") || document.getElementById("pauseModal")?.classList.contains("show");

    const isCalendarOpen = SceneRouter.isModalOpen("DAILY_CALENDAR") || document.getElementById("dailyCalendarModal")?.classList.contains("show");
    const isAchievementsOpen = SceneRouter.isModalOpen("ACHIEVEMENTS") || document.getElementById("achievementsModal")?.classList.contains("show");

    // Handle Tab key focus trapping for active modal overlays
    if (e.key === "Tab") {
      const activeModalIds = ["settingsModal", "achievementsModal", "dailyCalendarModal", "rulesModal", "winOverlay", "finalOverlay", "pauseModal", "outOfLivesModal", "updateModal", "rewardModal", "notificationPromptModal", "devModal"];
      let activeModalEl = null;
      for (const id of activeModalIds) {
        const el = document.getElementById(id);
        if (el && (el.classList.contains("show") || el.classList.contains("active"))) {
          activeModalEl = el;
          break;
        }
      }

      if (activeModalEl) {
        const focusable = activeModalEl.querySelectorAll(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
        );
        const visibleFocusable = Array.from(focusable).filter(el => {
          return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
        });

        if (visibleFocusable.length > 0) {
          const first = visibleFocusable[0];
          const last = visibleFocusable[visibleFocusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first || !activeModalEl.contains(document.activeElement)) {
              e.preventDefault();
              last.focus();
              return;
            }
          } else {
            if (document.activeElement === last || !activeModalEl.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
              return;
            }
          }
        } else {
          e.preventDefault();
          return;
        }
      }
    }

    // Handle Escape across all screens & modals
    if (e.key === "Escape") {
      e.preventDefault();
      if (isFinalModalOpen) {
        document.getElementById("finalHomeBtn")?.click();
        return;
      }
      if (isWinModalOpen) {
        const homeBtn = document.getElementById("winHomeBtn");
        if (homeBtn && homeBtn.style.display !== "none") {
          homeBtn.click();
        } else {
          document.getElementById("winNextBtn")?.click();
        }
        return;
      }
      if (isAchievementsOpen && window.AchievementsController) {
        window.AchievementsController.close();
        return;
      }
      if (isCalendarOpen && window.DailyCalendarController) {
        window.DailyCalendarController.close();
        return;
      }
      if (isSettingsOpen && window.SettingsController) {
        window.SettingsController.back();
        return;
      }
      if (isTutorialOpen && window.TutorialController) {
        window.TutorialController.close();
        return;
      }
      if (SceneRouter.popModal()) {
        return;
      }
      if (currentScreen === "screenGame") {
        if (onShowLevelSelect) onShowLevelSelect();
        return;
      }
      return;
    }

    // Campaign Complete (Grand Mastery) Modal Hotkeys
    if (isFinalModalOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("finalHomeBtn")?.click();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        document.getElementById("finalRestartBtn")?.click();
        return;
      }
      return;
    }

    // Tutorial Modal Hotkeys & Isolation
    if (isTutorialOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const rulesModal = document.getElementById("rulesModal");
        const currentTutView = rulesModal?.dataset?.view || "welcome";
        if (currentTutView === "welcome") {
          window.TutorialController?.startTutorialFromWelcome();
          return;
        } else if (currentTutView === "complete") {
          window.TutorialController?.dom?.completeCampaignBtn?.click();
          return;
        } else if (currentTutView === "game") {
          if (window.TutorialController?.isStageSolved) {
            window.TutorialController?.handleActionClick();
            return;
          }
        }
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        window.TutorialController?.resetCurrentStage();
        return;
      }
      // CRITICAL: Block all other hotkeys (like Home/Game shortcuts) from running while tutorial is open
      return;
    }

    // Settings Modal Open -> Block background hotkeys
    if (isSettingsOpen) {
      return;
    }

    // Win Modal action hotkeys
    if (isWinModalOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onNextLevel) onNextLevel();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (onRestart) onRestart();
        return;
      }
      return;
    }

    // Any unhandled modal (e.g. Pause, Out of lives) consumes hotkeys
    if (isPauseOpen || isWinModalOpen || isFinalModalOpen || isSettingsOpen || isTutorialOpen) {
      return;
    }

    // Home Hub Hotkeys
    if (currentScreen === "screenHome") {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (onHomePlay) onHomePlay();
        return;
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (onDailyPlay) onDailyPlay();
        return;
      }
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (onOpenSettings) onOpenSettings();
        return;
      }
      if (e.key === "?" || e.key === "/") {
        e.preventDefault();
        if (onOpenHelp) onOpenHelp();
        return;
      }
      if (e.key === "`" && TargetConfig.features.devDiagnostics) {
        e.preventDefault();
        if (onToggleDev) onToggleDev();
        return;
      }
      return;
    }

    // Gameplay Screen Hotkeys
    if (currentScreen === "screenGame") {
      // Undo
      if (e.key === "z" || e.key === "Z" || e.key === "u" || e.key === "U") {
        e.preventDefault();
        if (onUndo) onUndo();
        return;
      }

      // Restart
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (onRestart) onRestart();
        return;
      }

      // Hint / Solution Path
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        if (onToggleSolution) onToggleSolution();
        return;
      }

      // Breadcrumb Trail Toggle
      if (e.key === "t" || e.key === "T" || e.key === "b" || e.key === "B") {
        if (onToggleTrail) {
          e.preventDefault();
          onToggleTrail();
          return;
        }
      }

      // Fullscreen Toggle
      if (e.key === "f" || e.key === "F") {
        if (onToggleFullscreen) {
          e.preventDefault();
          onToggleFullscreen();
          return;
        }
      }

      // Dev Stepper Hotkeys (Editor & Dev Mode)
      if (e.key === "[" || e.key === ",") {
        if (onStepBackward) {
          e.preventDefault();
          onStepBackward();
          return;
        }
      }
      if (e.key === "]" || e.key === ".") {
        if (onStepForward) {
          e.preventDefault();
          onStepForward();
          return;
        }
      }
      if (e.key === " " && TargetConfig.features.devDiagnostics) {
        if (onToggleAutoPlay) {
          e.preventDefault();
          onToggleAutoPlay();
          return;
        }
      }
      if ((e.key === "d" || e.key === "D" || e.key === "`") && TargetConfig.features.devDiagnostics) {
        e.preventDefault();
        if (onToggleDev) onToggleDev();
        return;
      }

      // Gated: Ignore board directional moves if another modal is blocking input
      if (SceneRouter.isInputBlocked()) return;

      // WASD + Arrow Keys Navigation
      const keyMap = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right"
      };

      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        onMoveDirection(dir);
        return;
      }
    }
  });

  // Touch swipe gestures across whole gameplay screen
  const primaryTarget = swipeContainer || (typeof document !== "undefined" ? document.getElementById("screenGame") : null) || boardElement;
  const targets = [];
  if (primaryTarget) targets.push(primaryTarget);
  if (boardElement && !targets.includes(boardElement)) {
    if (!primaryTarget || (typeof primaryTarget.contains === "function" && !primaryTarget.contains(boardElement))) {
      targets.push(boardElement);
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTrackingSwipe = false;

  targets.forEach((targetEl) => {
    targetEl.addEventListener("touchstart", (e) => {
      if (SceneRouter.isInputBlocked()) return;
      if (!e.touches || e.touches.length !== 1) {
        isTrackingSwipe = false;
        return;
      }

      // Ignore touches starting on interactive buttons, form controls, navigation bars, or modals
      if (e.target && typeof e.target.closest === "function") {
        const interactive = e.target.closest(
          "button, a, input, select, textarea, [role='button'], .game-topbar, .game-tool-bar, .dev-playtest-bar, .ad-banner-slot, .ad-slot, .overlay, .modal"
        );
        if (interactive) {
          isTrackingSwipe = false;
          return;
        }
      }

      isTrackingSwipe = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    targetEl.addEventListener("touchmove", (e) => {
      if (!isTrackingSwipe) return;
      if (e.touches && e.touches.length > 1) {
        isTrackingSwipe = false;
      }
    }, { passive: true });

    targetEl.addEventListener("touchend", (e) => {
      if (!isTrackingSwipe || SceneRouter.isInputBlocked()) {
        isTrackingSwipe = false;
        return;
      }
      isTrackingSwipe = false;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      const dt = Date.now() - touchStartTime;

      const minSwipeDistance = 30;
      const maxSwipeDuration = 500;

      if (dt <= maxSwipeDuration && Math.max(Math.abs(dx), Math.abs(dy)) >= minSwipeDistance) {
        let dir = null;
        if (Math.abs(dx) > Math.abs(dy)) {
          dir = dx > 0 ? "right" : "left";
        } else {
          dir = dy > 0 ? "down" : "up";
        }

        if (dir) {
          onMoveDirection(dir);
        }
      }
    }, { passive: true });

    targetEl.addEventListener("touchcancel", () => {
      isTrackingSwipe = false;
    }, { passive: true });
  });
}
