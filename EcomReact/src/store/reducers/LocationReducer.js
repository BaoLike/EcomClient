import { createSlice } from "@reduxjs/toolkit";

const LocationSlice = createSlice({
  name: "location",
  initialState: {
    list: [],
  },
  reducers: {
    addLocation: (state, action) => {
      state.list.push(action.payload);
    },
    setLocations: (state, action) => {
      state.list = action.payload;
    }
  },
});

export const { setLocations } = LocationSlice.actions;
export const LocationReducer = LocationSlice.reducer;
