import React, { useState, useEffect } from "react";
import "./EquipmentRequest.css";
import EquipmentRequestForm from "./EquipmentRequestForm";

export default function EquipmentRequest({ token }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const user = {
    full_name: localStorage.getItem("userName"),
    role: localStorage.getItem("userRole"),
    token: localStorage.getItem("token"),
  };

  async function fetchEquipment() {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/equipment?search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setEquipmentList(data);
    } catch (err) {
      console.error("Error fetching equipment:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEquipment();
  }, [search]);

  function handleRequest(eq) {
    setSelectedEquipment(eq);
    setShowForm(true);
    document.body.classList.add("modal-open");
  }

  function handleFormClose() {
    setShowForm(false);
    setSelectedEquipment(null);
    document.body.classList.remove("modal-open");
    fetchEquipment();
  }

  return (
    <>
      <div className="request-page">
        <h2>Search & Request Equipment</h2>

        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Total</th>
                <th>Available</th>
                <th>Condition</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = equipmentList.slice(indexOfFirstItem, indexOfLastItem);

                return currentItems.map((eq) => (
                  <tr key={eq.equipment_id}>
                    <td>{eq.name}</td>
                    <td>{eq.category_name}</td>
                    <td>{eq.total_quantity}</td>
                    <td
                      className={
                        eq.available_quantity > 0 ? "available" : "unavailable"
                      }
                    >
                      {eq.available_quantity}
                    </td>
                    <td>{eq.condition}</td>
                    <td>
                      {eq.available_quantity > 0 ? (
                        <button onClick={() => handleRequest(eq)}>
                          Request
                        </button>
                      ) : (
                        <span className="unavailable">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
          {equipmentList.length > 0 && (
            (() => {
              const totalPages = Math.ceil(equipmentList.length / itemsPerPage) || 1;
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

        {showForm && (
          <EquipmentRequestForm
            token={token}
            item={selectedEquipment}
            onSaved={handleFormClose}
          />
        )}
      </div>
    </>
  );
}