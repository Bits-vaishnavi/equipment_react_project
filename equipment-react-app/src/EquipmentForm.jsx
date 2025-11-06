import React, { useState, useEffect } from "react";
import "./EquipmentForm.css";

export default function EquipmentForm({ token, item, onSaved, categories }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [condition, setCondition] = useState("Good");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setCategoryId(item.category_id || "");
      setTotalQuantity(item.total_quantity || 0);
      setCondition(item.condition || "Good");
    } else {
      setName("");
      setCategoryId("");
      setTotalQuantity(0);
      setCondition("Good");
    }
  }, [item]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const BASE_URL = "http://localhost:3001";
      const method = item ? "PUT" : "POST";
      const url = item
        ? `${BASE_URL}/api/equipment/${item.equipment_id}`
        : `${BASE_URL}/api/equipment`;

      const payload = {
        name,
        category_id: Number(categoryId),
        total_quantity: Number(totalQuantity),
        condition,
      };

      console.debug("Saving equipment", { url, method, payload });

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        let msg = "Server error saving equipment";
        try {
          if (ct.includes("application/json")) {
            const data = await res.json();
            msg = data.message || JSON.stringify(data);
          } else {
            msg = await res.text();
          }
        } catch {
          msg = `Server responded with status ${res.status}`;
        }
        throw new Error(msg);
      }

      await res.json();
      onSaved();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onSaved}>
          &times;
        </button>

        <h3>{item ? "Edit Equipment" : "Add Equipment"}</h3>

        {error && <div className="error-text">{error}</div>}

        <form className="equipment-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Category:
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Total Quantity:
            <input
              type="number"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value)}
              min="0"
              required
            />
          </label>

          <label>
            Condition:
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="Good">Good</option>
              <option value="Great">Great</option>
              <option value="Bad">Bad</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn-cancel" onClick={onSaved}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}