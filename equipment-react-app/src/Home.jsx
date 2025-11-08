import React, { useEffect, useState } from "react";
import "./Home.css";

export default function Home({ token , user}) {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/equipment", {
        headers: token ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch equipment list");
      const data = await res.json();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading equipment:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredEquipment = equipment.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);

  return (
    <div className="home-container">

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={loadEquipment}>Refresh</button>
      </div>

      {loading ? (
        <p className="loading">Loading equipment list...</p>
      ) : (
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Condition</th>
              {/* <th>Total Quantity</th> */}
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.equipment_id}>
                  <td>{item.name}</td>
                  <td>{item.category_name || item.category_id}</td>
                  <td>{item.condition}</td>
                  {/* <td>{item.total_quantity}</td> */}
                  <td
                    className={
                      item.available_quantity > 0 ? "available" : "unavailable"
                    }
                  >
                    {item.available_quantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No equipment found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      
      {filteredEquipment.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}