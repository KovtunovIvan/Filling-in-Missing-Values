import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userCheck } from '../api/userApi';
import { jwtDecode } from "jwt-decode";
import { LocalStorageTools } from '../localStorage';
import { redirect } from 'react-router-dom';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    const isUser = LocalStorageTools.getItemFromLocalStorage('tokens') ? true : false;
    if(isUser){
      const tokens = LocalStorageTools.getItemFromLocalStorage('tokens');
      const userInfo = tokens ? jwtDecode(tokens.access) : null;
      const response = await userCheck(userInfo.user_id);
      return response.data;
    }
    return redirect("/u/login");
  } catch (err) {
    return err.message;
  }
})

const initialState  = {
  id: null,
  email: null,
  avatar: null,
  first_name: null,
  last_name: null,
  middle_name: null,
  phone_number: null,
  status: 'idle',
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
        },
    },
    extraReducers(builder) {
      builder
        .addCase(fetchUser.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.id = action.payload.id;
          state.email = action.payload.email;
          state.avatar = action.payload.avatar;
          state.first_name = action.payload.first_name;
          state.last_name = action.payload.last_name;
          state.middle_name = action.payload.middle_name;
          state.phone_number = action.payload.phone_number;;
        })
        .addCase(fetchUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
    }
});

export default userData.reducer;
export const { setUser } = userData.actions;