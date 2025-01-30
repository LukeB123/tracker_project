import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  TProjectDetailsProps,
  getProject,
  getProjects,
} from "@/server/util/projects";

interface ProjcetsState {
  allProjects: TProjectDetailsProps[];
  currentProject: TProjectDetailsProps | null;
}

const initialProjectsSlice: ProjcetsState = {
  allProjects: [],
  currentProject: null,
};

// export const fetchProjects = createAsyncThunk(
//   "projects/fetchProjects",
//   async () => {
//     const response = await getProjects();
//     return response;
//   }
// );

// export const fetchProject = createAsyncThunk(
//   "projects/fetchProject",
//   async (slug: string) => {
//     const response = await getProject(slug);
//     return response;
//   }
// );

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialProjectsSlice,
  reducers: {
    setAllProjects(state, action) {
      state.allProjects = action.payload;
    },
    addProject(state, action) {
      state.allProjects.push(action.payload);
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchProjects.fulfilled, (state, action) => {
  //       state.allProjects = action.payload;
  //     })
  //     .addCase(fetchProject.fulfilled, (state, action) => {
  //       state.currentProject = action.payload;
  //     });
  // },
});

export const projectsActions = projectsSlice.actions;

export default projectsSlice.reducer;
