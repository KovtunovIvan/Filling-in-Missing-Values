import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBoxPlot, getCorrelationMatrix, getNormalDistribution } from '../api/projectApi';

const arrayBufferToText = async (buffer) => {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
};

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/png;base64,${btoa(binary)}`;
};

export const fetchVisualization = createAsyncThunk('visualization/fetchVisualization', async (column_name, { dispatch, getState }) => {
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
        response = await getBoxPlot(project_id, column_name, active_file_type);
        break;
      default:
        dispatch(setMessage("Неизвестная ошибка. Повторите позже."));
        return;
    }

    const contentType = response.headers['content-type'];

    if (contentType && contentType.includes('application/json')) {
      const text = await arrayBufferToText(response.data);
      const data = JSON.parse(text);
      if (data.message) {
        dispatch(setMessage(data.message));
        return;
      }
    } else if (contentType && contentType.includes('image/png')) {
      const base64Image = arrayBufferToBase64(response.data);
      dispatch(setImg(base64Image));
    } else {
      dispatch(setMessage("Неизвестный формат ответа от сервера."));
    }
  } catch (e) {
    dispatch(setMessage("Ошибка при получении визуализации. Повторите позже."));
  }
});

const initialState = {
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
    setVisualizationType: (state, action) => {
      state.id = action.payload;
      state.message = null;
      state.error = null;
      state.img = null;
    },
    setColumn: (state, action) => {
      state.column_name = action.payload;
    },
    setImg: (state, action) => {
      state.img = action.payload;
    },
    setFileType: (state, action) => {
      state.file_type = action.payload;
    },
    setMessage: (state, action) => {
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

export const { setVisualizationType, setColumn, setImg, setFileType, setMessage, resetVisualisation } = visualizationData.actions;
export default visualizationData.reducer;
