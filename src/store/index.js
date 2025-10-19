/**
 * Android Redux Store配置 - 企业级安全标准
 * 
 * 🔒 集成Android安全状态管理的Redux配置
 * 
 * 核心价值：确保状态管理与Android安全模块协同工作
 */

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import photoSlice from './photoSlice';
import userSlice from './userSlice';
import securitySlice from './securitySlice';

// Android安全增强中间件
const androidSecurityMiddleware = (store) => (next) => (action) => {
  // 记录敏感操作
  if (action.type.includes('login') || action.type.includes('logout') || action.type.includes('security')) {
    console.log(`[Android Security Store] ${action.type}:`, {
      timestamp: new Date().toISOString(),
      platform: 'android',
      action: action.type
    });
  }
  
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authSlice,
    photo: photoSlice,
    user: userSlice,
    security: securitySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(androidSecurityMiddleware),
  devTools: __DEV__ && {
    name: 'Android Security Photo Manager',
    trace: true,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
