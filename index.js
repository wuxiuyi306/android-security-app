/**
 * 图片管理系统 - Android入口文件
 * 
 * 🔒 企业级安全移动应用 - Android平台
 * 
 * 核心价值：Android原生安全模块是项目的生命线，绝对不可丢失！
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 注册应用
AppRegistry.registerComponent(appName, () => App);

console.log('🔐 Android安全图片管理系统启动...');
