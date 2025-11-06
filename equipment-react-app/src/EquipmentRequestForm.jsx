import React, { useState } from "react";
import "./EquipmentForm.css"; //Reusing the same form style

export default function EquipmentRequestForm({ token, item, onSaved }) {
  const [quantity, setQuantity] = useState(1);
  const [requestReason, setRequestReason] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!item) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        equipment_id: item.equipment_id,
        quantity: Number(quantity),
        admin_notes: requestReason,
        return_date: returnDate,
      };

      const res = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create request");
      }

    //   setSuccess("Request submitted successfully!");
      setTimeout(() => {
        onSaved();
      }, 1200);
    } catch (err) {
      console.error("Request error:", err);
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

        <h3>Request Equipment</h3>
        <p><strong>{item.name}</strong></p>

        {error && <div className="error-text">{error}</div>}
        {success && <div className="success-text">{success}</div>}

        <form className="equipment-form" onSubmit={handleSubmit}>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>

          <label>
            Reason for Request:
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Enter reason..."
              required
            ></textarea>
          </label>

          <label>
            Expected Return Date:
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
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