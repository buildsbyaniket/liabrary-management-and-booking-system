import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import SideBar from "../layout/SideBar";

import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user } = useSelector((state) => state.auth);

  let Component = null;

  switch (selectedComponent) {
    case "Dashboard":
      Component =
        user?.role?.toLowerCase() === "user"
          ? UserDashboard
          : AdminDashboard;
      break;

    case "Books":
      Component = BookManagement;
      break;

    case "Catalog":
      if (user?.role?.toLowerCase() === "admin") Component = Catalog;
      break;

    case "Users":
      if (user?.role?.toLowerCase() === "admin") Component = Users;
      break;

    case "My Borrowed Books":
      if (user?.role?.toLowerCase() === "user") Component = MyBorrowedBooks;
      break;

    default:
      Component = null;
  }

  return (
  <div className="flex min-h-screen bg-gray-100">

    {/* Sidebar */}
    <SideBar
      isSideBarOpen={isSideBarOpen}
      setIsSideBarOpen={setIsSideBarOpen}
      setSelectedComponent={setSelectedComponent}
    />

    {/* Main Content */}
    <div className="flex-1 md:ml-64 p-6 transition-all duration-300">
      {/* Mobile Menu */}
      <div className="md:hidden mb-4 flex justify-end">
        <div className="bg-black rounded-md h-9 w-9 flex items-center justify-center text-white">
          <GiHamburgerMenu
            className="text-xl cursor-pointer"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>
      </div>

      {typeof Component === "function" ? (
        <Component />
      ) : (
        <h1>No Component Selected</h1>
      )}
    </div>

  </div>
);
};

export default Home;