import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopUp } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);

    dispatch(addBook(formData));
    dispatch(fetchAllBooks());
    dispatch(toggleAddBookPopUp());
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">

      {/* CARD */}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Add New Book
          </h3>

          <button
            onClick={() => dispatch(toggleAddBookPopUp())}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleAddBook} className="space-y-4">

          {/* TITLE */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book Title"
            className="w-full px-4 py-3 rounded-xl bg-[#eef1f5] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            required
          />

          {/* AUTHOR */}
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author Name"
            className="w-full px-4 py-3 rounded-xl bg-[#eef1f5] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            required
          />

          {/* PRICE + QUANTITY */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full px-4 py-3 rounded-xl bg-[#eef1f5] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
              required
            />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-full px-4 py-3 rounded-xl bg-[#eef1f5] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Book Description..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#eef1f5] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
          />

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopUp())}
              className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#0f172a] text-white font-medium
              hover:scale-[1.05] hover:shadow-lg transition duration-300"
            >
              Add Book
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;