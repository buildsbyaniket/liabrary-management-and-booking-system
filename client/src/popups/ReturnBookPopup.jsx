import React from "react";
import { useDispatch } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopUp } from "../store/slices/popUpSlice";

const ReturnBookPopup = ({ bookId, email }) => {
    const dispatch = useDispatch();

    const handleReturnBook = (e) => {
        e.preventDefault();

        dispatch(returnBook(email, bookId));   // ✅ FIXED ORDER
        dispatch(toggleReturnBookPopUp());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="w-full bg-white rounded-lg shadow-lg sm:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Return Book</h3>

            <form onSubmit={handleReturnBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">User Email</label>
                <input 
                  type="email"
                  defaultValue={email}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  disabled
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => dispatch(toggleReturnBookPopUp())}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Close
                </button>

                <button 
                  type="submit"
                  className="px-4 bg-black text-white rounded-md"
                >
                  Return
                </button>
              </div>

            </form>
          </div>
          </div>
        </div>
    );
};

export default ReturnBookPopup;