/**
 * Android认证状态管理 - 企业级安全标准
 * 
 * 🔒 集成Android安全验证的认证状态管理
 * 
 * 核心价值：确保认证过程与Android安全模块协同
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android安全登录异步thunk
export const secureLogin = createAsyncThunk(
  'auth/secureLogin',
  async ({ phone, idCard, birthDate, securityInfo }, { rejectWithValue }) => {
    try {
      // 模拟Android安全登录API
      const response = await fetch('/api/android/secure-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': 'android',
          'X-Security-Info': JSON.stringify(securityInfo),
        },
        body: JSON.stringify({
          phone,
          idCard,
          birthDate,
          platform: 'android',
          deviceInfo: securityInfo?.deviceInfo,
          securityChecks: securityInfo?.securityChecks,
        }),
      });

      if (!response.ok) {
        throw new Error('Android安全登录失败');
      }

      const data = await response.json();
      
      // 存储Android安全token
      await AsyncStorage.setItem('android_secure_token', data.token);
      await AsyncStorage.setItem('android_user_info', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Android安全登出异步thunk
export const secureLogout = createAsyncThunk(
  'auth/secureLogout',
  async (_, { rejectWithValue }) => {
    try {
      // 清除Android安全存储
      await AsyncStorage.removeItem('android_secure_token');
      await AsyncStorage.removeItem('android_user_info');
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    // Android安全相关状态
    androidSecurityInfo: null,
    securityLevel: 'unknown',
    deviceTrusted: false,
    lastSecurityCheck: null,
  },
  reducers: {
    // 同步登录（用于恢复会话）
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.androidSecurityInfo = action.payload.securityInfo || null;
      state.deviceTrusted = action.payload.deviceTrusted || false;
      state.lastSecurityCheck = new Date().toISOString();
    },
    
    // 同步登出
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.androidSecurityInfo = null;
      state.securityLevel = 'unknown';
      state.deviceTrusted = false;
      state.lastSecurityCheck = null;
    },
    
    // 更新Android安全信息
    updateAndroidSecurityInfo: (state, action) => {
      state.androidSecurityInfo = action.payload;
      state.securityLevel = action.payload.securityLevel || 'unknown';
      state.deviceTrusted = action.payload.deviceTrusted || false;
      state.lastSecurityCheck = new Date().toISOString();
    },
    
    // 设置安全级别
    setSecurityLevel: (state, action) => {
      state.securityLevel = action.payload;
    },
    
    // 设置设备信任状态
    setDeviceTrusted: (state, action) => {
      state.deviceTrusted = action.payload;
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Android安全登录
      .addCase(secureLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(secureLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.androidSecurityInfo = action.payload.securityInfo;
        state.securityLevel = action.payload.securityLevel || 'enterprise';
        state.deviceTrusted = action.payload.deviceTrusted || true;
        state.lastSecurityCheck = new Date().toISOString();
      })
      .addCase(secureLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Android安全登出
      .addCase(secureLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(secureLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.androidSecurityInfo = null;
        state.securityLevel = 'unknown';
        state.deviceTrusted = false;
        state.lastSecurityCheck = null;
      })
      .addCase(secureLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  login, 
  logout, 
  updateAndroidSecurityInfo, 
  setSecurityLevel, 
  setDeviceTrusted, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;

// Android安全选择器
export const selectAndroidSecurityInfo = (state) => state.auth.androidSecurityInfo;
export const selectSecurityLevel = (state) => state.auth.securityLevel;
export const selectDeviceTrusted = (state) => state.auth.deviceTrusted;
export const selectLastSecurityCheck = (state) => state.auth.lastSecurityCheck;
