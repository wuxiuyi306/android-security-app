/**
 * Android图片状态管理 - 企业级安全标准
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadPhotos = createAsyncThunk(
  'photo/loadPhotos',
  async (_, { rejectWithValue }) => {
    try {
      // 模拟API调用
      const mockPhotos = [
        {
          id: 1,
          title: '企业文档-001',
          description: '重要企业文档，受Android安全保护',
          thumbnail: 'https://picsum.photos/200/200?random=1',
          uploadDate: '2024-01-15',
          size: '2.3 MB',
          protected: true
        },
        {
          id: 2,
          title: '机密图片-002',
          description: '机密级别图片，防截屏保护',
          thumbnail: 'https://picsum.photos/200/200?random=2',
          uploadDate: '2024-01-14',
          size: '1.8 MB',
          protected: true
        }
      ];
      return mockPhotos;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const photoSlice = createSlice({
  name: 'photo',
  initialState: {
    photos: [],
    currentPhoto: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPhoto: (state, action) => {
      state.currentPhoto = action.payload;
    },
    clearCurrentPhoto: (state) => {
      state.currentPhoto = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(loadPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPhoto, clearCurrentPhoto } = photoSlice.actions;
export default photoSlice.reducer;
