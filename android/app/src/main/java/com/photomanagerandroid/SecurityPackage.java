/**
 * Android原生安全模块包 - 企业级安全标准
 * 
 * 🔒 核心价值：注册Android原生安全模块到React Native
 * 
 * 这个包负责将企业级Android安全模块注册到RN桥接中
 */

package com.photomanagerandroid;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SecurityPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        
        // 注册Android原生安全模块
        modules.add(new SecurityModule(reactContext));
        
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
