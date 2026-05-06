import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch('/users/me', data);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.patch('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(register.fulfilled, (state, { payload }) => {
      state.loading = false; state.user = payload.user; state.isAuthenticated = true;
    });
    builder.addCase(register.rejected, (state, { payload }) => {
      state.loading = false; state.error = payload;
    });
    // Login
    builder.addCase(login.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loading = false; state.user = payload.user; state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.loading = false; state.error = payload;
    });
    // getMe
    builder.addCase(getMe.fulfilled, (state, { payload }) => {
      state.user = payload.user; state.isAuthenticated = true; state.loading = false;
    });
    builder.addCase(getMe.rejected, (state) => {
      state.user = null; state.isAuthenticated = false; state.loading = false;
    });
    // Update Profile
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      state.user = payload.user;
    });
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null; state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
