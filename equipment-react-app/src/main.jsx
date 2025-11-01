import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./Login.jsx";
import Home from "./Home.jsx";
import EquipmentRequest from "./EquipmentRequest.jsx";
import RequestReview from "./RequestReview.jsx";
import InventoryManagement from "./InventoryManagement.jsx";
import Nav from "./Nav.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function Layout({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div>
      <Nav
        user={{ role }}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      />
      <main>{children}</main>
    </div>
  );
}

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Student Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["student", "admin", "staff"]}>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Student Request Page */}
        <Route
          path="/request"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Layout>
                <EquipmentRequest />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Staff & Admin: Review Requests */}
        <Route
          path="/review"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout>
                <RequestReview />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin: Inventory Management */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <InventoryManagement token={localStorage.getItem("token")} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);