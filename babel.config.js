/**
 * Babel配置 - Android企业级安全构建
 * 
 * 🔒 核心价值：优化Android安全模块的JavaScript编译
 */

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // 🛡️ 企业级安全插件配置
    'react-native-reanimated/plugin', // 必须放在最后
  ],
  env: {
    production: {
      plugins: [
        // 🔐 生产环境安全优化
        'transform-remove-console', // 移除console.log
        'react-native-paper/babel', // Paper组件优化
      ],
    },
  },
};
