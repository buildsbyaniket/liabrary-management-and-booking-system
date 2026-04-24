import { BookA, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  toggleAddBookPopUp,
  toggleReadBookPopUp,
  toggleRecordBookPopUp,
} from "../store/slices/popUpSlice";

import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";

import {
  resetBookSlice,
  fetchAllBooks,
} from "../store/slices/bookSlice";

import { toast } from "react-toastify";
import Header from "../layout/Header";

import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup"; // ✅ FIXED PATH

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector(
    (state) => state.book
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const {
    addBookPopUp,
    readBookPopUp,
    recordBookPopUp,
  } = useSelector((state) => state.popup);

  const {
    loading: borrowSliceLoading,
    error: borrowSliceerror,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopUp());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopUp());
  };

  // INITIAL LOAD
  useEffect(() => {
    dispatch(fetchAllBooks());

    if (user?.role?.toLowerCase() === "admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, user]);

  // REFRESH AFTER ACTION + ERROR
  useEffect(() => {
    if (message || borrowSliceMessage) {
      dispatch(fetchAllBooks());

      if (user?.role?.toLowerCase() === "admin") {
        dispatch(fetchAllBorrowedBooks());
      }

      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error || borrowSliceerror) {
      toast.error(error || borrowSliceerror);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, borrowSliceerror, borrowSliceMessage, user]);

  // SEARCH
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const searchedBooks = (books || []).filter((book) => {
    return book?.title?.toLowerCase().includes(searchedKeyword);
  });

  return (
    <>
      <main className="min-h-screen bg-gray-100 p-6 pt-28">
        <Header />

        {/* HEADER */}
        <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">

          <h2 className="text-2xl font-semibold text-gray-800">
            {user && user.role?.toLowerCase() === "admin"
              ? "Book Management"
              : "Books"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">

            {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopUp())}
                className="flex items-center justify-center gap-2 px-5 py-2
                bg-[#0f172a] text-white rounded-xl
                shadow-md hover:shadow-lg hover:-translate-y-0.5
                active:scale-95 transition-all duration-300"
              >
                <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center text-sm">
                  +
                </span>
                Add Book
              </button>
            )}

            <input
              type="text"
              placeholder="Search books..."
              value={searchedKeyword}
              onChange={handleSearch}
              className="px-4 py-2 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-gray-800
              focus:scale-[1.02]
              bg-white shadow-sm w-full sm:w-64 transition-all duration-200"
            />

          </div>
        </header>

        {/* TABLE */}
        {searchedBooks && searchedBooks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeInUp">

            <div className="overflow-x-auto">
              <table className="min-w-full">

                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Author</th>

                    {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
                      <th className="px-6 py-3 text-left">Quantity</th>
                    )}

                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Status</th>

                    {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
                      <th className="px-6 py-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {searchedBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className="border-t hover:bg-gray-50 hover:scale-[1.01] transition-all duration-300 animate-row"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-3 text-gray-600">{index + 1}</td>

                      <td className="px-6 py-3 font-medium text-gray-800">
                        {book.title}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {book.author}
                      </td>

                      {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
                        <td className="px-6 py-3 text-gray-600">
                          {book.quantity}
                        </td>
                      )}

                      <td className="px-6 py-3 text-gray-800 font-medium">
                        ${book.price}
                      </td>

                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium
                          ${
                            book?.availability
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {book?.availability ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
                        <td className="px-6 py-3 flex justify-center gap-4">

                          <BookA
                            className="cursor-pointer text-gray-600 hover:text-blue-500 hover:scale-110 transition"
                            onClick={() => openReadPopup(book._id)}
                          />

                          <NotebookPen
                            className="cursor-pointer text-gray-600 hover:text-green-500 hover:scale-110 transition"
                            onClick={() => openRecordBookPopup(book._id)}
                          />

                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        ) : (
          <h3 className="text-xl mt-6 text-gray-500">
            No books found in library
          </h3>
        )}
      </main>

      {/* POPUPS */}
      {addBookPopUp && <AddBookPopup />}
      {readBookPopUp && <ReadBookPopup book={readBook} />}
      {recordBookPopUp && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;