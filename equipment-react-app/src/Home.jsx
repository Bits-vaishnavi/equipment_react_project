import React, { useEffect, useState } from "react";
import "./Home.css";

export default function Home({ token, user }) {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Welcome, {user?.full_name || "User"}!</h2>
      </div>

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
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
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
    </div>
  );
}