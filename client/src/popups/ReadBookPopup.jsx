import React from "react";
import { useDispatch } from "react-redux";
import { toggleReadBookPopUp } from "../store/slices/popUpSlice";

const ReadBookPopup = ({ book }) => {

  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">

      {/* CARD */}
      <div className="w-[90%] sm:w-[500px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* HEADER */}
        <div className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Book Details</h2>

          <button
            onClick={() => dispatch(toggleReadBookPopUp())}
            className="text-xl hover:rotate-90 transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">

          {/* TITLE */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Title</p>
            <div className="px-4 py-3 rounded-xl bg-[#eef1f5] text-gray-800 font-medium">
              {book?.title || "N/A"}
            </div>
          </div>

          {/* AUTHOR */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Author</p>
            <div className="px-4 py-3 rounded-xl bg-[#eef1f5] text-gray-800">
              {book?.author || "N/A"}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <div className="px-4 py-3 rounded-xl bg-[#eef1f5] text-gray-700 leading-relaxed max-h-[150px] overflow-y-auto">
              {book?.description || "No description available"}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 bg-[#f1f5f9]">
          <button
            onClick={() => dispatch(toggleReadBookPopUp())}
            className="px-5 py-2 rounded-xl bg-[#0f172a] text-white
            hover:scale-[1.05] hover:shadow-md transition duration-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReadBookPopup;