package com.olaidigitalstudios.gridleap;

import com.getcapacitor.BridgeActivity;

/**
 * Play Store Flavor Plugin Registrar
 * Registers Google Play Billing, Play Update, and AdMob plugins.
 */
public class PluginRegistrar {
    public static void register(BridgeActivity activity) {
        activity.registerPlugin(BillingPlugin.class);
        activity.registerPlugin(AppUpdatePlugin.class);
        activity.registerPlugin(AdMobPlugin.class);
    }
}
