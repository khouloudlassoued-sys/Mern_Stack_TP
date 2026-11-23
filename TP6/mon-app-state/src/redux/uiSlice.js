import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { message: '', visible: false },
  reducers: {
    // payload = le texte à afficher
    showToast: (state, action) => {
      state.message = action.payload;
      state.visible = true;
    },
    hideToast: (state) => {
      state.message = '';
      state.visible = false;
    }
  }
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;