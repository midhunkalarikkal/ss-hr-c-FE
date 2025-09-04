import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import adminReducer from './slices/adminSlice';
import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import localStorage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: "root",
  storage: localStorage,
};

const rootReducers = {
  auth: authReducer,
  app: appReducer,
  admin: adminReducer,
  chat: chatReducer,
  job : jobReducer,
  user : userReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducers));

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistAppStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;