/**
 * 图片管理系统 - Android主应用入口
 * 
 * 🔒 企业级安全移动应用 - Android平台
 * 
 * 核心价值：Android原生安全模块是项目的生命线，绝对不可丢失！
 * 优先级：Android平台优先开发，完整的原生安全模块
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, Platform, View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { store } from './src/store';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PhotoViewScreen from './src/screens/PhotoViewScreen';
import UserManageScreen from './src/screens/UserManageScreen';
import SecurityManager, { SECURITY_EVENTS } from './src/security';

const Stack = createStackNavigator();

/**
 * Android安全初始化加载组件
 * 在Android原生安全模块初始化完成前显示加载界面
 */
function AndroidSecurityLoadingScreen() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#1a1a1a' 
    }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <View style={{ alignItems: 'center', paddingHorizontal: 40 }}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={{ 
          marginTop: 30, 
          fontSize: 18, 
          color: '#00ff00',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          🔐 正在初始化Android原生安全模块...
        </Text>
        <Text style={{ 
          marginTop: 15, 
          fontSize: 14, 
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 20
        }}>
          • 启用防截屏保护 (FLAG_SECURE){'\n'}
          • 检测模拟器和Root设备{'\n'}
          • 验证应用完整性{'\n'}
          • 初始化设备安全检测
        </Text>
        <Text style={{ 
          marginTop: 20, 
          fontSize: 12, 
          color: '#888',
          textAlign: 'center'
        }}>
          企业级安全标准 • Android原生模块 • 绝不妥协
        </Text>
      </View>
    </View>
  );
}

/**
 * Android安全错误屏幕
 * 当Android原生安全模块不可用时显示
 */
function AndroidSecurityErrorScreen({ error, onRetry }) {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#2d1b1b',
      paddingHorizontal: 30
    }}>
      <StatusBar barStyle="light-content" backgroundColor="#2d1b1b" />
      <Text style={{ 
        fontSize: 24, 
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold'
      }}>
        🚨 Android安全模块错误
      </Text>
      <Text style={{ 
        fontSize: 16, 
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30
      }}>
        Android原生安全模块不可用，这是致命错误！{'\n\n'}
        应用无法在没有安全保护的情况下运行。{'\n\n'}
        错误信息：{error}
      </Text>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Text 
          style={{ 
            backgroundColor: '#ff4444', 
            color: '#ffffff', 
            paddingHorizontal: 20, 
            paddingVertical: 10,
            borderRadius: 5,
            fontSize: 16,
            fontWeight: 'bold'
          }}
          onPress={() => require('react-native').BackHandler.exitApp()}
        >
          退出应用
        </Text>
        <Text 
          style={{ 
            backgroundColor: '#444444', 
            color: '#ffffff', 
            paddingHorizontal: 20, 
            paddingVertical: 10,
            borderRadius: 5,
            fontSize: 16
          }}
          onPress={onRetry}
        >
          重试
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  const [securityInitialized, setSecurityInitialized] = useState(false);
  const [securityError, setSecurityError] = useState(null);
  const [initializationResult, setInitializationResult] = useState(null);

  const initSecurity = async () => {
    try {
      console.log('🔐 开始初始化Android原生安全模块...');
      
      // 确保在Android平台
      if (Platform.OS !== 'android') {
        throw new Error('此应用仅支持Android平台');
      }
      
      // 调用Android安全管理器初始化
      const result = await SecurityManager.initialize();
      
      setInitializationResult(result);
      
      if (result.success) {
        console.log('✅ Android安全模块初始化成功:', result);
        
        // 记录安全事件
        SecurityManager.logSecurityEvent(SECURITY_EVENTS.INITIALIZATION_SUCCESS, {
          platform: 'android',
          deviceInfo: result.deviceInfo,
          protectionEnabled: result.protectionEnabled,
          nativeModuleAvailable: true
        });
        
        setSecurityInitialized(true);
        setSecurityError(null);
        
        // 显示初始化成功信息
        if (result.protectionEnabled) {
          console.log('🛡️ Android防截屏保护已启用 (FLAG_SECURE)');
        }
        
        // 显示设备安全信息
        if (result.deviceInfo) {
          console.log('📱 设备安全信息:', {
            manufacturer: result.deviceInfo.manufacturer,
            model: result.deviceInfo.model,
            isEmulator: result.deviceInfo.isEmulator,
            isRooted: result.deviceInfo.isRooted,
            isDebuggable: result.deviceInfo.isDebuggable
          });
        }
        
      } else {
        console.error('❌ Android安全模块初始化失败:', result.error);
        setSecurityError(result.error);
        
        // 记录失败事件
        SecurityManager.logSecurityEvent(SECURITY_EVENTS.INITIALIZATION_FAILED, {
          platform: 'android',
          error: result.error
        });
        
        // Android原生模块不可用是致命错误
        if (result.error && result.error.includes('原生安全模块')) {
          console.error('🚨 致命错误：Android原生安全模块不可用');
          return; // 不设置securityInitialized，保持在错误状态
        }
      }
      
    } catch (error) {
      console.error('❌ Android安全模块初始化异常:', error);
      setSecurityError(error.message);
      
      SecurityManager.logSecurityEvent(SECURITY_EVENTS.INITIALIZATION_FAILED, {
        platform: 'android',
        error: error.message,
        type: 'exception'
      });
    }
  };

  useEffect(() => {
    // 🔒 企业级Android安全模块初始化 - 应用启动的第一步
    initSecurity();
  }, []);

  // 🚨 安全检查：如果有致命错误，显示错误屏幕
  if (securityError && !securityInitialized) {
    return (
      <AndroidSecurityErrorScreen 
        error={securityError} 
        onRetry={() => {
          setSecurityError(null);
          initSecurity();
        }}
      />
    );
  }

  // 🔒 安全检查：只有在Android安全模块初始化完成后才显示应用界面
  if (!securityInitialized) {
    return <AndroidSecurityLoadingScreen />;
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6200ee',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                headerShown: false,
                // 🔒 传递Android安全状态给登录页面
                initialParams: { 
                  securityInitialized: true,
                  securityResult: initializationResult,
                  platform: 'android'
                }
              }}
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ 
                title: '🔐 安全图片管理 (Android)',
                headerLeft: null, // 禁用返回按钮
                headerRight: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 12, marginRight: 5 }}>
                      {SecurityManager.isScreenshotProtectionEnabled() ? '🛡️' : '⚠️'}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      Android
                    </Text>
                  </View>
                )
              }}
            />
            <Stack.Screen 
              name="PhotoView" 
              component={PhotoViewScreen}
              options={{ 
                title: '🛡️ 安全查看图片',
                // 🔒 确保查看图片时Android防截屏保护已启用
                headerRight: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 12, marginRight: 5 }}>
                      {SecurityManager.isScreenshotProtectionEnabled() ? '🛡️ FLAG_SECURE' : '⚠️ 未保护'}
                    </Text>
                  </View>
                )
              }}
            />
            <Stack.Screen 
              name="UserManage" 
              component={UserManageScreen}
              options={{ 
                title: '👥 用户管理',
                headerRight: () => (
                  <Text style={{ color: '#fff', fontSize: 10, marginRight: 15 }}>
                    Android企业级
                  </Text>
                )
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
