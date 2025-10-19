/**
 * Android安全接口定义 - 企业级安全标准
 * 
 * 🔒 核心价值：Android原生安全模块是项目的生命线，绝对不可丢失！
 * 
 * 这个接口专门为Android平台定义安全功能，确保原生模块的完整性
 */

/**
 * Android安全接口抽象类
 * 定义了Android平台必须实现的安全功能
 */
export class SecurityInterface {
  /**
   * 初始化Android安全模块
   * @returns {Promise<Object>} 初始化结果
   */
  async initialize() {
    throw new Error('initialize() must be implemented by Android security module');
  }

  /**
   * 启用防截屏保护（Android核心安全功能）
   * 使用Android原生FLAG_SECURE实现
   * @returns {Promise<boolean>} 是否成功启用
   */
  async enableScreenshotProtection() {
    throw new Error('enableScreenshotProtection() must be implemented by Android security module');
  }

  /**
   * 禁用防截屏保护
   * @returns {Promise<boolean>} 是否成功禁用
   */
  async disableScreenshotProtection() {
    throw new Error('disableScreenshotProtection() must be implemented by Android security module');
  }

  /**
   * 检测设备是否为模拟器（Android原生实现）
   * @returns {Promise<Object>} 检测结果
   */
  async isEmulator() {
    throw new Error('isEmulator() must be implemented by Android security module');
  }

  /**
   * 检测设备是否已Root（Android原生实现）
   * @returns {Promise<Object>} 检测结果
   */
  async isRooted() {
    throw new Error('isRooted() must be implemented by Android security module');
  }

  /**
   * 检测开发者选项是否开启（Android特有）
   * @returns {Promise<Object>} 检测结果
   */
  async isDeveloperOptionsEnabled() {
    throw new Error('isDeveloperOptionsEnabled() must be implemented by Android security module');
  }

  /**
   * 获取Android设备安全信息
   * @returns {Promise<Object>} 设备安全信息
   */
  async getDeviceSecurityInfo() {
    throw new Error('getDeviceSecurityInfo() must be implemented by Android security module');
  }

  /**
   * 执行完整的Android安全检查
   * @returns {Promise<Array>} 安全检查结果列表
   */
  async performSecurityChecks() {
    throw new Error('performSecurityChecks() must be implemented by Android security module');
  }

  /**
   * 处理安全违规行为（Android企业级标准）
   * @param {Array} violations 违规列表
   */
  handleSecurityViolations(violations) {
    throw new Error('handleSecurityViolations() must be implemented by Android security module');
  }

  /**
   * 记录Android安全事件
   * @param {string} event 事件类型
   * @param {Object} data 事件数据
   */
  logSecurityEvent(event, data) {
    const logData = {
      ...data,
      platform: 'android',
      timestamp: new Date().toISOString(),
      nativeModule: true
    };
    console.log(`[Android Security] ${event}:`, logData);
  }
}

/**
 * Android安全事件类型常量
 */
export const SECURITY_EVENTS = {
  // 初始化事件
  INITIALIZATION_SUCCESS: 'android_initialization_success',
  INITIALIZATION_FAILED: 'android_initialization_failed',
  
  // 防截屏事件
  SCREENSHOT_PROTECTION_ENABLED: 'android_screenshot_protection_enabled',
  SCREENSHOT_PROTECTION_DISABLED: 'android_screenshot_protection_disabled',
  SCREENSHOT_ATTEMPT_DETECTED: 'android_screenshot_attempt_detected',
  
  // 设备检测事件
  EMULATOR_DETECTED: 'android_emulator_detected',
  ROOT_DETECTED: 'android_root_detected',
  DEVELOPER_OPTIONS_ENABLED: 'android_developer_options_enabled',
  
  // 安全违规事件
  SECURITY_VIOLATION: 'android_security_violation',
  CRITICAL_VIOLATION: 'android_critical_violation',
  
  // 应用保护事件
  APP_INTEGRITY_CHECK: 'android_app_integrity_check',
  TAMPERING_DETECTED: 'android_tampering_detected',
};

/**
 * Android安全级别定义
 */
export const SECURITY_LEVELS = {
  ENTERPRISE: 'enterprise',    // 企业级安全，所有检查都必须通过
  HIGH: 'high',               // 高级安全，关键检查必须通过
  MEDIUM: 'medium',           // 标准安全，允许部分风险
  LOW: 'low',                 // 基础安全，仅基本保护
};

/**
 * Android平台安全配置
 */
export const ANDROID_SECURITY_CONFIG = {
  // 核心安全功能
  screenshotProtection: {
    enabled: true,
    method: 'FLAG_SECURE',
    required: true,
    description: 'Android原生防截屏保护'
  },
  
  // 设备检测功能
  emulatorDetection: {
    enabled: true,
    methods: ['fingerprint', 'hardware', 'build_properties'],
    required: true,
    description: '模拟器检测'
  },
  
  rootDetection: {
    enabled: true,
    methods: ['su_binary', 'root_apps', 'system_files'],
    required: true,
    description: 'Root检测'
  },
  
  developerOptionsCheck: {
    enabled: true,
    methods: ['usb_debugging', 'development_settings'],
    required: false,
    description: '开发者选项检测'
  },
  
  // 应用保护功能
  integrityCheck: {
    enabled: true,
    methods: ['signature', 'checksum'],
    required: true,
    description: '应用完整性验证'
  },
  
  tamperDetection: {
    enabled: true,
    methods: ['code_modification', 'resource_modification'],
    required: true,
    description: '防篡改检测'
  },
  
  // 企业级配置
  enterpriseMode: {
    enabled: true,
    zerotolerancePolicy: true,
    autoExit: true,
    logging: true,
    description: '企业级零容忍安全政策'
  }
};

/**
 * 获取Android安全配置
 * @returns {Object} Android安全配置
 */
export function getAndroidSecurityConfig() {
  return ANDROID_SECURITY_CONFIG;
}

/**
 * 检查Android是否支持特定安全功能
 * @param {string} feature 功能名称
 * @returns {boolean} 是否支持
 */
export function isAndroidSecurityFeatureSupported(feature) {
  const config = getAndroidSecurityConfig();
  return config[feature] && config[feature].enabled === true;
}

/**
 * 获取Android安全功能要求级别
 * @param {string} feature 功能名称
 * @returns {boolean} 是否为必需功能
 */
export function isAndroidSecurityFeatureRequired(feature) {
  const config = getAndroidSecurityConfig();
  return config[feature] && config[feature].required === true;
}

/**
 * Android安全检查类型
 */
export const ANDROID_SECURITY_CHECKS = {
  EMULATOR: 'emulator_check',
  ROOT: 'root_check',
  DEVELOPER_OPTIONS: 'developer_options_check',
  APP_INTEGRITY: 'app_integrity_check',
  TAMPERING: 'tampering_check',
  DEBUGGER: 'debugger_check'
};

/**
 * Android安全违规严重程度
 */
export const ANDROID_VIOLATION_SEVERITY = {
  CRITICAL: 'critical',    // 立即阻止应用运行
  HIGH: 'high',           // 警告用户但允许继续
  MEDIUM: 'medium',       // 记录日志
  LOW: 'low'              // 仅提示
};
