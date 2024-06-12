import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTaskStatus, getProjectByID } from '../api/projectApi';

export const fetchProject = createAsyncThunk('project/fetchProject', async (id) => {
  try {
    const response = await getProjectByID(id);
    return response;
  } catch (err) {
    return err.message;
  }
})

export const fetchProjectTaskStatus = createAsyncThunk('project/fetchProjectTaskStatus', async (id) => {
  try {
    let response = await checkTaskStatus(id);
    while (response.data.status === "PENDING"){
      response = await checkTaskStatus(id);
      setTimeout(2000);
    }
    return response;
  } catch (err) {
    return err.message;
  }
})

const initialState  = {
  id: null,
  title: null,
  user: null,
  original_csv_file_url: null,
  processed_csv_file_url: null,
  original_csv_file_name	: null,
  processed_csv_file_name: null,
  features: null,
  features_original: null,
  active_file_type: 'idle',//original or processed
  original_num_rows: null, //integer
  recommended_methods: null, //array of strings
  has_missing_values: null, //boolean
  status: 'idle',
  task_status: 'idle',
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
          state.features_original = action.payload.features_original;
          state.features = action.payload.features;
          state.original_num_rows = action.payload.original_num_rows;
          state.recommended_methods = action.payload.recommended_methods;
          state.has_missing_values = action.payload.has_missing_values;
          if(action.payload.processed_csv_file_url) {
            state.active_file_type = 'processed';
          } else {
            state.active_file_type = 'original';
          }
        },
        resetProject: () => initialState,
        resetProjectTaskStatus: (state) => {state.task_status = 'idle'},
        resetProjectStatus: (state) => {state.status = 'idle'},
        setOriginalFile: (state) => {state.active_file_type = 'original'},
        setProcessedFile: (state) => {state.active_file_type = 'processed'},
    },
    extraReducers(builder) {
      builder
        .addCase(fetchProject.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchProject.fulfilled, (state, action) => {
          state.id = action.payload.id;
          state.title = action.payload.title;
          state.user = action.payload.user;
          state.original_csv_file_url = action.payload.original_csv_file_url;
          state.processed_csv_file_url = action.payload.processed_csv_file_url;
          state.original_csv_file_name = action.payload.original_csv_file_name;
          state.processed_csv_file_name = action.payload.processed_csv_file_name;
          state.features_original = action.payload.features_original;
          state.features = action.payload.features;
          state.original_num_rows = action.payload.original_num_rows;
          state.recommended_methods = action.payload.recommended_methods;
          state.has_missing_values = action.payload.has_missing_values;
          if(action.payload.processed_csv_file_url) {
            state.active_file_type = 'processed';
          } else {
            state.active_file_type = 'original';
          }
          state.status = 'succeeded';
        })
        .addCase(fetchProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchProjectTaskStatus.pending, (state, action) => {
          state.task_status = 'loading';
        })
        .addCase(fetchProjectTaskStatus.fulfilled, (state, action) => {
          state.task_status = 'succeeded';
        })
        .addCase(fetchProjectTaskStatus.rejected, (state, action) => {
          state.task_status = 'failed';
          state.error = action.error.message;
        })
    }
});

export default projectData.reducer;
export const { setProject, resetProject, resetProjectTaskStatus, resetProjectStatus, setOriginalFile, setProcessedFile } = projectData.actions;