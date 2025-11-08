import React, { useEffect, useState } from "react";
import "./RequestReview.css";

export default function RequestReview() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const BASE_URL = "http://localhost:3001";
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const user = {
    full_name: localStorage.getItem("username"),
    role: localStorage.getItem("userRole"),
  };

  const token = localStorage.getItem("token");

  // Fetch all requests
  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch requests:", res.status);
        setRequests([]);
        return;
      }

      const data = await res.json();
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, action) {
    // const normalized = action.toLowerCase();
    let endpoint = "";
    let successMessage = "";
    // let BASE_URL = "http://localhost:3001";

    switch (action) {
      case "Approved":
        endpoint = `${BASE_URL}/api/requests/${id}/approve`;
        successMessage = "Request approved successfully!";
        break;
      case "Rejected":
        endpoint = `${BASE_URL}/api/requests/${id}/reject`;
        successMessage = "Request rejected successfully!";
        break;
      case "Issued":
        endpoint = `${BASE_URL}/api/requests/${id}/issue`;
        successMessage = "Equipment issued successfully!";
        break;
      case "Returned":
        endpoint = `${BASE_URL}/api/requests/${id}/return`;
        successMessage = "Equipment returned successfully!";
        break;
      default:
        console.error("Invalid action:", action);
        return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating request");

      setMessage(successMessage);
      fetchRequests(); // Refresh after action
    } catch (err) {
      console.error("Action error:", err);
      setMessage("Failed to perform action.");
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="review-container">
      <div className="review-header">
        <h3>Review Equipment Requests</h3>
      </div>

      <div className="review-card">
        {loading && <p className="loading">Loading requests...</p>}

        {!loading && requests.length === 0 && (
          <p className="no-data">No equipment requests found.</p>
        )}

        {!loading && requests.length > 0 && (
          <>
          <table className="request-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Equipment</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);

                return currentItems.map((r) => {
                const status = (r.status || "");

                return (
                  <tr key={r.request_id}>
                    <td>{r.student_name || r.requested_by || "—"}</td>
                    <td>{r.equipment_name || "—"}</td>
                    <td>{r.category_name || "—"}</td>
                    <td>{r.quantity || 1}</td>
                    <td className={`status ${status}`}>{status}</td>
                    <td>
                      {status === "Pending" && (
                        <div className="actions">
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleAction(r.request_id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleAction(r.request_id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {status === "Approved" && (
                        <div className="actions">
                          <button
                            className="issue-btn"
                            onClick={() =>
                              handleAction(r.request_id, "Issued")
                            }
                          >
                            Issue
                          </button>
                        </div>
                      )}

                      {status === "Issued" && (
                        <div className="actions">
                          <button
                            className="return-btn"
                            onClick={() =>
                              handleAction(r.request_id, "Returned")
                            }
                          >
                            Return
                          </button>
                        </div>
                      )}

                      {(status === "Returned" ||
                        status === "Rejected") && (
                        <span className="no-actions">—</span>
                      )}
                    </td>
                  </tr>
                );
                });
              })()}
            </tbody>
          </table>
          {requests.length > 0 && (
            (() => {
              const totalPages = Math.ceil(requests.length / itemsPerPage) || 1;
              const paginate = (pageNumber) => setCurrentPage(pageNumber);
              return (
                <div className="pagination">
                  <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="page-button">Previous</button>
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, index) => (
                      <button key={index + 1} onClick={() => paginate(index + 1)} className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}>{index + 1}</button>
                    ))}
                  </div>
                  <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="page-button">Next</button>
                </div>
              );
            })()
          )}
          </>
        )}

        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
}