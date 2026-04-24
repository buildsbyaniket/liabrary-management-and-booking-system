import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "./store/slices/userSlice";
import { getUser } from "./store/slices/authSlice";
import { fetchUserBorrowedBooks } from "./store/slices/borrowSlice";

const App = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
  if (!user) {
    dispatch(getUser());
  }
}, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role?.toLowerCase() === "user") {
        dispatch(fetchUserBorrowedBooks());
      }

      if (user.role?.toLowerCase() === "admin") {
        dispatch(fetchAllUsers());
      }
    }
  }, [isAuthenticated, user, dispatch]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Routes>

        {/* ✅ ROOT FIX → Always show REGISTER first */}
        <Route
          path="/"
          element={
            !isAuthenticated ? <Register /> : <Home />
          }
        />

        {/* ✅ LOGIN */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/" />
          }
        />

        {/* ✅ REGISTER */}
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/" />
          }
        />

        {/* OTHER ROUTES */}
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

      </Routes>

      <ToastContainer theme="dark" />
    </>
  );
};

export default App;