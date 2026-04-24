import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import logo from "../assets/logo-with-title.png";
import userIcon from "../assets/user.png";
import bookIcon from "../assets/book.png";
import adminIcon from "../assets/people.png";

import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";

import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { users = [], user } = useSelector((state) => state.user);
  const { books = [] } = useSelector((state) => state.book);
  const { allBorrowedBooks = [] } = useSelector((state) => state.borrow);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  /* FETCH */
  useEffect(() => {
    if (!user) return;

    const role = user.role?.toLowerCase();

    if (role === "admin") {
      dispatch(fetchAllUsers());
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
    } else {
      dispatch(fetchAllBooks());
    }
  }, [dispatch, user]);

  /* CALCULATIONS */
  useEffect(() => {
    const normalUsers = users.filter(
      (u) => u.role?.toLowerCase() === "user"
    );
    const admins = users.filter(
      (u) => u.role?.toLowerCase() === "admin"
    );

    setTotalUsers(normalUsers.length);
    setTotalAdmin(admins.length);
    setTotalBooks(books.length);

    const borrowed = allBorrowedBooks.filter(
      (b) => b.returnDate === null
    );
    const returned = allBorrowedBooks.filter(
      (b) => b.returnDate !== null
    );

    setTotalBorrowedBooks(borrowed.length);
    setTotalReturnedBooks(returned.length);
  }, [users, books, allBorrowedBooks]);

  const data = {
    labels: ["Borrowed", "Returned"],
    datasets: [
      {
        data:
          totalBorrowedBooks || totalReturnedBooks
            ? [totalBorrowedBooks, totalReturnedBooks]
            : [1, 1],
        backgroundColor: ["#1E293B", "#475569"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* PIE CARD */}
            <div className="bg-white rounded-xl shadow-sm p-5 flex justify-center items-center">
              <div className="w-52 h-52 sm:w-60 sm:h-60">
                <Pie
                  data={data}
                  options={{
                    plugins: {
                      legend: {
                        position: "top",
                        labels: { color: "#334155" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* LEGEND CARD */}
            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
              <img src={logo} className="w-14" />

              <div className="w-[2px] h-12 bg-slate-300"></div>

              <div className="text-sm text-slate-700 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-800 rounded-full"></span>
                  Borrowed Books
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
                  Returned Books
                </p>
              </div>
            </div>

          </div>

          {/* MIDDLE COLUMN */}
          <div className="flex flex-col gap-6">

            {/* CARD */}
            {[{
              icon: userIcon,
              value: totalUsers,
              label: "Total Users"
            },{
              icon: bookIcon,
              value: totalBooks,
              label: "Total Books"
            },{
              icon: adminIcon,
              value: totalAdmin,
              label: "Total Admins"
            }].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">

                <div className="bg-slate-200 p-3 rounded-lg">
                  <img src={item.icon} className="w-6 h-6" />
                </div>

                <div className="w-[2px] h-10 bg-slate-300"></div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {item.value}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {item.label}
                  </p>
                </div>

              </div>
            ))}

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* PROFILE */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <img
                src={user?.avatar?.url || userIcon}
                className="w-20 h-20 mx-auto rounded-full object-cover"
              />
              <h2 className="mt-3 font-semibold text-slate-800">
                {user?.name || "Admin"}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Control system operations and monitor analytics.
              </p>
            </div>

            {/* QUOTE */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6 hidden lg:flex flex-col justify-center min-h-[180px]">
              <p className="text-lg leading-relaxed">
                Reading strengthens thinking and decision making.
                Strong systems depend on strong users.
              </p>
              <span className="mt-4 text-sm text-slate-400 text-right">
                ~ VidyaVault
              </span>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;