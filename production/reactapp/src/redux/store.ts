import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userData'
const store = configureStore({
  devTools: true,
  reducer: {
    userData: userReducer,
  },
});

export default store;