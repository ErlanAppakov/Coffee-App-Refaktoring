import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  isOpen: boolean;
}

const initialState: SearchState = {
  isOpen: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    openSearch: (state) => {
      state.isOpen = true;
    },
    closeSearch: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openSearch, closeSearch } = searchSlice.actions;
export default searchSlice.reducer;

