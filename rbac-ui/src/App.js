import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Quotes from "./components/Quotes";
import CategoryManager from "./components/CategoryManager"; // Import CategoryManager
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protect these routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/quotes"
          element={<ProtectedRoute element={<Quotes />} />}
        />
        {/* Add Category Manager route for Admin */}
        <Route
          path="/manage-category"
          element={<ProtectedRoute element={<CategoryManager />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
