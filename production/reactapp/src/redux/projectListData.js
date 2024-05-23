import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProjects, deleteProjectById } from '../api/projectApi';

const initialState  = {
  list: null,
  status: 'idle',
  error: null,
}
export const fetchProjectList = createAsyncThunk('projectList/fetchProjectList', async () => {
  try {
    const data = await getAllProjects();
    let list;
    if(data){
      list = data.map((x) => {
        const item = {
            id: x.id, 
            title: x.title,
            status: x.status,
        }

        return item;
      });
      return list;
    }
    return null;
  } catch (err) {
    return err.message;
  }
})

export const deleteProject = createAsyncThunk('projectList/deleteProject', async (id) => {
  try {
    const response = await deleteProjectById(id);
    return response;
  } catch (err) {
    return err.message;
  }
})


const projectListData = createSlice({
    name: 'ProjectList',
    initialState,
    reducers: {
      setProjectList: ( state, action ) => {
          state.list = action.payload.list;
        },
        resetProjectList: () => initialState,
    },
    extraReducers(builder) {
      builder
        .addCase(fetchProjectList.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchProjectList.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.list = action.payload;
        })
        .addCase(fetchProjectList.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(deleteProject.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(deleteProject.fulfilled, (state, action) => {
          state.status = 'deleted';
        })
        .addCase(deleteProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
    }
});

export default projectListData.reducer;
export const { setProjectList, resetProjectList } = projectListData.actions;