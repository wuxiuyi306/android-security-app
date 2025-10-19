/**
 * Android主活动类 - 企业级安全标准
 * 
 * 🔒 核心价值：应用主入口，集成Android原生安全保护
 */

package com.photomanagerandroid;

import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

    private static final String TAG = "AndroidSecurityMain";

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PhotoManagerAndroid";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.i(TAG, "🔐 Android主活动启动 - 企业级安全模式");
        
        // 🛡️ 默认启用防截屏保护 - 企业级安全要求
        // 注意：这里设置默认保护，具体控制由SecurityModule管理
        enableDefaultSecurityProtection();
        
        Log.i(TAG, "✅ Android安全主活动初始化完成");
    }

    /**
     * 启用默认安全保护
     * 🔒 企业级安全要求：默认启用防截屏保护
     */
    private void enableDefaultSecurityProtection() {
        try {
            // 设置FLAG_SECURE防止截屏和录屏
            getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            );
            
            Log.i(TAG, "🛡️ Android默认防截屏保护已启用 (FLAG_SECURE)");
            
        } catch (Exception e) {
            Log.e(TAG, "❌ 启用默认安全保护失败: " + e.getMessage());
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "🔐 Android安全应用恢复运行");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "🔐 Android安全应用暂停运行");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "🔐 Android安全应用销毁");
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultReactActivityDelegate.isFabricEnabled(), // fabricEnabled
            // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
            DefaultReactActivityDelegate.isConcurrentRootEnabled() // concurrentRootEnabled
        );
    }

    /**
     * 自定义ReactActivityDelegate - 企业级安全增强
     */
    public static class DefaultReactActivityDelegate extends ReactActivityDelegate {
        
        private static final String TAG = "AndroidSecurityDelegate";

        public DefaultReactActivityDelegate(ReactActivity activity, String mainComponentName, boolean fabricEnabled, boolean concurrentRootEnabled) {
            super(activity, mainComponentName, fabricEnabled, concurrentRootEnabled);
        }

        @Override
        protected ReactRootView createRootView() {
            ReactRootView reactRootView = new ReactRootView(getContext());
            
            Log.i(TAG, "🔐 创建Android安全根视图");
            
            return reactRootView;
        }

        @Override
        protected boolean isConcurrentRootEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        public static boolean isFabricEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        public static boolean isConcurrentRootEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
    }
}
