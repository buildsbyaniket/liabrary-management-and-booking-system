import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {/* 3D BACKGROUND */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">

        {/* FLOATING BLOBS */}
        <div className="absolute w-72 h-72 bg-gray-300 rounded-full blur-3xl opacity-30 animate-float1 top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-gray-400 rounded-full blur-3xl opacity-30 animate-float2 bottom-10 right-10"></div>
        <div className="absolute w-60 h-60 bg-gray-200 rounded-full blur-3xl opacity-30 animate-float3 top-1/2 left-1/2"></div>

        <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-xl rounded-3xl overflow-hidden
        transform transition duration-500 hover:scale-[1.01]">

          {/* LEFT (LOGIN FORM) */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white animate-fadeInUp">

            <div className="max-w-sm w-full bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8">

              {/* 3D LOGO */}
              <div className="flex justify-center mb-6">
                <div className="animate-logo3d logo-hover">
                  <img
                    src={logo}
                    alt="logo"
                    className="h-16 w-16 drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
                  />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                Welcome Back
              </h1>

              <p className="text-gray-500 text-center mb-6">
                Login to continue your journey
              </p>

              <form onSubmit={handleLogin}>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl
                  bg-white text-gray-800
                  focus:ring-2 focus:ring-black outline-none transition"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl
                  bg-white text-gray-800
                  focus:ring-2 focus:ring-black outline-none transition"
                />

                <div className="text-right mb-3">
                  <Link to={"/password/forgot"} className="text-sm text-gray-500 hover:text-black">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full bg-[#0f172a] text-white py-3 rounded-xl font-semibold
                  shadow-md hover:bg-black hover:shadow-xl hover:-translate-y-1
                  active:scale-95 transition-all duration-300"
                >
                  Sign In
                </button>

              </form>

              <p className="text-center mt-6 text-gray-500">
                New user?{" "}
                <Link to={"/register"} className="text-black font-semibold hover:underline">
                  Sign up
                </Link>
              </p>

            </div>
          </div>

          {/* RIGHT (BRANDING PANEL) */}
          <div className="hidden md:flex w-1/2 bg-[#0f172a]/95 backdrop-blur-xl text-white items-center justify-center">

            <div className="text-center">

              <div className="animate-logo3d logo-hover mb-6">
                <img src={logo_with_title} className="h-36 mx-auto"/>
              </div>

              <p className="text-gray-300 mb-6">
                Modern Library Management System
              </p>

              <Link
                to="/register"
                className="px-10 py-3 border border-gray-400 rounded-xl
                hover:bg-white hover:text-black
                transition-all duration-300
                shadow-md hover:shadow-xl hover:-translate-y-1 inline-block"
              >
                SIGN UP
              </Link>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default Login;