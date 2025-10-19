/**
 * Android安全状态管理 - 企业级标准
 */

import { createSlice } from '@reduxjs/toolkit';

const securitySlice = createSlice({
  name: 'security',
  initialState: {
    screenshotProtectionEnabled: false,
    nativeModuleAvailable: false,
    deviceInfo: null,
    securityViolations: [],
    lastSecurityCheck: null,
  },
  reducers: {
    updateSecurityStatus: (state, action) => {
      Object.assign(state, action.payload);
      state.lastSecurityCheck = new Date().toISOString();
    },
    addSecurityViolation: (state, action) => {
      state.securityViolations.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearViolations: (state) => {
      state.securityViolations = [];
    },
  },
});

export const { updateSecurityStatus, addSecurityViolation, clearViolations } = securitySlice.actions;
export default securitySlice.reducer;
