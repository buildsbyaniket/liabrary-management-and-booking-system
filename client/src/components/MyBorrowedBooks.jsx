import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopUp } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import Header from "../layout/Header";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  useEffect(() => {
    dispatch(fetchAllBooks());

    if (isAuthenticated) {
      dispatch(fetchUserBorrowedBooks());
    }
  }, [dispatch, isAuthenticated]);

  const openReadPopup = (id) => {
    const book = books?.find((book) => book._id === id);
    if (!book) return;
    setReadBook(book);
    dispatch(toggleReadBookPopUp());
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const [filter, setFilter] = useState("returned");

  const returnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returnDate !== null;
  });

  const nonReturnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returnDate === null;
  });

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="min-h-screen bg-gray-100 p-6 pt-28">
        <Header />

        {/* TITLE */}
        <header className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Borrowed Books
          </h2>
        </header>

        {/* FILTER BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          <button
            onClick={() => setFilter("returned")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300
            shadow-sm hover:shadow-md hover:-translate-y-0.5
            ${
              filter === "returned"
                ? "bg-[#0f172a] text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Returned Books
          </button>

          <button
            onClick={() => setFilter("nonReturned")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300
            shadow-sm hover:shadow-md hover:-translate-y-0.5
            ${
              filter === "nonReturned"
                ? "bg-[#0f172a] text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Non-Returned Books
          </button>

        </div>

        {/* TABLE */}
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeScale">

            <div className="overflow-x-auto">
              <table className="min-w-full">

                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Book Title</th>
                    <th className="px-6 py-3 text-left">Borrowed</th>
                    <th className="px-6 py-3 text-left">Due Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-center">View</th>
                  </tr>
                </thead>

                <tbody>
                  {booksToDisplay.map((book, index) => (
                    <tr
                      key={book._id || index}
                      className="border-t hover:bg-gray-50 hover:scale-[1.01] transition-all duration-300 animate-rowFade"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-3 text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-6 py-3 font-medium text-gray-800">
                        {books?.find((b) => b._id === book.book)?.title}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {formatDate(book.borrowDate)}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {formatDate(book.dueDate)}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium
                          ${
                            book.returnDate
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {book.returnDate ? "Returned" : "Pending"}
                        </span>
                      </td>

                      {/* VIEW */}
                      <td className="px-6 py-3 text-center">
                        <BookA
                          onClick={() => openReadPopup(book.book)}
                          className="cursor-pointer hover:text-blue-600 hover:scale-110 transition"
                        />
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        ) : (
          <h3 className="text-lg mt-6 text-gray-500">
            No {filter === "returned" ? "returned" : "non-returned"} books found
          </h3>
        )}
      </main>
    </>
  );
};

export default MyBorrowedBooks;