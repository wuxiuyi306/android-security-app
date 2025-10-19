/**
 * Jest测试配置 - Android企业级安全测试
 * 
 * 🔒 核心价值：确保Android安全模块的测试覆盖
 */

module.exports = {
  preset: 'react-native',
  
  // 🛡️ 测试文件匹配
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  
  // 🔐 安全模块测试配置
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
  ],
  
  // 覆盖率配置
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js',
  ],
  
  // 🚨 安全模块特殊配置
  moduleNameMapping: {
    '^@security/(.*)$': '<rootDir>/src/security/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
  },
  
  // 企业级测试环境
  testEnvironment: 'node',
  
  // 安全模块模拟
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
