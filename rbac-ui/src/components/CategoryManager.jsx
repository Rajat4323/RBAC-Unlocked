import { Edit } from "lucide-react";
import React, { useState, useEffect } from "react";

const CategoryManager = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For displaying filtered data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store the user being edited
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order
  const [filterCategory, setFilterCategory] = useState(""); // Selected category for filtering

  // Hard-coded categories array
  const categories = [
    "art",
    "communication",
    "courage",
    "education",
    "family",
    "happiness",
    "health",
    "knowledge",
    "leadership",
    "money",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://quotify-o02w.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // Filter out users with role 'categoryManager'
        const filteredUsers = data.filter(
          (user) => user.role !== "categoryManager"
        );
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers); // Initialize filteredUsers
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter and search logic combined
    let updatedUsers = users;

    if (filterCategory) {
      updatedUsers = updatedUsers.filter(
        (user) => user.category === filterCategory
      );
    }

    if (searchTerm) {
      updatedUsers = updatedUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    if (sortOrder === "asc") {
      updatedUsers.sort((a, b) => a.username.localeCompare(b.username));
    } else {
      updatedUsers.sort((a, b) => b.username.localeCompare(a.username));
    }

    setFilteredUsers(updatedUsers);
  }, [searchTerm, filterCategory, sortOrder, users]);

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedCategory(user.category || ""); // Default to the user's current category
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedCategory("");
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    try {
      const response = await fetch(
        `https://quotify-o02w.onrender.com/api/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: selectedUser.username,
            role: selectedUser.role,
            quoteCategory: selectedCategory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user category");
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((user) =>
          user._id === updatedUser._id
            ? { ...user, quoteCategory: selectedCategory }
            : user
        )
      );
      alert("Category updated successfully.");
      closeModal();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("quoteCategory");
    window.location.href = "/";
  };

  return (
    <div className="absolute text-white inset-0 -z-10 flex flex-col items-center justify-center px-4 sm:px-10 lg:px-64 py-6 lg:py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_30%,#63e_100%)] min-h-screen h-max">
      <div className="flex flex-col sm:flex-row sm:justify-between w-full mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold mb-4 sm:mb-0">
          Manager
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-sm lg:text-base text-white py-2 px-4 rounded-md hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Search, Sort, and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full sm:w-1/3"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">Filter by Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category} className="bg-black">
              {category}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
        >
          Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* User List */}
      <div className="bg-white/10 rounded-lg backdrop-blur-lg p-6 lg:p-10 w-full">
        <h3 className="text-lg lg:text-xl font-medium mb-4">Users</h3>
        <div>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-gray-600"
              >
                <span className="text-sm lg:text-base">{user.username}</span>
                <button
                  onClick={() => openModal(user)}
                  className="bg-transparent border border-yellow-300/30 px-4 py-2 rounded-md mt-2 sm:mt-0"
                >
                  <div className="flex justify-center items-center text-yellow-300">
                    <Edit className="text-yellow-300 mr-2" />
                    Edit
                  </div>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users available</p>
          )}
        </div>
      </div>

      {/* Modal for Editing Category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h3 className="text-lg lg:text-2xl font-medium mb-4">
              Edit Category
            </h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent p-3 border border-white/30 rounded-md mb-4"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category} className="bg-black">
                  {category}
                </option>
              ))}
            </select>
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
              <button
                onClick={handleSaveCategory}
                className="bg-green-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
