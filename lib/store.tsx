import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui";
import projectsReducer from "./projects";
import formStatusReducer from "./formStatus";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      projects: projectsReducer,
      formStatus: formStatusReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
