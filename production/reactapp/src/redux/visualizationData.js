import { createSlice } from '@reduxjs/toolkit';



const initialState  = {
  id: null,
  column_name: null,
  img: null,
}


const visualizationData = createSlice({
    name: 'Visualization',
    initialState,
    reducers: {
      resetVisualisation: initialState,
      setVisualizationType: ( state, action ) => {
          state.id = action.payload;
        },
        setColumn:( state, action ) => {
          state.column_name = action.payload;
        },
        setImg: ( state, action ) => {
          state.img = action.payload;
        },
    }
});

export default visualizationData.reducer;
export const { resetVisualisation,  setVisualizationType, setColumn, setImg} = visualizationData.actions;