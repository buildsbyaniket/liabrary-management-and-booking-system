import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopUp } from "../store/slices/popUpSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { toast } from "react-toastify";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopUp } = useSelector((state) => state.popup);
  const { books } = useSelector((state) => state.book);

  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  const currentDate = new Date();

  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overdueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay =
    filter === "borrowed" ? borrowedBooks : overdueBooks;

  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopUp());
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error]);

  return (
    <>
      <main className="min-h-screen bg-gray-100 p-6 pt-28">
        <Header />

        {/* FILTER BUTTONS */}
        <header className="flex flex-col gap-4 sm:flex-row mb-6">

          <button
            onClick={() => setFilter("borrowed")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300
            shadow-sm hover:shadow-md hover:-translate-y-0.5
            ${
              filter === "borrowed"
                ? "bg-[#0f172a] text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Borrowed Books
          </button>

          <button
            onClick={() => setFilter("overdue")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300
            shadow-sm hover:shadow-md hover:-translate-y-0.5
            ${
              filter === "overdue"
                ? "bg-[#0f172a] text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Overdue Borrowers
          </button>

        </header>

        {/* TABLE */}
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-scaleIn">

            <div className="overflow-x-auto">
              <table className="min-w-full">

                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Book</th>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Borrow Date</th>
                    <th className="px-6 py-3 text-left">Due Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {booksToDisplay.map((book, index) => (
                    <tr
                      key={book._id || index}
                      className="border-t hover:bg-gray-50 transition-all duration-300 hover:scale-[1.01] animate-rowFade"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <td className="px-6 py-3 text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-6 py-3 font-medium text-gray-800">
                        {books?.find((b) => b._id === book.book)?.title}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {book?.user?.name}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {book?.user?.email}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {formatDate(book.borrowDate)}
                      </td>

                      <td className="px-6 py-3 text-gray-600">
                        {formatDate(book.dueDate)}
                      </td>

                      <td className="px-6 py-3">
                        {book.returnDate ? (
                          <FaSquareCheck className="w-6 h-6 text-green-500 animate-popIn" />
                        ) : (
                          <PiKeyReturnBold
                            onClick={() =>
                              openReturnBookPopup(book.book, book?.user?.email)
                            }
                            className="w-6 h-6 cursor-pointer text-red-500 hover:scale-110 transition"
                          />
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        ) : (
          <h3 className="text-xl mt-6 text-gray-500">
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found!!
          </h3>
        )}
      </main>

      {returnBookPopUp && (
        <ReturnBookPopup bookId={borrowedBookId} email={email} />
      )}
    </>
  );
};

export default Catalog;