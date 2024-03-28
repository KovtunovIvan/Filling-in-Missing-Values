import { createSlice } from '@reduxjs/toolkit';

const initialState  = {
  id: null,
  username: null,
  email: 'No email'
}

const userData = createSlice({
    name: 'User',
    initialState,
    reducers: {
      setUser: ( state, action ) => {
          state.id = action.payload.id;
          state.username = action.payload.username;
          state.email = action.payload.email;
        }
    }
});

export default userData.reducer;
export const { setUser } = userData.actions;