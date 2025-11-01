import React, { useEffect, useState } from "react";
import EquipmentForm from "./EquipmentForm";
import "./InventoryManagement.css";

export default function InventoryManagement({ token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      const res = await fetch("http://localhost:3001/api/equipment");
      if (!res.ok) throw new Error("Failed to load equipment");
      const data = await res.json();
      const validData = Array.isArray(data) ? data : [];
      setItems(validData);

      const uniqueCategories = {};
      validData.forEach((item) => {
        if (item.category_id && item.category_name) {
          uniqueCategories[item.category_id] = item.category_name;
        }
      });

      setCategories(
        Object.keys(uniqueCategories).map((key) => ({
          category_id: key,
          name: uniqueCategories[key],
        }))
      );
    } catch (err) {
      console.error("Error loading equipment:", err);
    }
  }

  async function confirmDelete() {
    if (!deleteItem) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/equipment/${deleteItem.equipment_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.token}` },
        }
      );
      if (res.ok) {
        loadEquipment();
      } else {
        console.error("Failed to delete equipment");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteItem(null);
      document.body.classList.remove("modal-open");
    }
  }

  function onDelete(item) {
    setDeleteItem(item);
    setShowDeleteConfirm(true);
    document.body.classList.add("modal-open");
  }

  function onEdit(item) {
    setEditing(item);
    setShowForm(true);
    document.body.classList.add("modal-open");
  }

  function onAdd() {
    setEditing(null);
    setShowForm(true);
    document.body.classList.add("modal-open");
  }

  function onSaved() {
    setShowForm(false);
    setEditing(null);
    document.body.classList.remove("modal-open");
    loadEquipment();
  }

  function closeDeleteModal() {
    setShowDeleteConfirm(false);
    setDeleteItem(null);
    document.body.classList.remove("modal-open");
  }

  return (
    <div className={`inventory-container ${showForm || showDeleteConfirm ? "blurred" : ""}`}>
      <div className="inventory-header">
        <h3>Inventory Management</h3>
        <button onClick={onAdd}>+ Add Item</button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Available</th>
            <th>Total Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.equipment_id}>
              <td>{it.name}</td>
              <td>{it.category_name || it.category_id}</td>
              <td>{it.condition}</td>
              <td
                className={
                  it.available_quantity > 0 ? "available" : "unavailable"
                }
              >
                {it.available_quantity}
              </td>
              <td>{it.total_quantity}</td>
              <td>
                <button onClick={() => onEdit(it)}>Edit</button>
                <button className="danger" onClick={() => onDelete(it)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box small">
            <h4>Confirm Deletion</h4>
            <p>
              Are you sure you want to delete <strong>{deleteItem?.name}</strong>?
            </p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <EquipmentForm
          token={token}
          item={editing}
          onSaved={onSaved}
          categories={categories}
        />
      )}
    </div>
  );
}