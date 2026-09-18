/**
 * Target Platform Configuration Provider
 * Controls build-time and runtime feature flags for Editor, Play Store, Itch.io, and Web.
 */

export const TARGET_MODES = {
  EDITOR: "editor",
  PLAYSTORE: "playstore",
  ITCH: "itch",
  WEB: "web"
};

const rawMode = (import.meta.env?.VITE_APP_TARGET || "editor").toLowerCase();
const activeMode = Object.values(TARGET_MODES).includes(rawMode) ? rawMode : TARGET_MODES.EDITOR;

export const TargetConfig = {
  mode: activeMode,
  title: import.meta.env?.VITE_APP_TITLE || "Grid Leap",
  version: "0.0.14",
  versionCode: 14,

  isEditor: activeMode === TARGET_MODES.EDITOR,
  isPlayStore: activeMode === TARGET_MODES.PLAYSTORE,
  isItch: activeMode === TARGET_MODES.ITCH,
  isWeb: activeMode === TARGET_MODES.WEB,

  features: {
    // Level Editor & creation suite
    levelEditor: activeMode === TARGET_MODES.EDITOR,
    // In-game Developer diagnostics HUD button
    devDiagnostics: activeMode === TARGET_MODES.EDITOR,
    // Native Capacitor plugins (Haptics, StatusBar, App)
    nativePlugins: activeMode === TARGET_MODES.PLAYSTORE,
    // Itch.io / Desktop fullscreen toggle
    fullscreenControl: activeMode === TARGET_MODES.ITCH || activeMode === TARGET_MODES.WEB,
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

