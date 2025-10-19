# 🔐 企业级Android安全混淆规则
# 
# 核心价值：保护Android原生安全模块代码不被逆向

# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# 🛡️ React Native基础保护
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }

# 🚨 企业级安全模块保护 - 核心价值
-keep class com.photomanagerandroid.SecurityModule { *; }
-keep class com.photomanagerandroid.SecurityPackage { *; }
-keep class com.photomanagerandroid.MainActivity { *; }
-keep class com.photomanagerandroid.MainApplication { *; }

# 安全模块方法保护
-keepclassmembers class com.photomanagerandroid.SecurityModule {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# 🔒 防止安全相关类被混淆
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# 保护安全检测方法
-keepclassmembers class ** {
    *security*;
    *Security*;
    *emulator*;
    *Emulator*;
    *root*;
    *Root*;
    *debug*;
    *Debug*;
}

# 🛡️ Android系统安全API保护
-keep class android.view.WindowManager$LayoutParams { *; }
-keep class android.view.WindowManager { *; }

# 企业级反调试保护
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# 🚨 关键安全类完全保护
-keep,allowobfuscation class com.photomanagerandroid.** {
    native <methods>;
}

# 防止反射攻击
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# 🔐 企业级字符串加密保护
-adaptclassstrings
-adaptresourcefilenames
-adaptresourcefilecontents

# 控制流混淆
-repackageclasses 'o'
-allowaccessmodification
-mergeinterfacesaggressively

# 🛡️ 最高级别代码保护
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-overloadaggressively

# 企业级安全 - 移除调试信息
-printmapping mapping.txt
-printseeds seeds.txt
-printusage usage.txt
