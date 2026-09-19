/**
 * Target Platform Configuration Provider
 * Controls build-time and runtime feature flags for Editor, Play Store, Itch.io, and Web.
 */

export const TARGET_MODES = {
  EDITOR: "editor",
  PLAYSTORE: "playstore",
  ITCH: "itch",
  WEB: "web",
  DESKTOP: "desktop"
};

// Automatic detection for native Tauri Desktop runtime
const isTauriRuntime = typeof window !== "undefined" && Boolean(
  window.__TAURI_INTERNALS__ || window.__TAURI__ || window.__TAURI_METADATA__ || window.__TAURI_IPC__ || window.__TAURI_PATTERN__
);

const rawMode = (isTauriRuntime ? "desktop" : (import.meta.env?.VITE_APP_TARGET || "desktop")).toLowerCase();
const activeMode = Object.values(TARGET_MODES).includes(rawMode) ? rawMode : TARGET_MODES.DESKTOP;

export const TargetConfig = {
  mode: activeMode,
  title: import.meta.env?.VITE_APP_TITLE || "Grid Leap",
  version: "0.0.15",
  versionCode: 15,

  isEditor: activeMode === TARGET_MODES.EDITOR,
  isPlayStore: activeMode === TARGET_MODES.PLAYSTORE,
  isItch: activeMode === TARGET_MODES.ITCH,
  isWeb: activeMode === TARGET_MODES.WEB,
  isDesktop: activeMode === TARGET_MODES.DESKTOP,

  features: {
    // Level Editor & creation suite
    levelEditor: activeMode === TARGET_MODES.EDITOR,
    // In-game Developer diagnostics HUD button
    devDiagnostics: activeMode === TARGET_MODES.EDITOR,
    // Native Capacitor plugins (Haptics, StatusBar, App)
    nativePlugins: activeMode === TARGET_MODES.PLAYSTORE,
    // Itch.io / Desktop / Web fullscreen toggle
    fullscreenControl: activeMode === TARGET_MODES.ITCH || activeMode === TARGET_MODES.WEB || activeMode === TARGET_MODES.DESKTOP,
    // Keyboard hint pill on screen (disabled to keep clean minimalist gameplay UI)
    keyboardHints: false,
    // Web Share API
    socialShare: activeMode === TARGET_MODES.WEB,
    // Home Hub Dev topbar controls (Mode pill)
    homeDevControls: activeMode === TARGET_MODES.EDITOR,
    // Advanced Settings (Relax mode, trail toggle, dev mode, tutorial button)
    editorSettings: activeMode === TARGET_MODES.EDITOR,
    // Home Hub Level Selector & difficulty strip
    homeLevelSelector: activeMode === TARGET_MODES.EDITOR,
    // Gameplay screen Dev controls (Dev Stepper, Theme toggle, Breadcrumbs toggle, Diagnostics)
    gameDevControls: activeMode === TARGET_MODES.EDITOR,
    // Bottom banner ad slot room
    showAdBanner: activeMode === TARGET_MODES.PLAYSTORE || activeMode === TARGET_MODES.WEB,
    // In-App Purchases (Remove Ads) - Play Store only
    removeAdsIAP: activeMode === TARGET_MODES.PLAYSTORE,
    // Win Modal Social Share Button (All platforms by default, togglable)
    winShareButton: true
  }
};

