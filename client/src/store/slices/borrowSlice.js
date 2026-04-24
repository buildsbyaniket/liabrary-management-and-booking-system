import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toggleAddBookPopUp } from "./popUpSlice";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    message: null,

    userBorrowedBooks: [],
    allBorrowedBooks: [],
  },

  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    recordBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBooksSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    returnBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBooksSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// GET USER BOOKS
export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());

  try {
    const res = await api.get("/borrow/my-borrowed-books");

    console.log("FETCH USER BOOKS:", res.data); // ✅ DEBUG

    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksSuccess(
        res.data.borrowedBooks || res.data.borrowBooks || []
      )
    );
  } catch (err) {
    console.log("FETCH ERROR:", err.response?.data); // ✅ DEBUG

    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksFailed(
        err.response?.data?.message || "Error"
      )
    );
  }
};

// GET ALL BORROWED
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());

  try {
    const res = await api.get("/borrow/admin/borrowed-books");

    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksSuccess(
        res.data.borrowBooks
      )
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksFailed(
        err.response?.data?.message || "Error"
      )
    );
  }
};

// BORROW BOOK
export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBooksRequest());

  try {
    console.log("API CALL:", email, id); // ✅ DEBUG

    const res = await api.post(
      `/borrow/borrow/${id}`,
      { email }
    );

    console.log("API SUCCESS:", res.data); // ✅ DEBUG

    dispatch(borrowSlice.actions.recordBooksSuccess(res.data.message));
    dispatch(toggleAddBookPopUp());
  } catch (err) {
    console.log("API ERROR:", err.response?.data); // ✅ DEBUG

    dispatch(
      borrowSlice.actions.recordBooksFailed(
        err.response?.data?.message || "Error"
      )
    );
  }
};

// RETURN BOOK
export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBooksRequest());

  try {
    const res = await api.put(
      `/borrow/return/${id}`,
      { email }
    );

    dispatch(borrowSlice.actions.returnBooksSuccess(res.data.message));
  } catch (err) {
    dispatch(
      borrowSlice.actions.returnBooksFailed(
        err.response?.data?.message || "Error"
      )
    );
  }
};

// RESET
export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;