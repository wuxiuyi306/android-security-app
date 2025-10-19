/**
 * Android用户管理状态 - 企业级安全标准
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadUsers = createAsyncThunk(
  'user/loadUsers',
  async (_, { rejectWithValue }) => {
    try {
      const mockUsers = [
        {
          id: 1,
          phone: '138****1234',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15 10:30',
          deviceInfo: 'Samsung Galaxy S21',
          securityLevel: 'enterprise'
        },
        {
          id: 2,
          phone: '139****5678',
          role: 'user',
          status: 'active',
          lastLogin: '2024-01-14 15:20',
          deviceInfo: 'Huawei P40',
          securityLevel: 'standard'
        }
      ];
      return mockUsers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
