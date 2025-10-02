// A SLICE is a piece of your Redux store
// This slice handles everything related to authentication

import { createSlice } from '@reduxjs/toolkit';

// Initial state - what the auth state looks like when app starts
const initialState = {
  user: null,           // Current logged-in user
  token: null,          // JWT token for API requests
  isLoading: false,     // Is an auth action in progress?
  error: null,          // Any error messages
  isAuthenticated: false, // Is user logged in?
};

// Create the slice
const authSlice = createSlice({
  name: 'auth', // Name of this slice
  initialState,
  
  // REDUCERS - functions that update state
  // Each reducer handles one type of action
  reducers: {
    // Called when login starts
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Called when login succeeds
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    
    // Called when login fails
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Called when user logs out
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    // Update user profile
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Export actions (these are what you'll dispatch from components)
export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser 
} = authSlice.actions;

// Export reducer (this goes into the store)
export default authSlice.reducer;