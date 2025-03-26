import { createSlice } from '@reduxjs/toolkit';
import { saveToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from '../../utils/localStorage';

const initialState = {
  isAuthenticated: getFromLocalStorage('isAuthenticated', false),
  user: getFromLocalStorage('user', null),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      saveToLocalStorage('isAuthenticated', true);
      saveToLocalStorage('user', action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      removeFromLocalStorage('isAuthenticated');
      removeFromLocalStorage('user');
      // Note: We're not removing tasks from localStorage on logout
      // so that users can see their tasks when they log back in
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
