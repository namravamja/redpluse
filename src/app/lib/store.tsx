import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Using localStorage
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
} from "redux-persist";
import collapsedSlice from "../lib/features/collapsed/collapsedSlice";
import { api as api1 } from "./Donor"; // Main API slice
import { api as api2 } from "./EventOrganizer"; // Second API slice
import { api as api3 } from "./BloodBank"; // Third API slice

// Define persist config
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers, adding all API slices dynamically
const rootReducer = combineReducers({
  Collapsed: collapsedSlice,
  [api1.reducerPath]: api1.reducer,
  [api2.reducerPath]: api2.reducer,
  [api3.reducerPath]: api3.reducer,
});

// Apply persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const makeStore = () =>
  configureStore({
    reducer: persistedReducer, // Use persistedReducer directly
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api1.middleware, api2.middleware, api3.middleware), // Add all API middlewares
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
