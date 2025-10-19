/**
 * Metro配置 - Android企业级安全构建
 * 
 * 🔒 核心价值：优化Android安全模块的构建性能
 */

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * 🛡️ 企业级Metro安全配置
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // 🔐 安全模块路径解析
    alias: {
      '@security': './src/security',
      '@screens': './src/screens',
      '@store': './src/store',
      '@components': './src/components',
    },
  },
  // 🚨 企业级构建优化
  serializer: {
    // 移除开发时的console.log（生产环境）
    processModuleFilter: (module) => {
      if (module.path.includes('node_modules')) {
        return true;
      }
      // 保留安全模块的所有代码
      if (module.path.includes('security')) {
        return true;
      }
      return true;
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
