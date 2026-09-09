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
  boardElement
}) {
  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
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

  // Touch swipe gestures
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  boardElement.addEventListener("touchstart", (e) => {
    if (SceneRouter.isInputBlocked()) return;
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  boardElement.addEventListener("touchend", (e) => {
    if (SceneRouter.isInputBlocked()) return;
    if (e.changedTouches.length === 0) return;
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
}
