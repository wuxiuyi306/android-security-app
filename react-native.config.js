/**
 * React Native配置 - Android企业级安全
 * 
 * 🔒 核心价值：配置Android原生安全模块的链接
 */

module.exports = {
  // 🛡️ Android安全项目配置
  project: {
    android: {
      sourceDir: './android',
      appName: 'app',
      packageName: 'com.photomanagerandroid',
    },
  },
  
  // 🔐 企业级资源配置
  assets: ['./src/assets/fonts/', './src/assets/images/'],
  
  // 🚨 Android安全模块依赖
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import io.github.oblador.vectoricons.VectorIconsPackage;',
        },
      },
    },
  },
};
