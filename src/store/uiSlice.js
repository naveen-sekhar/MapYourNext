import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    mobileMenuOpen: false,
    theme: 'light',
    toast: null,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    setTheme: (state, { payload }) => { state.theme = payload; },
    showToast: (state, { payload }) => { state.toast = payload; },
    clearToast: (state) => { state.toast = null; },
  },
});

export const { toggleSidebar, toggleMobileMenu, setTheme, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
