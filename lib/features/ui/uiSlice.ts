import { createSlice } from "@reduxjs/toolkit";

export interface TNotificationState {
  status: "error" | "neutral" | "success";
  title: string;
  message: string;
}

interface UiState {
  notification: TNotificationState | null;
}

const initialUiSlice: UiState = { notification: null };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiSlice,
  reducers: {
    showNotification(state, action) {
      state.notification = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
