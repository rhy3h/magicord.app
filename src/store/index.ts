import { configureStore } from "@reduxjs/toolkit";
import discordReducer from "./namespace/discordSlice";
import dbReducer from "./namespace/databaseSlice";

export const store = configureStore({
  reducer: {
    discord: discordReducer,
    database: dbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
