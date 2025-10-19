/**
 * Android安全模块实现 - 企业级安全标准
 * 
 * 🔒 核心价值：Android原生安全模块是项目的生命线！
 * 
 * 这个模块封装了Android原生安全功能，确保企业级安全防护
 * 所有安全功能都依赖于Android原生代码实现，绝对不可替代
 */

import { NativeModules, Platform, Alert, BackHandler } from 'react-native';
import { 
  SecurityInterface, 
  SECURITY_EVENTS, 
  SECURITY_LEVELS,
  ANDROID_VIOLATION_SEVERITY,
  ANDROID_SECURITY_CHECKS
} from './SecurityInterface';

const { SecurityModule } = NativeModules;

/**
 * Android安全模块实现类
 * 继承SecurityInterface，实现Android平台的企业级安全功能
 */
export class AndroidSecurity extends SecurityInterface {
  constructor() {
    super();
    this.isProtectionEnabled = false;
    this.deviceInfo = null;
    this.securityLevel = SECURITY_LEVELS.ENTERPRISE; // 企业级默认最高安全级别
    this.violationCount = 0;
    this.maxViolations = 1; // 企业级零容忍政策
    this.initializationTime = null;
    this.lastSecurityCheck = null;
  }

  /**
   * 初始化Android安全模块
   * 🚨 重要：必须确保Android原生SecurityModule可用
   */
  async initialize() {
    try {
      this.initializationTime = new Date().toISOString();
      
      // 检查Android平台
      if (Platform.OS !== 'android') {
        throw new Error('AndroidSecurity只能在Android平台使用');
      }

      // 🔒 核心检查：确保Android原生安全模块可用
      if (!SecurityModule) {
        const error = 'Android原生安全模块不可用 - 这是致命错误！原生SecurityModule未找到';
        this.logSecurityEvent(SECURITY_EVENTS.INITIALIZATION_FAILED, { 
          error,
          reason: 'Native SecurityModule not available',
          platform: 'android',
          fatal: true
        });
        throw new Error(error);
      }

      console.log('🔐 初始化Android原生安全模块...');

      // 获取Android设备安全信息
      this.deviceInfo = await SecurityModule.getDeviceSecurityInfo();
      
      console.log('📱 Android设备安全信息:', {
        manufacturer: this.deviceInfo.manufacturer,
        model: this.deviceInfo.model,
        brand: this.deviceInfo.brand,
        sdkInt: this.deviceInfo.sdkInt,
        isDebuggable: this.deviceInfo.isDebuggable
      });

      // 执行企业级Android安全检查
      const securityChecks = await this.performSecurityChecks();
      
      // 启用Android防截屏保护（核心功能）
      const protectionEnabled = await this.enableScreenshotProtection();

      this.logSecurityEvent(SECURITY_EVENTS.INITIALIZATION_SUCCESS, {
        deviceInfo: this.deviceInfo,
        securityChecks,
        protectionEnabled,
        platform: 'android',
        nativeModuleAvailable: true,
        initializationTime: this.initializationTime
      });

      return {
        success: true,
        deviceInfo: this.deviceInfo,
        securityChecks,
        protectionEnabled,
        message: 'Android原生安全模块初始化成功',
        nativeModuleAvailable: true,
        enterpriseLevel: true
      };

    } catch (error) {
      console.error('❌ Android安全模块初始化失败:', error);
      this.logSecurityEvent(SECURITY_EVENTS.INITIALIZATION_FAILED, { 
        error: error.message,
        platform: 'android',
        fatal: true
      });
      
      return {
        success: false,
        error: error.message,
        deviceInfo: null,
        nativeModuleAvailable: false,
        platform: 'android'
      };
    }
  }

