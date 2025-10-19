/**
 * Android安全管理器 - 企业级安全标准
 * 
 * 🔒 核心价值：Android原生安全模块是项目的生命线，绝对不可丢失！
 * 
 * 这个管理器专门为Android平台设计，确保原生安全模块的完整性和企业级标准
 */

import AndroidSecurity from './AndroidSecurity';
import { SECURITY_EVENTS, SECURITY_LEVELS } from './SecurityInterface';

/**
 * Android安全管理器类
 * 提供Android平台专用的安全功能接口
 */
class AndroidSecurityManager {
  constructor() {
    this.androidSecurity = AndroidSecurity;
    this.isInitialized = false;
    this.initializationResult = null;
    console.log('🔐 Android安全管理器已创建');
  }

  /**
   * 初始化Android安全管理器
   * 🚨 这是Android应用启动时必须调用的方法
   */
  async initialize() {
    try {
      console.log('🔐 初始化Android安全管理器...');
      
      // 调用Android安全模块初始化
      this.initializationResult = await this.androidSecurity.initialize();
      
      if (this.initializationResult.success) {
        this.isInitialized = true;
        console.log('✅ Android安全管理器初始化成功');
        
        // 验证原生模块状态
        const nativeModuleStatus = this.androidSecurity.validateNativeModule();
        if (!nativeModuleStatus.available) {
          throw new Error('Android原生安全模块验证失败');
        }
        
      } else {
        console.error('❌ Android安全管理器初始化失败:', this.initializationResult.error);
      }

      return this.initializationResult;
    } catch (error) {
      console.error('❌ Android安全管理器初始化异常:', error);
      this.initializationResult = {
        success: false,
        error: error.message,
        platform: 'android',
        nativeModuleAvailable: false
      };
      return this.initializationResult;
    }
  }

  /**
   * 启用Android防截屏保护 - 核心安全功能
   * 🛡️ 企业级必备功能，使用Android原生FLAG_SECURE
   */
  async enableScreenshotProtection() {
    this.ensureInitialized();
    return await this.androidSecurity.enableScreenshotProtection();
  }

  /**
   * 禁用Android防截屏保护
   * ⚠️ 企业级环境中应谨慎使用
   */
  async disableScreenshotProtection() {
    this.ensureInitialized();
    return await this.androidSecurity.disableScreenshotProtection();
  }

  /**
   * 检测Android设备是否为模拟器
   */
  async isEmulator() {
    this.ensureInitialized();
    return await this.androidSecurity.isEmulator();
  }

  /**
   * 检测Android设备是否已Root
   */
  async isRooted() {
    this.ensureInitialized();
    return await this.androidSecurity.isRooted();
  }

  /**
   * 检测Android开发者选项是否开启
   */
  async isDeveloperOptionsEnabled() {
    this.ensureInitialized();
    return await this.androidSecurity.isDeveloperOptionsEnabled();
  }

  /**
   * 获取Android设备安全信息
   */
  async getDeviceSecurityInfo() {
    this.ensureInitialized();
    return await this.androidSecurity.getDeviceSecurityInfo();
  }

  /**
   * 执行完整的Android安全检查
   * 🔍 企业级安全检查
   */
  async performSecurityChecks() {
    this.ensureInitialized();
    return await this.androidSecurity.performSecurityChecks();
  }

  /**
   * 获取Android设备信息
   */
  getDeviceInfo() {
    this.ensureInitialized();
    return this.androidSecurity.getDeviceInfo();
  }

  /**
   * 检查Android防截屏是否启用
   */
  isScreenshotProtectionEnabled() {
    this.ensureInitialized();
    return this.androidSecurity.isScreenshotProtectionEnabled();
  }

  /**
   * 手动触发Android安全检查
   */
  async checkSecurity() {
    this.ensureInitialized();
    return await this.androidSecurity.checkSecurity();
  }

  /**
   * 获取Android安全状态摘要
   */
  getSecuritySummary() {
    if (!this.isInitialized) {
      return {
        initialized: false,
        platform: 'android',
        error: 'Android security manager not initialized',
        nativeModuleRequired: true
      };
    }

    const androidSummary = this.androidSecurity.getSecuritySummary();
    return {
      ...androidSummary,
      initialized: this.isInitialized,
      initializationResult: this.initializationResult,
      managerVersion: '1.0.0-android',
      enterpriseGrade: true
    };
  }

