import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUserData: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
