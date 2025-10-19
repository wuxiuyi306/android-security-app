/**
 * ESLint配置 - Android企业级安全标准
 * 
 * 🔒 核心价值：确保Android安全模块代码质量
 */

module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // 🛡️ 企业级安全代码规范
    'no-console': 'warn', // 生产环境应移除console
    'no-debugger': 'error', // 禁止debugger
    'no-alert': 'warn', // 限制alert使用
    
    // 安全相关规则
    'no-eval': 'error', // 禁止eval
    'no-implied-eval': 'error', // 禁止隐式eval
    'no-new-func': 'error', // 禁止Function构造器
    
    // 🔐 代码质量规则
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    
    // React Native特定规则
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
  },
  
  // 🚨 安全模块特殊配置
  overrides: [
    {
      files: ['src/security/**/*.js'],
      rules: {
        'no-console': 'off', // 安全模块允许日志
        'no-alert': 'off', // 安全模块允许警告
      },
    },
  ],
};
