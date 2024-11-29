import React, { useState, useEffect } from "react";
import { User, UserRoundPen, Pencil, Trash2, Save, X } from "lucide-react";

const Dashboard = () => {
  const [quoteCategory, setQuoteCategory] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
    quoteCategory: "",
  });
  const [filterRole, setFilterRole] = useState(""); // State for role filtering
  const [isEditing, setIsEditing] = useState(false);
  const role = localStorage.getItem("role");
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
          "https://quotify-o02w.onrender.com/api/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };

    if (role === "admin") {
      fetchUsers();
    } else if (role === "categoryManager") {
      const currentCategory = localStorage.getItem("quoteCategory");
      setQuoteCategory(currentCategory || "");
    }
  }, [role]);

  const handleCategoryChange = (e) => {
    setQuoteCategory(e.target.value);
  };

  const handleQuoteCategorySave = async () => {
    try {
      const response = await fetch(
        `https://quotify-o02w.onrender.com/api/users/${localStorage.getItem(
          "userId"
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed for authentication
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"), // Use the user's current username
            role: localStorage.getItem("role"), // Use the user's current role
            quoteCategory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quote category");
      }

      const data = await response.json();
      alert("Quote category updated in the database!");
      console.log("Update response:", data);
    } catch (error) {
      console.error("Error updating quote category:", error);
      alert("Error updating quote category.");
    }
  };

  const openModal = (user = null) => {
    setIsModalOpen(true);
    if (user) {
      setFormData({
        ...user,
        password: "", // Avoid showing password in the form
      });
      setIsEditing(true);
    } else {
      setFormData({
        username: "",
        password: "",
        role: "user",
        quoteCategory: "",
      });
      setIsEditing(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    if (!formData.username || (!isEditing && !formData.password)) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (isEditing) {
        // Update an existing user
        const response = await fetch(
          `https://quotify-o02w.onrender.com/api/users/${formData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              role: formData.role,
              quoteCategory: formData.quoteCategory,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        const updatedUser = await response.json();
        setUsers((prev) =>
          prev.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setFilteredUsers((prev) =>
          prev.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        alert("User updated successfully.");
      } else {
        // Add a new user
        const response = await fetch(
          "https://quotify-o02w.onrender.com/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
              role: formData.role,
              quoteCategory: formData.quoteCategory,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add user");
        }

        const newUser = await response.json();
        setUsers((prev) => [...prev, newUser]);
        setFilteredUsers((prev) => [...prev, newUser]);
        alert("User added successfully.");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user.");
    }

    closeModal();
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://quotify-o02w.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user._id !== userId));
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
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

  const handleFilterRole = (e) => {
    const role = e.target.value;
    setFilterRole(role);
    if (role) {
      setFilteredUsers(users.filter((user) => user.role === role));
    } else {
      setFilteredUsers(users); // Reset filter if no role selected
    }
  };

  return (
    <div className="absolute text-white inset-0 -z-10 flex flex-col items-center justify-center h-max px-4 sm:px-10 lg:px-64 py-6 lg:py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_30%,#63e_100%)] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between w-full mb-6">
        <h2 className="text-2xl lg:text-4xl font-semibold mb-4 sm:mb-0">
          Dashboard
        </h2>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-500 text-sm lg:text-base py-2 px-4 rounded-md hover:scale-105"
        >
          Logout
        </button>
      </div>

      {role === "categoryManager" && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg shadow-md w-full sm:w-auto">
          <h3 className="text-xl lg:text-2xl font-medium mb-4">
            Change Quote Category
          </h3>
          <input
            type="text"
            value={quoteCategory}
            onChange={handleCategoryChange}
            placeholder="Enter new category"
            className="w-full p-3 border border-gray-500 rounded-md mb-4"
          />
          <button
            onClick={handleQuoteCategorySave}
            className="w-full bg-blue-500 text-white p-3 rounded-md"
          >
            Save Category
          </button>
        </div>
      )}

      {role === "admin" && (
        <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-md p-6 lg:p-10 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
            <h3 className="text-lg lg:text-2xl font-semibold mb-4 sm:mb-0">
              Manage Users
            </h3>
            <div className="flex space-x-4 w-full sm:w-auto">
              <select
                value={filterRole}
                onChange={handleFilterRole}
                className="bg-gray-800 text-white px-3 py-2 rounded-md w-full sm:w-auto"
              >
                <option value="">Filter by Role</option>
                <option value="user">User</option>
                <option value="categoryManager">Category Manager</option>
              </select>
              <button
                onClick={() => openModal()}
                className="bg-transparent border border-green-600/50 text-green-600 text-sm lg:text-base py-2 px-4 rounded-md hover:scale-105"
              >
                Add User
              </button>
            </div>
          </div>
          {filteredUsers.length === 0 ? (
            <p>No users to display</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row sm:justify-between py-6 border-b border-white/20"
              >
                <span>{user.username}</span>
                <div className="px-2 items-center flex flex-col sm:flex-row">
                  <div className="flex justify-start w-full sm:w-64 text-md mr-6 bg-transparent text-white backdrop-blur-lg text-sm rounded-2xl p-3 border border-white/10 shadow-inner">
                    {user.role === "categoryManager" ? (
                      <UserRoundPen className="w-4 h-4 mr-2" />
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-left mr-4">
                      {user.role === "categoryManager" ? "Manager" : "User"}
                    </span>
                  </div>
                  <div className="flex mt-2 sm:mt-0 space-x-4">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-transparent border border-yellow-500/30 shadow-lg hover:bg-yellow-100/10 text-white px-4 py-3 rounded-2xl"
                    >
                      <Pencil className="text-yellow-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-transparent border border-red-500/30 shadow-lg hover:bg-yellow-100/10 text-white px-4 py-3 rounded-2xl"
                    >
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white/10 backdrop-blur-xl p-6 lg:p-10 rounded-lg shadow-lg w-full sm:w-96">
            <h3 className="text-xl lg:text-2xl font-medium mb-4">
              {isEditing ? "Edit User" : "Add User"}
            </h3>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              placeholder="Username"
              className="w-full bg-transparent p-3 mb-4 border border-white/20 rounded-md"
            />
            {!isEditing && (
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Password"
                className="w-full bg-transparent p-3 mb-4 border border-white/20 rounded-md"
              />
            )}
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full bg-transparent p-3 mb-4 border border-white/20 rounded-md"
            >
              <option className="bg-black" value="user">
                User
              </option>
              <option className="bg-black" value="categoryManager">
                Category Manager
              </option>
            </select>
            <select
              name="quoteCategory"
              value={formData.quoteCategory}
              onChange={handleFormChange}
              className="w-full bg-transparent p-3 mb-4 border border-white/20 rounded-md"
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
            <div className="flex justify-between">
              <button
                onClick={handleSaveUser}
                className="bg-blue-500 text-white px-2 rounded-md"
              >
                <div className="flex w-24">
                  <Save className="mr-2" />
                  <span>Save</span>
                </div>
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                <div className="flex w-24">
                  <X className="mr-2" />
                  <span>Cancel</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
