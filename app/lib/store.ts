import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/ui/uiSlice";
import projectsReducer from "./features/project/projectsSlice";
import resourcesReducer from "./features/resources/resourcesSlice";
import formStatusReducer from "./features/formStatus/formStatusSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      projects: projectsReducer,
      resources: resourcesReducer,
      formStatus: formStatusReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
