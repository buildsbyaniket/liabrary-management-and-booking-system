import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user || {});

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const filteredUsers =
    users?.filter((u) => u.role === "User" || u.role === "Admin") || [];

  return (
    <>
      <div className="pt-20 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <main className="p-4 sm:p-6 pt-24">

          {/* HEADER */}
          <header className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Registered Users
            </h2>
          </header>

          {filteredUsers.length > 0 ? (
            <>
              {/* TABLE VIEW */}
              <div className="hidden md:block mt-6 bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeScale">

                <div className="overflow-x-auto">
                  <table className="min-w-full">

                    <thead className="bg-gray-100 text-gray-700 text-sm">
                      <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-center">Books</th>
                        <th className="px-6 py-3 text-center">Registered</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr
                          key={user._id}
                          className="border-t hover:bg-gray-50 hover:scale-[1.01] transition-all duration-300 animate-rowSlide"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="px-6 py-3 text-gray-600">
                            {index + 1}
                          </td>

                          <td className="px-6 py-3 font-medium text-gray-800">
                            {user.name}
                          </td>

                          <td className="px-6 py-3 text-gray-600 break-words">
                            {user.email}
                          </td>

                          <td className="px-6 py-3">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium
                              ${
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="px-6 py-3 text-center text-gray-700">
                            {user.borrowedBooks?.length || 0}
                          </td>

                          <td className="px-6 py-3 text-center text-gray-500 text-sm">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>

              {/* CARD VIEW */}
              <div className="md:hidden mt-6 space-y-4">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className="bg-white shadow-md rounded-xl p-4
                    animate-cardPop hover:shadow-lg transition duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      ID: {index + 1}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-600 break-words">
                      {user.email}
                    </p>

                    <div className="flex justify-between mt-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium
                        ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>

                      <span className="text-gray-700">
                        Books: {user.borrowedBooks?.length || 0}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-10 flex justify-center">
              <p className="text-gray-500 text-lg font-medium">
                No registered users found in library
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Users;