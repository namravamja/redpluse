// src/features/collapsed/collapsedSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const collapsedSlice = createSlice({
  name: "collapsed",
  initialState,
  reducers: {
    toggleCollapsed: (state) => !state,
  },
});

export const { toggleCollapsed } = collapsedSlice.actions;

export default collapsedSlice.reducer;
