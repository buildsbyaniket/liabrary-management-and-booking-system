import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    dispatch(resetPassword(formData, token));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/login"); // ✅ fixed navigation
      dispatch(resetAuthSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error, message, dispatch, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen"> {/* ✅ fixed height */}
      
      {/* left section */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="h-44 w-auto" />
          </div>
          <h3 className="text-gray-300 text-3xl leading-relaxed"> {/* ✅ improved text */}
            Your premier digital library for borrowing and reading books
          </h3>
        </div>
      </div>

      {/* right section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        
        {/* Back Button */}
        <Link
          to={"/password/forgot"}
          className="absolute top-5 left-5 md:left-10 border-2 border-black rounded-3xl font-bold px-6 py-2 hover:bg-black hover:text-white transition"
        >
          Back
        </Link>

        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-10">
            <img src={logo} alt="logo" className="h-20 w-auto" />
          </div>

          <h1 className="text-3xl font-medium text-center mb-6"> {/* ✅ spacing fix */}
            Reset Password
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Please enter your new password {/* ✅ capitalization */}
          </p>

          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-black rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              required  // ✅ added missing required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-black rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-black bg-black text-white py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              {loading ? "Updating..." : "Reset Password"} {/* ✅ correct text */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;