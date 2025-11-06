import React, { useState, useEffect } from "react";
import "./MyRequestsPage.css";

export default function MyRequests({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = {
    full_name: localStorage.getItem("userName"),
    role: localStorage.getItem("userRole"),
    token: localStorage.getItem("token"),
  };

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/requests", {
        headers: {
          Authorization: `Bearer ${token || user.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setMessage("Error loading your requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      case "returned":
        return "status-returned";
      default:
        return "";
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="my-requests-page">
      <h2>My Equipment Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>You haven't made any equipment requests yet.</p>
            </div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Request Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Request Reason</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.request_id}>
                    <td>{req.equipment_name}</td>
                    <td>{req.category_name}</td>
                    <td>{req.quantity}</td>
                    <td>{formatDate(req.request_date)}</td>
                    <td>{formatDate(req.return_date)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(req.status)}`}>
                        {req.status || "Pending"}
                      </span>
                    </td>
                    <td className="notes-cell">
                      {req.admin_notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {message && <div className="message-box">{message}</div>}
    </div>
  );
}