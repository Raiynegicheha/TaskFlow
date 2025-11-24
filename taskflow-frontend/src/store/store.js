// This is the STORE - the single source of truth for your app's state

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import testReducer from './slices/testSlice';
import projectReducer from './slices/projectSlice';
// Import other reducers here

// We'll import our slices here (we'll create them next)
// import authReducer from './slices/authSlice';
// import projectReducer from './slices/projectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    test: testReducer,
    projects: projectReducer,
    // Each slice manages a piece of state
    // auth: authReducer,
    // projects: projectReducer,
  },
});

// The store is like a database in the frontend
// Components can read from it and update it