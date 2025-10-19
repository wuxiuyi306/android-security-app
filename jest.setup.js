/**
 * Jest测试设置 - Android企业级安全测试环境
 * 
 * 🔒 核心价值：模拟Android安全模块的测试环境
 */

import 'react-native-gesture-handler/jestSetup';

// 🛡️ 模拟Android安全模块
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: jest.fn(),
}));

// 🔐 模拟NativeModules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      // 🚨 模拟Android安全模块
      SecurityModule: {
        enableScreenshotProtection: jest.fn(() => Promise.resolve(true)),
        disableScreenshotProtection: jest.fn(() => Promise.resolve(true)),
        isEmulator: jest.fn(() => Promise.resolve({ isEmulator: false })),
        isRooted: jest.fn(() => Promise.resolve({ isRooted: false })),
        isDeveloperOptionsEnabled: jest.fn(() => Promise.resolve({ isEnabled: false })),
        getDeviceSecurityInfo: jest.fn(() => Promise.resolve({
          model: 'Test Device',
          androidVersion: '13',
          securityPatchLevel: '2024-01-01',
        })),
        performSecuritySelfCheck: jest.fn(() => Promise.resolve({ success: true })),
      },
    },
  };
});

// 🛡️ 模拟AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 模拟导航
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// 🔐 企业级安全测试全局配置
global.__DEV__ = false;
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
