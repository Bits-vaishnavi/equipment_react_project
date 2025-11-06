import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Navbar from "./Nav";
import Home from "./Home";
import SearchRequest from "./SearchRequest";
import MyRequests from "./MyRequests";
import ReviewRequests from "./ReviewRequests";
import InventoryManagement from "./InventoryManagement";

function App() {
  const [user, setUser] = useState(null);

  // When user logs out
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="main-content">
        <Routes>
          {/* Common Home Page for all roles */}
          <Route path="/" element={<Home token={user.token} user={user} />} />

          {/* Student-only route */}
          {user.role === "student" && (
            <>
              <Route path="/request" element={<SearchRequest token={user.token} user={user} />} />
              <Route path="/my-requests" element={<MyRequests token={user.token} user={user} />} />
            </>
          )}

          {/* Staff route */}
          {user.role === "staff" && (
            <Route path="/review" element={<ReviewRequests token={user.token} user={user} />} />
          )}

          {/* Admin routes */}
          {user.role === "admin" && (
            <>
              <Route path="/review" element={<ReviewRequests token={user.token} user={user} />} />
              <Route path="/inventory" element={<InventoryManagement token={user.token} />} />
            </>
          )}

          {/* Redirect everything else to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
