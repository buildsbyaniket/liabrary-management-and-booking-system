import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png";
import { toggleSettingPopUp } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const SettingPopUp = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // ✅ FIXED

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleUpdatePassword = (e) => {
  e.preventDefault();

  if (loading) return; // ✅ prevent duplicate call

  if (
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !confirmNewPassword.trim()
  ) {
    return toast.error("All fields are required");
  }

  if (newPassword !== confirmNewPassword) {
    return toast.error("Passwords do not match");
  }

  dispatch(
    updatePassword({
      currentPassword,
      newPassword,
      confirmNewPassword,
    })
  );
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">

      {/* MODAL */}
      <div className="w-full sm:w-[420px] bg-white rounded-2xl shadow-2xl animate-modalFade">

        <div className="p-6">

          {/* HEADER */}
          <header className="flex justify-between items-center mb-6 border-b pb-4">

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-xl shadow-sm">
                <img
                  src={settingIcon}
                  alt="setting-icon"
                  className="w-6 h-6"
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Change Credentials
              </h3>
            </div>

            <img
              src={closeIcon}
              alt="close"
              className="w-6 h-6 cursor-pointer hover:scale-110 transition"
              onClick={() => dispatch(toggleSettingPopUp())}
            />
          </header>

          {/* FORM */}
          <form onSubmit={handleUpdatePassword} className="space-y-5">

            {/* CURRENT PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="px-4 py-2 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-black
                transition-all duration-200"
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="px-4 py-2 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-black
                transition-all duration-200"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className="px-4 py-2 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-black
                transition-all duration-200"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">

              <button
                type="button"
                onClick={() => dispatch(toggleSettingPopUp())}
                className="flex-1 py-2 rounded-xl bg-gray-200
                hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-[#0f172a] text-white
                hover:bg-black hover:scale-[1.02]
                active:scale-95 transition-all duration-300
                disabled:opacity-50"
              >
                {loading ? "Updating..." : "Confirm"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPopUp;