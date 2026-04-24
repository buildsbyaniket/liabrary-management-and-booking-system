import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { register as registerUser, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { error, message, isAuthenticated } = useSelector(
    (state) => state.auth || {}
  );

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      toast.error("Password must be 8-16 characters");
      return;
    }

    dispatch(registerUser({ name, email, password }, navigateTo, email));
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

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

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

          {/* LEFT PANEL */}
          <div className="hidden md:flex w-1/2 bg-[#0f172a]/95 backdrop-blur-xl text-white flex-col items-center justify-center p-8 border-r border-gray-800">

            <div className="flex flex-col items-center justify-center h-[376px]">

              <div className="flex justify-center mb-12">
                <img src={logo_with_title} alt="logo" className="h-40 w-auto"/>
              </div>

              <p className="text-gray-300 mb-8 text-center">
                Already have account? Sign in now.
              </p>

              <Link
                to={"/login"}
                className="border border-gray-400 rounded-xl font-semibold py-2 px-10
                hover:bg-white hover:text-black
                transition-all duration-300
                shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                SIGN IN
              </Link>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white animate-fadeInUp">

            <div className="w-full max-w-sm bg-white border border-gray-200 p-8 rounded-2xl shadow-lg">

              {/* 3D LOGO HEADER */}
              <div className="flex justify-center mb-8">
                <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4">

                  <h3 className="font-semibold text-3xl text-gray-800">
                    Sign Up
                  </h3>

                  <div className="animate-logo3d logo-hover">
                    <img
                      src={logo}
                      alt="logo"
                      className="h-20 w-20 drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
                    />
                  </div>

                </div>
              </div>

              <p className="text-gray-500 text-center mb-8">
                Please provide your information to sign up.
              </p>

              <form onSubmit={handleRegister}>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 mb-3
                  bg-gray-50 text-gray-800
                  border border-gray-300
                  rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-gray-800
                  transition"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 mb-3
                  bg-gray-50 text-gray-800
                  border border-gray-300
                  rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-gray-800
                  transition"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 mb-4
                  bg-gray-50 text-gray-800
                  border border-gray-300
                  rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-gray-800
                  transition"
                />

                <button
                  type="submit"
                  className="w-full py-3 mt-3
                  bg-[#0f172a]
                  text-white font-semibold
                  rounded-xl
                  shadow-md
                  hover:bg-black
                  hover:shadow-xl hover:-translate-y-1
                  active:scale-95
                  transition-all duration-300"
                >
                  SIGN UP
                </button>

              </form>

              {/* MOBILE SIGN IN */}
              <div className="md:hidden text-center mt-6">
                <p className="text-gray-500 text-sm mb-2">
                  Already have an account?
                </p>
                <Link to="/login" className="text-black font-semibold">
                  Sign In
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Register;