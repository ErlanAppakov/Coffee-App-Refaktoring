import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  type: string | null;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
    },
    toggleModalType: (state) => {
      state.type = state.type === "register" ? "login" : "register";
    },
  },
});

export const { openModal, closeModal, toggleModalType } = modalSlice.actions;
export default modalSlice.reducer;

