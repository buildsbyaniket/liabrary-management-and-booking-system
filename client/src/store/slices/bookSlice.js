import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toggleAddBookPopUp } from "./popUpSlice";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addBooksSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetBookSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// FETCH BOOKS
export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());

  try {
    const res = await api.get("/book/all");
    dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
  } catch (err) {
    dispatch(
      bookSlice.actions.fetchBooksFailed(
        err.response?.data?.message || "Error"
      )
    );
  }
};

// ADD BOOK
export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBooksRequest());

  try {
    const res = await api.post("/book/admin/add", data);
    dispatch(bookSlice.actions.addBooksSuccess(res.data.message));
    dispatch(toggleAddBookPopUp());
  } catch (err) {
    dispatch(
      bookSlice.actions.addBooksFailed(
        err.response?.data?.message || "Error"
      )
    );
  }
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;