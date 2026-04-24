import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const decodedEmail = email ? decodeURIComponent(email) : null;

  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, message, loading } = useSelector((state) => state.auth || {});

  const handleOtpVerification = (e) => {
    e.preventDefault();

    if (!decodedEmail) {
      toast.error("Invalid OTP route");
      return;
    }

    if (!otp || otp.length !== 5) {
      toast.error("Enter valid 5-digit OTP");
      return;
    }

    dispatch(otpVerification(decodedEmail, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigate("/");
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch, navigate]);

  if (!decodedEmail) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Invalid OTP Route
      </div>
    );
  }

  return (
    <>
      {/* SAME 3D BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>
        <div className="absolute w-[250px] h-[250px] bg-gray-500 opacity-20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2"></div>
      </div>

      <div className="flex flex-col md:flex-row h-screen relative">

        {/* LEFT SIDE (same style as register) */}
        <div className="hidden w-full md:w-1/2 bg-black/40 backdrop-blur-xl text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px] border-r border-gray-800">

          <div className="flex flex-col items-center h-[376px]">

            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="logo" className="h-44 w-auto"/>
            </div>

            <p className="text-gray-300 mb-12">
              Didn’t receive OTP? Try again.
            </p>

            <Link
              to="/register"
              className="border border-gray-500 rounded-xl font-semibold py-2 px-10
              bg-gray-900 text-white
              hover:bg-white hover:text-black
              transition-all duration-300
              shadow-lg hover:shadow-white/20
              hover:scale-105"
            >
              BACK TO REGISTER
            </Link>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">

          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl">

            <div className="flex justify-center mb-10">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
                <h3 className="font-medium text-4xl text-white">Verify OTP</h3>
                <img src={logo} alt="logo" className="h-24 w-24"/>
              </div>
            </div>

            <p className="text-gray-300 text-center mb-10">
              Enter the 5-digit code sent to your email
            </p>

            <form onSubmit={handleOtpVerification}>

              <input
                type="text"
                maxLength={5}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 mb-4
                bg-black/40 text-white
                border border-gray-600
                rounded-xl
                text-center tracking-widest text-xl
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-3
                bg-gradient-to-r from-gray-800 to-black
                text-white font-semibold
                rounded-xl
                border border-gray-600
                shadow-lg
                hover:scale-105 hover:shadow-purple-500/30
                active:scale-95
                transition-all duration-300"
              >
                {loading ? "Verifying..." : "VERIFY"}
              </button>

            </form>

          </div>

        </div>

      </div>
    </>
  );
};

export default OTP;