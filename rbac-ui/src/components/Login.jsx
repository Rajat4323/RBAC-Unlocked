import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission's default behavior
    try {
      // Send login request to the backend
      const response = await axios.post(
        "https://quotify-o02w.onrender.com/api/auth/login",
        {
          username,
          password,
        }
      );

      // Extract token and role from the response
      const { token, role } = response.data;

      // Save the token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username); // Use input username here

      // Navigate based on the role
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "user") {
        navigate("/quotes");
      } else if (role === "categoryManager") {
        navigate("/manage-category");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid username or password");
    }
  };

  return (
    <div className="flex absolute inset-0 -z-10 w-full items-center justify-center h-screen px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_30%,#63e_100%)]">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-8 py-16 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-10 text-white">
          Quotify Login
        </h2>
        {/* Use Form for Login */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-white/10 bg-transparent text-white rounded-md focus:outline-none focus:ring-1 focus:ring-slate-100/30"
              required // Add required to enforce validation
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-white/10 bg-transparent text-white rounded-md focus:outline-none focus:ring-1 focus:ring-slate-100/30"
              required // Add required to enforce validation
            />
          </div>
          <button
            type="submit" // Submit button
            className="w-full shadow-lg bg-black text-white p-3 rounded-md hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
