import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBoxPlot, getCorrelationMatrix, getNormalDistribution } from '../api/projectApi';


export const fetchVisualization = createAsyncThunk('visualization/fetchVisualization', async (column_name, {dispatch, getState}) => {
  try {
    const vis_state = getState().visualizationData;
    const pro_state = getState().projectData;
    const type_id = vis_state.id;
    const project_id = pro_state.id;
    const active_file_type = pro_state.active_file_type;

    dispatch(setMessage(null));
    dispatch(setColumn(column_name));

    let response;
    switch (type_id) {
        case "0":
          response = await getCorrelationMatrix(project_id, active_file_type);
            break;
        case "1":
          response = await getNormalDistribution(project_id, column_name, active_file_type);
            break;
        case "2":
          response =  await getBoxPlot(project_id, column_name, active_file_type);
            break;
        default:
          dispatch(setMessage( "Неизвестная ошибка. Повторите позже."))
          return;
    }

    const setPng = (res) => {
      const base64 = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
      dispatch(setImg(`data:image/png;charset=utf-8;base64,${base64}`))
    }

    setPng(response);

  } catch (e) {
    console.log(e);
  }
  
});


const initialState  = {
  id: null,
  column_name: null,
  img: null,
  status: 'idle',
  error: null,
  message: null,
}

const visualizationData = createSlice({
    name: 'Visualization',
    initialState,
    reducers: {
      setVisualizationType: ( state, action ) => {
          state.id = action.payload;
        },
        setColumn:( state, action ) => {
          state.column_name = action.payload;
        },
        setImg: ( state, action ) => {
          state.img = action.payload;
        },
        setFileType: ( state, action ) => {
          state.file_type = action.payload;
        },
        setMessage: ( state, action ) => {
          state.message = action.payload;
        },
        resetVisualisation: () => initialState,
    },
    extraReducers(builder) {
      builder
        .addCase(fetchVisualization.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchVisualization.fulfilled, (state, action) => {
          state.status = 'succeeded';
        })
        .addCase(fetchVisualization.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
    }
});

export default visualizationData.reducer;
export const { resetVisualisation,  setVisualizationType, setColumn, setImg, setMessage} = visualizationData.actions;