import { createSlice } from '@reduxjs/toolkit';

const initialState  = {
  id: null,
  email: null,
  avatar: null,
  first_name: null,
  last_name: null,
  middle_name: null,
  phone_number: null,
}

const userData = createSlice({
    name: 'User',
    initialState,
    reducers: {
      setUser: ( state, action ) => {
          state.id = action.payload.id;
          state.email = action.payload.email;
          state.avatar = action.payload.avatar;
          state.first_name = action.payload.first_name;
          state.last_name = action.payload.last_name;
          state.middle_name = action.payload.middle_name;
          state.phone_number = action.payload.phone_number;
        }
    }
});

export default userData.reducer;
export const { setUser } = userData.actions;