  /**
   * 获取Android平台信息
   */
  getPlatformInfo() {
    return {
      platform: 'android',
      securityModuleType: 'AndroidSecurity',
      initialized: this.isInitialized,
      nativeModuleRequired: true,
      enterpriseLevel: true,
      description: 'Android原生安全模块专用管理器'
    };
  }

  /**
   * 确保Android安全管理器已初始化
   * @private
   */
  ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('Android安全管理器未初始化，请先调用 initialize() 方法');
    }
  }

  /**
   * 重新初始化Android安全管理器
   * 🔄 用于重新检查Android安全状态
   */
  async reinitialize() {
    console.log('🔄 重新初始化Android安全管理器...');
    this.isInitialized = false;
    this.initializationResult = null;
    return await this.initialize();
  }

  /**
   * 记录Android安全事件
   * 📝 统一的Android安全事件记录接口
   */
  logSecurityEvent(event, data) {
    const logData = {
      ...data,
      platform: 'android',
      timestamp: new Date().toISOString(),
      managerVersion: '1.0.0-android',
      nativeModule: true
    };

    console.log(`[AndroidSecurityManager] ${event}:`, logData);
    
    // 调用Android安全模块的日志记录
    if (this.isInitialized && this.androidSecurity.logSecurityEvent) {
      this.androidSecurity.logSecurityEvent(event, logData);
    }
  }

  /**
   * 检查Android特定安全功能是否可用
   */
  isAndroidSecurityFeatureAvailable(feature) {
    if (!this.isInitialized) {
      return false;
    }

    const summary = this.getSecuritySummary();
    
    switch (feature) {
      case 'screenshot_protection':
        return summary.nativeModuleAvailable;
      case 'emulator_detection':
        return summary.nativeModuleAvailable;
      case 'root_detection':
        return summary.nativeModuleAvailable;
      case 'developer_options_check':
        return summary.nativeModuleAvailable;
      case 'app_integrity_check':
        return summary.nativeModuleAvailable;
      default:
        return false;
    }
  }

  /**
   * 获取Android安全功能支持情况
   */
  getAndroidSecurityFeatureSupport() {
    return {
      platform: 'android',
      features: {
        screenshotProtection: this.isAndroidSecurityFeatureAvailable('screenshot_protection'),
        emulatorDetection: this.isAndroidSecurityFeatureAvailable('emulator_detection'),
        rootDetection: this.isAndroidSecurityFeatureAvailable('root_detection'),
        developerOptionsCheck: this.isAndroidSecurityFeatureAvailable('developer_options_check'),
        appIntegrityCheck: this.isAndroidSecurityFeatureAvailable('app_integrity_check')
      },
      nativeModuleRequired: true,
      enterpriseGrade: true,
      description: 'Android原生安全模块提供企业级安全防护'
    };
  }

  /**
   * 验证Android原生模块状态
   */
  validateAndroidNativeModule() {
    if (!this.isInitialized) {
      return {
        valid: false,
        error: 'Manager not initialized'
      };
    }

    return this.androidSecurity.validateNativeModule();
  }

  /**
   * 获取Android安全配置
   */
  getAndroidSecurityConfig() {
    const { getAndroidSecurityConfig } = require('./SecurityInterface');
    return getAndroidSecurityConfig();
  }

  /**
   * 执行Android安全自检
   */
  async performAndroidSelfCheck() {
    try {
      console.log('🔍 执行Android安全自检...');
      
      const results = {
        platform: 'android',
        timestamp: new Date().toISOString(),
        checks: {}
      };

      // 检查管理器初始化状态
      results.checks.managerInitialized = this.isInitialized;
      
      // 检查原生模块状态
      results.checks.nativeModule = this.validateAndroidNativeModule();
      
      // 检查防截屏状态
      results.checks.screenshotProtection = this.isScreenshotProtectionEnabled();
      
      // 执行安全检查
      if (this.isInitialized) {
        results.checks.securityViolations = await this.performSecurityChecks();
        results.checks.deviceInfo = this.getDeviceInfo();
      }

      console.log('✅ Android安全自检完成:', results);
      return results;
      
    } catch (error) {
      console.error('❌ Android安全自检失败:', error);
      return {
        platform: 'android',
        timestamp: new Date().toISOString(),
        error: error.message,
        success: false
      };
    }
  }
}

// 创建Android安全管理器单例
const androidSecurityManager = new AndroidSecurityManager();

export default androidSecurityManager;

// 导出相关类和常量
export { AndroidSecurityManager, SECURITY_EVENTS, SECURITY_LEVELS };
