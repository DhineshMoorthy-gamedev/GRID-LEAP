/**
 * AdMob Unit IDs & Ad Configuration Provider.
 * Configured with Olai Digital Studios' production AdMob IDs and Google test IDs.
 */

const isProdAdMode = (import.meta.env?.VITE_AD_MODE || "production").toLowerCase() !== "test";

// Google official test IDs for safe debugging without policy strikes
const TEST_UNIT_IDS = {
  appId: "ca-app-pub-3940256099942544~3347511713",
  banner: "ca-app-pub-3940256099942544/6300978111",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
  interstitial: "ca-app-pub-3940256099942544/1033173712"
};

// Olai Digital Studios Production AdMob IDs (Grid Leap)
const PROD_UNIT_IDS = {
  appId: "ca-app-pub-4890313674539327~9594835240",
  banner: "ca-app-pub-4890313674539327/3352860524",
  rewarded: "ca-app-pub-4890313674539327/4091227126",
  interstitial: "ca-app-pub-4890313674539327/2179379650"
};

export const AD_UNIT_IDS = {
  appId: isProdAdMode
    ? (import.meta.env?.VITE_ADMOB_APP_ID || PROD_UNIT_IDS.appId)
    : TEST_UNIT_IDS.appId,

  banner: isProdAdMode
    ? (import.meta.env?.VITE_ADMOB_BANNER_ID || PROD_UNIT_IDS.banner)
    : TEST_UNIT_IDS.banner,

  rewarded: isProdAdMode
    ? (import.meta.env?.VITE_ADMOB_REWARDED_ID || PROD_UNIT_IDS.rewarded)
    : TEST_UNIT_IDS.rewarded,

  interstitial: isProdAdMode
    ? (import.meta.env?.VITE_ADMOB_INTERSTITIAL_ID || PROD_UNIT_IDS.interstitial)
    : TEST_UNIT_IDS.interstitial
};

export const AdConfig = {
  isProduction: isProdAdMode,
  units: AD_UNIT_IDS,
  testUnits: TEST_UNIT_IDS,
  prodUnits: PROD_UNIT_IDS
};