  /**
   * 启用Android防截屏保护 - 核心安全功能
   * 🛡️ 使用Android原生FLAG_SECURE实现，企业级标准
   */
  async enableScreenshotProtection() {
    try {
      if (!SecurityModule) {
        throw new Error('Android原生安全模块不可用');
      }

      await SecurityModule.enableScreenshotProtection();
      this.isProtectionEnabled = true;
      
      console.log('🛡️ Android防截屏保护已启用 (FLAG_SECURE)');
      this.logSecurityEvent(SECURITY_EVENTS.SCREENSHOT_PROTECTION_ENABLED, {
        method: 'FLAG_SECURE',
        platform: 'android',
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('❌ 启用Android防截屏保护失败:', error);
      this.logSecurityEvent(SECURITY_EVENTS.SECURITY_VIOLATION, {
        type: 'screenshot_protection_failed',
        error: error.message,
        severity: ANDROID_VIOLATION_SEVERITY.CRITICAL
      });
      return false;
    }
  }

  /**
   * 禁用Android防截屏保护
   * ⚠️ 注意：企业级环境中应谨慎使用
   */
  async disableScreenshotProtection() {
    try {
      if (!SecurityModule) {
        throw new Error('Android原生安全模块不可用');
      }

      await SecurityModule.disableScreenshotProtection();
      this.isProtectionEnabled = false;
      
      console.log('⚠️ Android防截屏保护已禁用');
      this.logSecurityEvent(SECURITY_EVENTS.SCREENSHOT_PROTECTION_DISABLED, {
        platform: 'android',
        timestamp: new Date().toISOString(),
        warning: 'Enterprise security compromised'
      });

      return true;
    } catch (error) {
      console.error('❌ 禁用Android防截屏保护失败:', error);
      return false;
    }
  }

  /**
   * 检测Android设备是否为模拟器
   * 🔍 使用多重Android原生检测机制确保准确性
   */
  async isEmulator() {
    try {
      if (!SecurityModule) {
        throw new Error('Android原生安全模块不可用');
      }

      const result = await SecurityModule.isEmulator();
      
      if (result.isEmulator) {
        this.logSecurityEvent(SECURITY_EVENTS.EMULATOR_DETECTED, {
          ...result,
          platform: 'android',
          severity: ANDROID_VIOLATION_SEVERITY.CRITICAL
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Android模拟器检测失败:', error);
      return { 
        isEmulator: false, 
        reason: 'Detection failed', 
        error: error.message,
        platform: 'android'
      };
    }
  }

  /**
   * 检测Android设备是否已Root
   * 🔍 检查多个Android Root指标确保检测准确性
   */
  async isRooted() {
    try {
      if (!SecurityModule) {
        throw new Error('Android原生安全模块不可用');
      }

      const result = await SecurityModule.isRooted();
      
      if (result.isRooted) {
        this.logSecurityEvent(SECURITY_EVENTS.ROOT_DETECTED, {
          ...result,
          platform: 'android',
          severity: ANDROID_VIOLATION_SEVERITY.CRITICAL
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Android Root检测失败:', error);
      return { 
        isRooted: false, 
        reason: 'Detection failed', 
        error: error.message,
        platform: 'android'
      };
    }
  }

  /**
   * 检测Android开发者选项是否开启
   * 🔍 检查USB调试和开发者模式
   */
  async isDeveloperOptionsEnabled() {
    try {
      if (!SecurityModule) {
        throw new Error('Android原生安全模块不可用');
      }

      const result = await SecurityModule.isDeveloperOptionsEnabled();
      
      if (result.isDeveloperOptionsEnabled) {
        this.logSecurityEvent(SECURITY_EVENTS.DEVELOPER_OPTIONS_ENABLED, {
          ...result,
          platform: 'android',
          severity: ANDROID_VIOLATION_SEVERITY.HIGH
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Android开发者选项检测失败:', error);
      return { 
        isDeveloperOptionsEnabled: false, 
        error: error.message,
        platform: 'android'
      };
    }
  }

  /**
   * 获取Android设备安全信息
   * 📱 获取完整的Android设备安全状态
   */
  async getDeviceSecurityInfo() {
    try {
      if (!SecurityModule) {
        throw new Error('Android原生安全模块不可用');
      }

      const info = await SecurityModule.getDeviceSecurityInfo();
      this.deviceInfo = {
        ...info,
        platform: 'android',
        nativeModuleAvailable: true,
        enterpriseLevel: true,
        lastUpdated: new Date().toISOString()
      };
      
      return this.deviceInfo;
    } catch (error) {
      console.error('❌ 获取Android设备安全信息失败:', error);
      return null;
    }
  }

  /**
   * 执行完整的Android企业级安全检查
   * 🔒 企业级安全标准，零容忍政策
   */
  async performSecurityChecks() {
    const violations = [];
    this.lastSecurityCheck = new Date().toISOString();

    try {
      console.log('🔍 执行Android企业级安全检查...');

      // 1. Android模拟器检测
      const emulatorResult = await this.isEmulator();
      if (emulatorResult.isEmulator) {
        violations.push({
          type: ANDROID_SECURITY_CHECKS.EMULATOR,
          severity: ANDROID_VIOLATION_SEVERITY.CRITICAL,
          failed: true,
          reason: emulatorResult.reason,
          action: 'block_access',
          platform: 'android'
        });
      }

      // 2. Android Root检测
      const rootResult = await this.isRooted();
      if (rootResult.isRooted) {
        violations.push({
          type: ANDROID_SECURITY_CHECKS.ROOT,
          severity: ANDROID_VIOLATION_SEVERITY.CRITICAL,
          failed: true,
          reason: rootResult.reason,
          action: 'block_access',
          platform: 'android'
        });
      }

      // 3. Android开发者选项检测
      const devOptionsResult = await this.isDeveloperOptionsEnabled();
      if (devOptionsResult.isDeveloperOptionsEnabled) {
        violations.push({
          type: ANDROID_SECURITY_CHECKS.DEVELOPER_OPTIONS,
          severity: ANDROID_VIOLATION_SEVERITY.HIGH,
          failed: true,
          reason: 'Android developer options are enabled',
          action: 'warn_user',
          platform: 'android'
        });
      }

      // 4. Android应用完整性检查
      if (this.deviceInfo && this.deviceInfo.isDebuggable) {
        violations.push({
          type: ANDROID_SECURITY_CHECKS.APP_INTEGRITY,
          severity: ANDROID_VIOLATION_SEVERITY.HIGH,
          failed: true,
          reason: 'Android application is in debug mode',
          action: 'warn_user',
          platform: 'android'
        });
      }

      // 处理Android安全违规
      if (violations.length > 0) {
        console.warn('⚠️ 检测到Android安全违规:', violations);
        this.handleSecurityViolations(violations);
      } else {
        console.log('✅ Android安全检查通过');
      }

      return violations;

    } catch (error) {
      console.error('❌ Android安全检查失败:', error);
      return [{
        type: ANDROID_SECURITY_CHECKS.APP_INTEGRITY,
        severity: ANDROID_VIOLATION_SEVERITY.CRITICAL,
        failed: true,
        reason: `Android security check failed: ${error.message}`,
        action: 'block_access',
        platform: 'android'
      }];
    }
  }

  /**
   * 处理Android安全违规 - 企业级零容忍政策
   * 🚨 根据违规严重程度采取相应措施
   */
  handleSecurityViolations(violations) {
    this.violationCount++;
    
    // 记录Android安全违规事件
    this.logSecurityEvent(SECURITY_EVENTS.SECURITY_VIOLATION, {
      violations,
      violationCount: this.violationCount,
      platform: 'android',
      timestamp: new Date().toISOString(),
      enterprisePolicy: 'zero_tolerance'
    });

    // 分类处理Android违规
    const criticalViolations = violations.filter(v => v.severity === ANDROID_VIOLATION_SEVERITY.CRITICAL);
    const highViolations = violations.filter(v => v.severity === ANDROID_VIOLATION_SEVERITY.HIGH);

    if (criticalViolations.length > 0) {
      // 关键违规：立即阻止Android应用运行
      this.handleAndroidCriticalViolations(criticalViolations);
    } else if (highViolations.length > 0) {
      // 高级违规：警告用户
      this.handleAndroidHighViolations(highViolations);
    }
  }

  /**
   * 处理Android关键安全违规
   * 🚨 立即阻止Android应用运行
   */
  handleAndroidCriticalViolations(violations) {
    const messages = violations.map(v => {
      switch (v.type) {
        case ANDROID_SECURITY_CHECKS.EMULATOR:
          return '• 检测到Android模拟器环境';
        case ANDROID_SECURITY_CHECKS.ROOT:
          return '• 检测到Android设备已Root';
        default:
          return `• ${v.reason}`;
      }
    });

    this.logSecurityEvent(SECURITY_EVENTS.CRITICAL_VIOLATION, {
      violations,
      action: 'force_exit',
      platform: 'android'
    });

    Alert.alert(
      '🔒 Android安全违规 - 访问被阻止',
      `为了保护企业数据安全，Android应用不能在以下环境中运行：\n\n${messages.join('\n')}\n\n这是企业级安全要求，无法绕过。\n\n平台：Android ${this.deviceInfo?.sdkInt || 'Unknown'}`,
      [
        {
          text: '退出应用',
          onPress: () => {
            this.logSecurityEvent(SECURITY_EVENTS.SECURITY_VIOLATION, {
              action: 'user_forced_exit',
              reason: 'android_critical_violations',
              platform: 'android'
            });
            BackHandler.exitApp();
          },
        },
      ],
      { cancelable: false }
    );
  }

  /**
   * 处理Android高级安全违规
   * ⚠️ 警告用户但允许继续使用
   */
  handleAndroidHighViolations(violations) {
    const messages = violations.map(v => {
      switch (v.type) {
        case ANDROID_SECURITY_CHECKS.DEVELOPER_OPTIONS:
          return '• Android开发者选项已开启';
        case ANDROID_SECURITY_CHECKS.APP_INTEGRITY:
          return '• Android应用处于调试模式';
        default:
          return `• ${v.reason}`;
      }
    });

    Alert.alert(
      '⚠️ Android安全警告',
      `检测到以下Android安全风险：\n\n${messages.join('\n')}\n\n建议关闭相关选项以提高安全性。\n\n设备：${this.deviceInfo?.manufacturer} ${this.deviceInfo?.model}`,
      [
        {
          text: '我知道了',
          onPress: () => {
            this.logSecurityEvent(SECURITY_EVENTS.SECURITY_VIOLATION, {
              action: 'user_acknowledged',
              reason: 'android_high_violations',
              platform: 'android'
            });
          },
        },
      ]
    );
  }

  /**
   * 检查Android防截屏是否启用
   */
  isScreenshotProtectionEnabled() {
    return this.isProtectionEnabled;
  }

  /**
   * 获取Android设备信息
   */
  getDeviceInfo() {
    return this.deviceInfo;
  }

  /**
   * 手动触发Android安全检查
   */
  async checkSecurity() {
    return await this.performSecurityChecks();
  }

  /**
   * 获取Android安全状态摘要
   */
  getSecuritySummary() {
    return {
      platform: 'android',
      nativeModuleAvailable: !!SecurityModule,
      screenshotProtectionEnabled: this.isProtectionEnabled,
      securityLevel: this.securityLevel,
      violationCount: this.violationCount,
      deviceInfo: this.deviceInfo,
      lastCheck: this.lastSecurityCheck,
      initializationTime: this.initializationTime,
      enterpriseLevel: true,
      zerotolerancePolicy: true
    };
  }

  /**
   * 验证Android原生模块状态
   */
  validateNativeModule() {
    return {
      available: !!SecurityModule,
      platform: 'android',
      required: true,
      critical: true,
      description: 'Android原生安全模块是项目生命线'
    };
  }
}

// 创建Android安全模块单例
const androidSecurity = new AndroidSecurity();

export default androidSecurity;
