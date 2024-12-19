import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // Import the user slice

const store = configureStore({
  reducer: {
    user: userReducer, // Add your reducers here
  },
});

export default store;
