import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addnewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopUp } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(placeHolder);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    dispatch(addnewAdmin(formData));
  };

 return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-[#f9fafb] rounded-2xl shadow-2xl border border-gray-200">
        
        <div className="p-6">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-3">
              <img
                src={keyIcon}
                alt="key-icon"
                className="bg-[#e5e7eb] p-3 rounded-xl w-12 h-12"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Admin
              </h3>
            </div>

            <img
              src={closeIcon}
              alt="close"
              className="w-6 h-6 cursor-pointer hover:scale-110 transition"
              onClick={() => dispatch(toggleAddNewAdminPopUp())}
            />
          </div>

          {/* FORM */}
          <form onSubmit={handleAddNewAdmin}>
            
            {/* AVATAR */}
            <div className="flex flex-col items-center mb-6">
              <label htmlFor="avatarInput" className="cursor-pointer group">
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 group-hover:border-[#0f172a] transition"
                />
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Click to upload avatar
              </p>
            </div>

            {/* NAME */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-[#0f172a] focus:outline-none transition"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-[#0f172a] focus:outline-none transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-[#0f172a] focus:outline-none transition"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              
              <button
                type="button"
                onClick={() => dispatch(toggleAddNewAdminPopUp())}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 
                hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-[#0f172a] text-white 
                hover:bg-[#1e293b] transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Admin"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewAdmin;