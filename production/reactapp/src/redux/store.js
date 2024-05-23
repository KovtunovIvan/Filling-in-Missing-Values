import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userData'
import projectReducer from './projectData'
import projectListReducer from './projectListData'
import visualizationReducer from './visualizationData';

const store = configureStore({
  devTools: true,
  reducer: {
    userData: userReducer,
    projectData: projectReducer,
    projectListData: projectListReducer,
    visualizationData: visualizationReducer,
  },
});


export default store;