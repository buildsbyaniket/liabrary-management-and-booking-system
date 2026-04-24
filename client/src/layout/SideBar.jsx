import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import userIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {
  toggleAddNewAdminPopUp,
  toggleSettingPopUp,
} from "../store/slices/popUpSlice";
import { useNavigate } from "react-router-dom";
import SettingPopUp from "../popups/SettingPopup";
import AddNewAdmin from "../popups/AddNewAdmin";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addNewAdminPopUp, settingPopUp } = useSelector(
    (state) => state.popup
  );

  const { error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth || {}
  );

  // ✅ FIX: normalize role (prevents future bugs)
  const role = user?.role?.toLowerCase() || "";

  const handlelogout = () => {
    dispatch(logout()); // ❌ no need to await
    setSelectedComponent("Dashboard");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  return (
    <>
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-black via-gray-900 to-black text-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* LOGO */}
        <div className="px-6 py-6 border-b border-gray-800 flex justify-center">
          <img
            src={logo_with_title}
            alt="logo"
            className="h-20 object-contain"
          />
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          <button
            className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" className="w-5 h-5" />
            Dashboard
          </button>

          <button
            className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" className="w-5 h-5" />
            Book
          </button>

          {/* ✅ ADMIN */}
          {isAuthenticated && role === "admin" && (
            <>
              <div className="border-t border-gray-700 my-3"></div>

              <button
                className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" className="w-5 h-5" />
                Catalog
              </button>

              <button
                className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={userIcon} alt="icon" className="w-5 h-5" />
                Users
              </button>

              <button
                className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
                onClick={() => dispatch(toggleAddNewAdminPopUp())}
              >
                <RiAdminFill className="w-5 h-5" />
                Add Admin
              </button>
            </>
          )}

          {/* ✅ USER */}
          {isAuthenticated && role === "user" && (
            <>
              <div className="border-t border-gray-700 my-3"></div>

              <button
                className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
                onClick={() => setSelectedComponent("My Borrowed Books")}
              >
                <img src={catalogIcon} alt="icon" className="w-5 h-5" />
                My Books
              </button>
            </>
          )}

          <div className="border-t border-gray-700 my-3"></div>

          <button
            className="w-full py-3 px-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-3"
            onClick={() => dispatch(toggleSettingPopUp())}
          >
            <img src={settingIcon} alt="icon" className="w-5 h-5" />
            Settings
          </button>
        </nav>

        {/* LOGOUT */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-800">
          <button
            onClick={handlelogout}
            className="w-full py-2 sm:py-3 rounded-xl 
            bg-gray-800 hover:bg-gray-700 
            text-white
            transition-all duration-200 
            flex items-center justify-center gap-3
            hover:scale-[1.02] active:scale-95"
          >
            <img src={logoutIcon} alt="icon" className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* CLOSE BUTTON */}
        <img
          src={closeIcon}
          alt="close"
          onClick={() => setIsSideBarOpen(false)}
          className="h-6 w-6 absolute top-4 right-4 cursor-pointer hover:scale-110 transition"
        />
      </aside>

      {/* OPEN BUTTON */}
      {!isSideBarOpen && (
        <button
          onClick={() => setIsSideBarOpen(true)}
          className="fixed top-20 right-5 z-[60] flex items-center gap-2
          bg-white/90 backdrop-blur-md text-gray-800
          border border-gray-200
          px-4 py-2 rounded-2xl shadow-lg
          hover:bg-white hover:shadow-xl hover:-translate-y-0.5
          active:scale-95 transition-all duration-200"
        >
          <span className="text-lg">☰</span>
        </button>
      )}

      {/* POPUPS */}
      {addNewAdminPopUp && <AddNewAdmin />}
      {settingPopUp && <SettingPopUp />}
    </>
  );
};

export default SideBar;