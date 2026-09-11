/**
 * Input Routing and Gesture Handlers
 */

import { SceneRouter } from "./scene-router.js";

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
  boardElement,
  swipeContainer,
  onStepForward,
  onStepBackward,
  onToggleAutoPlay,
  onToggleTheme,
  onToggleTrail
}) {
  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    // Stepper hotkeys in dev/editor: [, ], ,, ., Space
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
      return;
    }

    if (e.key === "t" || e.key === "T" || e.key === "b" || e.key === "B") {
      if (onToggleTrail) {
        e.preventDefault();
        onToggleTrail();
        return;
      }
    }

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
    if (e.key === " ") {
      if (onToggleAutoPlay) {
        e.preventDefault();
        onToggleAutoPlay();
        return;
      }
    }

    if (e.key === "d" || e.key === "D" || e.key === "`") {
      e.preventDefault();
      onToggleDev();
      return;
    }

    if (e.key === "Escape") {
      if (SceneRouter.popModal()) {
        e.preventDefault();
        return;
      }
      onShowPause();
      return;
    }

    // Gated: Ignore board controls if a modal is open
    if (SceneRouter.isInputBlocked()) return;

    const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();

    onMoveDirection(dir);
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
