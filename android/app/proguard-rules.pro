# Grid Leap ProGuard / R8 Rules

# 1. Keep JavascriptInterface and Capacitor Bridge classes
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.getcapacitor.** { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}
-keep @interface com.getcapacitor.annotation.CapacitorPlugin
-keep @interface com.getcapacitor.PluginMethod

# 2. Keep App-specific custom Capacitor Plugins
-keep class com.olaidigitalstudios.gridleap.** { *; }

# 3. Google Play Billing Client
-keep class com.android.billingclient.api.** { *; }
-dontwarn com.android.billingclient.**

# 4. Google Play In-App Updates (Play Core API)
-keep class com.google.android.play.core.appupdate.** { *; }
-keep class com.google.android.play.core.install.** { *; }
-keep class com.google.android.play.core.tasks.** { *; }
-dontwarn com.google.android.play.core.**

# 5. Google Mobile Ads (AdMob)
-keep public class com.google.android.gms.ads.** {
   public *;
}
-keep public class com.google.ads.** {
   public *;
}
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.**

# 6. Capacitor Local Notifications Plugin
-keep class com.capacitorjs.plugins.localnotifications.** { *; }
-dontwarn com.capacitorjs.plugins.localnotifications.**

# 7. Preserve Line Numbers and Annotations for stack traces
-keepattributes SourceFile,LineNumberTable,InnerClasses,EnclosingMethod,Signature,*Annotation*
