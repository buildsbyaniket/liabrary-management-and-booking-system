import React, { useEffect, useState, useRef } from "react";
import bookIcon from "../assets/book-square.png";
import Header from "../layout/Header";
import logo_with_title from "../assets/logo-with-title-black.png";
import logo from "../assets/logo-with-title.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";

import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

import { useSelector, useDispatch } from "react-redux";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import api from "../api/axios"; // ✅ ADD THIS

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const { userBorrowedBooks = [] } = useSelector((state) => state.borrow);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    const borrowed = userBorrowedBooks.filter(
      (book) => book.returnDate === null
    );

    const returned = userBorrowedBooks.filter(
      (book) => book.returnDate !== null
    );

    setTotalBorrowedBooks(borrowed.length);
    setTotalReturnedBooks(returned.length);
  }, [userBorrowedBooks]);

  const hasData = totalBorrowedBooks + totalReturnedBooks > 0;

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("name", user?.name || "");

      // ✅ FIXED (ONLY axios, no fetch, no duplicate data)
      const { data } = await api.put("/auth/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        dispatch(fetchUserBorrowedBooks());
        window.location.reload();
      } else {
        console.log("UPLOAD FAILED:", data.message);
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#e9edf2] pt-24 px-4 sm:px-6">
      <Header />

      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 flex flex-col gap-6">

          <div className="flex items-center gap-4 bg-[#f4f6f9] border border-[#e2e6ea] p-5 rounded-xl shadow-sm">

            <img
              src={
                user?.avatar?.url ||
                "https://www.gravatar.com/avatar/?d=mp"
              }
              className="w-12 h-12 rounded-full object-cover border cursor-pointer hover:opacity-80"
              alt="profile"
              onClick={handleImageClick}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div>
              <p className="text-gray-700 font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex items-center gap-4 bg-[#f4f6f9] border border-[#e2e6ea] p-5 rounded-xl shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center bg-[#e2e6ea] rounded-md">
                <img src={bookIcon} className="w-5 h-5 opacity-70" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Borrowed Books</p>
                <p className="text-lg font-semibold text-gray-700">
                  {totalBorrowedBooks}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#f4f6f9] border border-[#e2e6ea] p-5 rounded-xl shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center bg-[#e2e6ea] rounded-md">
                <img src={returnIcon} className="w-5 h-5 opacity-70" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Returned Books</p>
                <p className="text-lg font-semibold text-gray-700">
                  {totalReturnedBooks}
                </p>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between bg-[#f4f6f9] border border-[#e2e6ea] p-5 rounded-xl shadow-sm">

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#e2e6ea] rounded-md">
                <img src={browseIcon} className="w-5 h-5 opacity-70" />
              </div>
              <p className="text-gray-600">
                Let's browse books inventory
              </p>
            </div>

            <img
              src={logo_with_title}
              alt="logo"
              className="w-[150px] opacity-60"
            />
          </div>

          <div className="bg-[#f4f6f9] border border-[#e2e6ea] rounded-xl shadow-sm min-h-[220px] flex items-center justify-center relative">
            <p className="text-gray-400">No activity yet</p>

            <p className="absolute bottom-3 right-6 text-gray-500 text-sm">
              ~ VidyaVault
            </p>
          </div>

        </div>

        <div className="flex flex-col items-center gap-6">

          <div className="w-full max-w-[320px] h-[320px] bg-[#f4f6f9] border border-[#e2e6ea] rounded-xl shadow-sm p-4">
            {hasData ? (
              <Pie
                data={{
                  labels: ["Borrowed", "Returned"],
                  datasets: [
                    {
                      data: [totalBorrowedBooks, totalReturnedBooks],
                      backgroundColor: ["#2f3a4a", "#8a97a8"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              <p className="text-gray-400 text-center mt-20">
                No chart data available
              </p>
            )}
          </div>

          <div className="flex items-center p-5 w-full max-w-[320px] bg-[#f4f6f9] border border-[#e2e6ea] rounded-xl shadow-sm gap-4">

            <img src={logo} alt="logo" className="w-10 h-10 opacity-70" />

            <span className="w-[2px] bg-[#d1d5db] h-10"></span>

            <div className="flex flex-col gap-2 text-sm text-gray-600">

              <p className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2f3a4a]"></span>
                Borrowed Books
              </p>

              <p className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8a97a8]"></span>
                Returned Books
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default UserDashboard;