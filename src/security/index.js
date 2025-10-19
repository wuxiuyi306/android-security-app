/**
 * Android安全模块统一导出 - 企业级安全标准
 * 
 * 🔒 核心价值：Android原生安全模块是项目的生命线！
 * 
 * 这个文件统一导出Android平台的安全相关模块和常量
 * 专门为Android平台优化，确保原生安全模块的完整性
 */

// Android专用安全管理器（主要使用）
export { default as SecurityManager } from './AndroidSecurityManager';

// Android原生安全模块
export { AndroidSecurity } from './AndroidSecurity';

// 安全接口和常量
export { 
  SecurityInterface,
  SECURITY_EVENTS,
  SECURITY_LEVELS,
  ANDROID_SECURITY_CONFIG,
  getAndroidSecurityConfig
} from './SecurityInterface';

// 默认导出Android安全管理器
export { default } from './AndroidSecurityManager';

/**
 * Android平台快速使用指南：
 * 
 * 1. 基础使用（推荐）：
 *    import SecurityManager from '@/security';
 *    await SecurityManager.initialize();
 * 
 * 2. 高级使用：
 *    import { SecurityManager, SECURITY_EVENTS } from '@/security';
 *    SecurityManager.logSecurityEvent(SECURITY_EVENTS.PROTECTION_ENABLED, data);
 * 
 * 3. Android特定使用：
 *    import { AndroidSecurity } from '@/security';
 *    // 直接访问Android原生安全功能
 */
