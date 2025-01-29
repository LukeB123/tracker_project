import { createSlice } from "@reduxjs/toolkit";

interface ProjcetsState {
  formStatusIsPending: boolean;
}

const initialformSatusSlice: ProjcetsState = {
  formStatusIsPending: false,
};

const formSatusSlice = createSlice({
  name: "formSatus",
  initialState: initialformSatusSlice,
  reducers: {
    setFormSatusIsPending(state, action) {
      state.formStatusIsPending = action.payload;
    },
  },
});

export const formSatusActions = formSatusSlice.actions;

export default formSatusSlice.reducer;
