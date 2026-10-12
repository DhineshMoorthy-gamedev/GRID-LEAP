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
  onShowExitConfirm,
  onShowLevelSelect,
  onNextLevel,
  onCloseRules,
  onHomePlay,
  onDailyPlay,
  onOpenAchievements,
  onOpenCalendar,
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
    } else if (TargetConfig.isDesktop) {
      setInputModality("keyboard");
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
    const isWinModalOpen = SceneRouter.isModalOpen("WIN");
    const isFinalModalOpen = SceneRouter.isModalOpen("FINAL");
    const isSettingsOpen = SceneRouter.isModalOpen("SETTINGS");
    const isTutorialOpen = SceneRouter.isModalOpen("RULES");
    const isPauseOpen = SceneRouter.isModalOpen("PAUSE");
    const isCalendarOpen = SceneRouter.isModalOpen("DAILY_CALENDAR");
    const isAchievementsOpen = SceneRouter.isModalOpen("ACHIEVEMENTS");
    const isLevelSelectOpen = SceneRouter.isModalOpen("LEVEL_SELECT");
    const isDevModalOpen = SceneRouter.isModalOpen("DEV");
    const isEditorJsonOpen = SceneRouter.isModalOpen("EDITOR_JSON");
    const isOutOfLivesOpen = SceneRouter.isModalOpen("OUT_OF_LIVES");
    const isUpdateOpen = SceneRouter.isModalOpen("UPDATE");
    const isRewardOpen = SceneRouter.isModalOpen("REWARD");
    const isNotifPromptOpen = SceneRouter.isModalOpen("NOTIF_PROMPT");
    const isShareOpen = SceneRouter.isModalOpen("SHARE");
    const isExitConfirmOpen = SceneRouter.isModalOpen("EXIT_CONFIRM");
    const hasAnyModal = SceneRouter.hasAnyModalOpen();

    // Handle Tab key focus trapping for active modal overlays
    if (e.key === "Tab") {
      const activeModalIds = [
        "settingsModal", "achievementsModal", "levelSelectModal", "dailyCalendarModal", "rulesModal",
        "winOverlay", "finalOverlay", "pauseModal", "outOfLivesModal",
        "updateModal", "rewardModal", "notificationPromptModal", "devModal", "editorJsonModal",
        "shareModal", "exitConfirmModal"
      ];
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
      if (isAchievementsOpen) {
        if (window.AchievementsController) window.AchievementsController.close();
        else SceneRouter.popModal();
        return;
      }
      if (isLevelSelectOpen) {
        if (window.LevelSelectController) window.LevelSelectController.close();
        else SceneRouter.popModal();
        return;
      }
      if (isCalendarOpen) {
        if (window.DailyCalendarController) window.DailyCalendarController.close();
        else SceneRouter.popModal();
        return;
      }
      if (isSettingsOpen) {
        if (window.SettingsController) window.SettingsController.back();
        else SceneRouter.popModal();
        return;
      }
      if (isTutorialOpen) {
        if (window.TutorialController) window.TutorialController.close();
        else SceneRouter.popModal();
        return;
      }
      if (isPauseOpen) {
        document.getElementById("resumeBtn")?.click();
        return;
      }
      if (isOutOfLivesOpen) {
        document.getElementById("outOfLivesRestartBtn")?.click();
        return;
      }
      if (isRewardOpen) {
        document.getElementById("rewardContinueBtn")?.click();
        return;
      }
      if (isDevModalOpen) {
        document.getElementById("closeDevBtn")?.click();
        return;
      }
      if (isEditorJsonOpen) {
        document.getElementById("closeEditorJsonBtn")?.click();
        return;
      }
      if (isUpdateOpen) {
        document.getElementById("updateModalCloseX")?.click() || document.getElementById("updateModalLaterBtn")?.click();
        return;
      }
      if (isNotifPromptOpen) {
        document.getElementById("notifPromptCloseX")?.click() || document.getElementById("notifPromptLaterBtn")?.click();
        return;
      }
      if (isShareOpen) {
        document.getElementById("shareModalCloseBtn")?.click();
        return;
      }
      if (isExitConfirmOpen) {
        document.getElementById("exitConfirmResumeBtn")?.click() || SceneRouter.popModal();
        return;
      }
      if (SceneRouter.popModal()) {
        return;
      }
      if (currentScreen === "screenGame") {
        if (onShowExitConfirm) {
          onShowExitConfirm();
        } else if (onShowLevelSelect) {
          onShowLevelSelect();
        }
        return;
      }
      if (currentScreen === "screenEditor") {
        if (onShowLevelSelect) onShowLevelSelect();
        return;
      }
      return;
    }

    // Modal Specific Hotkeys & Strict Modal Layer Isolation
    if (isAchievementsOpen) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.AchievementsController?.cycleCategory(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        window.AchievementsController?.cycleCategory(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        window.AchievementsController?.scrollList(-1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        window.AchievementsController?.scrollList(1);
        return;
      }
      if (e.key === "PageUp") {
        e.preventDefault();
        window.AchievementsController?.scrollList(-3);
        return;
      }
      if (e.key === "PageDown") {
        e.preventDefault();
        window.AchievementsController?.scrollList(3);
        return;
      }
      return;
    }

    if (isCalendarOpen) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.DailyCalendarController?.navigateDay(0, -1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        window.DailyCalendarController?.navigateDay(0, 1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        window.DailyCalendarController?.navigateDay(-1, 0);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        window.DailyCalendarController?.navigateDay(1, 0);
        return;
      }
      if (e.key === "[" || e.key === ",") {
        e.preventDefault();
        window.DailyCalendarController?.changeMonth(-1);
        return;
      }
      if (e.key === "]" || e.key === ".") {
        e.preventDefault();
        window.DailyCalendarController?.changeMonth(1);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.DailyCalendarController?.playSelectedDay();
        return;
      }
      return;
    }

    if (isSettingsOpen) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        window.SettingsController?.navigateFocus(-1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        window.SettingsController?.navigateFocus(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.SettingsController?.handleHorizontal(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        window.SettingsController?.handleHorizontal(1);
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
      const rulesModal = document.getElementById("rulesModal");
      const currentTutView = rulesModal?.dataset?.view || "welcome";
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (currentTutView === "welcome") {
          window.TutorialController?.startTutorialFromWelcome();
          return;
        } else if (currentTutView === "complete") {
          window.TutorialController?.dom?.completeHomeBtn?.click() || window.TutorialController?.dom?.completeCampaignBtn?.click();
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
      if (currentTutView === "game") {
        const keyMap = {
          ArrowUp: "up", w: "up", W: "up",
          ArrowDown: "down", s: "down", S: "down",
          ArrowLeft: "left", a: "left", A: "left",
          ArrowRight: "right", d: "right", D: "right"
        };
        const dir = keyMap[e.key];
        if (dir) {
          e.preventDefault();
          window.TutorialController?.attemptDirectionMove?.(dir);
          return;
        }
      }
      return;
    }

    // Win Modal action hotkeys
    if (isWinModalOpen) {
      if (e.key === "[" || e.key === "," || e.key === "ArrowLeft") {
        const prevBtn = document.getElementById("winDailyPrevBtn");
        if (prevBtn && prevBtn.offsetParent !== null && !prevBtn.disabled) {
          e.preventDefault();
          prevBtn.click();
          return;
        }
      }
      if (e.key === "]" || e.key === "." || e.key === "ArrowRight") {
        const nextBtn = document.getElementById("winDailyNextBtn");
        if (nextBtn && nextBtn.offsetParent !== null && !nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
          return;
        }
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onNextLevel) onNextLevel();
        return;
      }
      if (e.key === "s" || e.key === "S") {
        const shareBtn = document.getElementById("winShareBtn");
        if (shareBtn && shareBtn.offsetParent !== null) {
          e.preventDefault();
          shareBtn.click();
          return;
        }
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (onRestart) onRestart();
        return;
      }
      return;
    }

    // Pause Modal action hotkeys
    if (isPauseOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("resumeBtn")?.click();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        document.getElementById("pauseRestartBtn")?.click();
        return;
      }
      return;
    }

    // Out of Lives Modal
    if (isOutOfLivesOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "r" || e.key === "R") {
        e.preventDefault();
        document.getElementById("outOfLivesRestartBtn")?.click();
        return;
      }
      return;
    }

    // Reward Modal
    if (isRewardOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("rewardContinueBtn")?.click();
        return;
      }
      return;
    }

    // Update Modal
    if (isUpdateOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("updateModalActionBtn")?.click();
        return;
      }
      return;
    }

    // Notification Prompt Modal
    if (isNotifPromptOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("notifPromptEnableBtn")?.click();
        return;
      }
      return;
    }

    // Share Modal Hotkeys
    if (isShareOpen) {
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        document.getElementById("shareCopyTextBtn")?.click();
        return;
      }
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        document.getElementById("shareCopyImageBtn")?.click();
        return;
      }
      return;
    }

    // Global Modal Safety Guard: If ANY modal is visible, unconditionally block all background hotkeys
    if (hasAnyModal) {
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
      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (onOpenAchievements) {
          onOpenAchievements();
        } else if (window.AchievementsController) {
          window.AchievementsController.open();
        }
        return;
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        if (onOpenCalendar) {
          onOpenCalendar();
        } else if (window.DailyCalendarController) {
          window.DailyCalendarController.open();
        }
        return;
      }
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        if (onShowLevelSelect) {
          onShowLevelSelect();
        } else if (window.LevelSelectController) {
          window.LevelSelectController.open();
        }
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
