import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ModuleControl } from '../config/module-control';
import rootReducer from './reducers';
const middleware = [...getDefaultMiddleware({
  serializableCheck: false
})];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: ModuleControl.isDevelopment, // DevTools Disbale
});

export default store;
