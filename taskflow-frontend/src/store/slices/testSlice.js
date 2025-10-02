import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
  name: 'test',
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increment, decrement, reset } = testSlice.actions;
export default testSlice.reducer;