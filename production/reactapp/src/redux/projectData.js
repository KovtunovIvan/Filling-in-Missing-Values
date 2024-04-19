import { createSlice } from '@reduxjs/toolkit';

const initialState  = {
  id: null,
  title: null,
  user: null,
  original_csv_file_url: null,
  processed_csv_file_url: null,
  original_csv_file_name	: null,
  processed_csv_file_name: null,
  features: null,
}

const projectData = createSlice({
    name: 'Project',
    initialState,
    reducers: {
      setProject: ( state, action ) => {
          state.id = action.payload.id;
          state.title = action.payload.title;
          state.user = action.payload.user;
          state.original_csv_file_url = action.payload.original_csv_file_url;
          state.processed_csv_file_url = action.payload.processed_csv_file_url;
          state.original_csv_file_name = action.payload.original_csv_file_name;
          state.processed_csv_file_name = action.payload.processed_csv_file_name;
          state.features = action.payload.features;
        },
        resetProject: () => initialState
    }
});

export default projectData.reducer;
export const { setProject, resetProject } = projectData.actions;