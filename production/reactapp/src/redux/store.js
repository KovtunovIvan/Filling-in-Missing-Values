import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userData'
import projectReducer from './projectData'
import visualizationReducer from './visualizationData';

const store = configureStore({
  devTools: true,
  reducer: {
    userData: userReducer,
    projectData: projectReducer,
    visualizationData: visualizationReducer,
  },
});


export default store;