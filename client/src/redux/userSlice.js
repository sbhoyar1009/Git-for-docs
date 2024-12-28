import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null, // Initial state
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload; // Update the userId
    },
  },
});

export const { setUserId } = userSlice.actions; // Export the action
export default userSlice.reducer; // Export the reducer
