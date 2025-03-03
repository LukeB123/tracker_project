import { createSlice } from "@reduxjs/toolkit";

import { TResourceProps } from "@/server/actions/data-fetches";

interface ProjcetsState {
  allResources: TResourceProps[];
  currentResource: TResourceProps | null;
}

const initialResourcesSlice: ProjcetsState = {
  allResources: [],
  currentResource: null,
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState: initialResourcesSlice,
  reducers: {
    setAllResources(state, action) {
      state.allResources = action.payload;
    },
    addResource(state, action) {
      state.allResources.push(action.payload);
    },
    setCurrentResource(state, action) {
      state.currentResource = action.payload;
    },
  },
});

export const resourcesActions = resourcesSlice.actions;

export default resourcesSlice.reducer;
