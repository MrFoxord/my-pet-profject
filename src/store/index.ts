import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "@/store/api";
import { dashboardUiReducer } from "@/store/slices/dashboardUiSlice";

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    dashboardUi: dashboardUiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
