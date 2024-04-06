import { createSlice } from '@reduxjs/toolkit';

const initialState  = {
  id: null,
  email: 'No email'
}

const userData = createSlice({
    name: 'User',
    initialState,
    reducers: {
      setUser: ( state, action ) => {
          state.id = action.payload.id;
          state.email = action.payload.email;
        }
    }
});

export default userData.reducer;
export const { setUser } = userData.actions;