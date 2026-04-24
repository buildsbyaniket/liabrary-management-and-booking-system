import React from "react";
import { useDispatch } from "react-redux";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import { useState } from "react";
import { toggleRecordBookPopUp } from "../store/slices/popUpSlice";

const RecordBookPopup = ({bookId}) => {
  const dispatch = useDispatch()
  const [email , setEmail] = useState("");

  const handleRecordBook = async (e) => {
    e.preventDefault();

    console.log("Submitting:", email, bookId); // ✅ DEBUG

    if (!email || !bookId) {
      console.log("Missing email or bookId"); // ✅ DEBUG
      return;
    }

    try {
      await dispatch(recordBorrowBook(email, bookId)); // ✅ wait API
      console.log("Dispatch completed"); // ✅ DEBUG
      dispatch(toggleRecordBookPopUp()); // ✅ close after success
    } catch (err) {
      console.log("Dispatch error:", err); // ✅ DEBUG
    }
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="w-full bg-white rounded-lg shadow-lg sm:w-1/3">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Record Book</h3>
        <form onSubmit={handleRecordBook}>
          <div className="mb-4">
            <label className="block text-gray-900 font-medium">User Email</label>
            <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Borrower's Email"
            className="w-full px-4 py-2 border-2 border-black rounded-md" required />
          </div>
          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" type="button" onClick={() => {
              dispatch(toggleRecordBookPopUp());
            }}>Close</button>
            <button type="submit" className="px-4 bg-black text-white rounded-md hover:bg-gray-800">Record</button>
          </div>
        </form>
      </div>
      </div>
      </div>
   );
};

export default RecordBookPopup;