import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate(`/otp-verification/${email}`);
      dispatch(resetAuthSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error, message, dispatch, navigate]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef1f5] px-4">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-white p-10 flex flex-col justify-center">

          <div className="flex justify-center mb-6">
            <img src={logo} alt="logo" className="h-16 opacity-80" />
          </div>

          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
            Forgot Password
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Enter your email to reset your password
          </p>

          <form onSubmit={handleForgotPassword}>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-3 mb-5 rounded-xl bg-[#eef1f5] focus:outline-none focus:ring-2 focus:ring-[#1e293b]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0f172a] text-white font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>

          </form>

          <p className="text-center text-gray-500 mt-6">
            Remember password?{" "}
            <Link to="/login" className="font-semibold text-[#0f172a] hover:underline">
              Login
            </Link>
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex bg-[#0f172a] text-white flex-col items-center justify-center p-10">

          <img
            src={logo_with_title}
            alt="logo"
            className="h-40 mb-6 drop-shadow-lg"
          />

          <p className="text-gray-300 text-center mb-6">
            Modern Library Management System
          </p>

          <Link
            to="/register"
            className="px-8 py-3 border border-white rounded-xl
            hover:bg-white hover:text-black transition duration-300"
          >
            SIGN UP
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;