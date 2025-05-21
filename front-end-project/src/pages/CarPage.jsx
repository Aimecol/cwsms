import React, { useState, useEffect } from "react";
import "./Pages.css";

function CarPage() {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    PlateNumber: "",
    CarType: "",
    CarSize: "",
    DriverName: "",
    PhoneNumber: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/cars");
      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }
      const data = await response.json();
      setCars(data);
      setError(null);
    } catch (err) {
      setError("Error fetching cars: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `http://localhost:5000/api/cars/${formData.PlateNumber}`
        : "http://localhost:5000/api/cars";
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save car");
      }

      // Reset form and refresh car list
      resetForm();
      fetchCars();
    } catch (err) {
      setError("Error saving car: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (car) => {
    setFormData(car);
    setIsEditing(true);
  };

  const handleDelete = async (plateNumber) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${plateNumber}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete car");
      }

      fetchCars();
    } catch (err) {
      setError("Error deleting car: " + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      PlateNumber: "",
      CarType: "",
      CarSize: "",
      DriverName: "",
      PhoneNumber: ""
    });
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Car Management</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-container">
        <h3 className="form-title">{isEditing ? "Edit Car" : "Add New Car"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="PlateNumber">Plate Number</label>
            <input
              type="text"
              className="form-control"
              id="PlateNumber"
              name="PlateNumber"
              value={formData.PlateNumber}
              onChange={handleInputChange}
              disabled={isEditing}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="CarType">Car Type</label>
            <input
              type="text"
              className="form-control"
              id="CarType"
              name="CarType"
              value={formData.CarType}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="CarSize">Car Size</label>
            <select
              className="form-control"
              id="CarSize"
              name="CarSize"
              value={formData.CarSize}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="DriverName">Driver Name</label>
            <input
              type="text"
              className="form-control"
              id="DriverName"
              name="DriverName"
              value={formData.DriverName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="PhoneNumber">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update" : "Save"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="table-container">
        <h3 className="table-title">Car List</h3>
        {loading ? (
          <p>Loading cars...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Plate Number</th>
                <th>Car Type</th>
                <th>Car Size</th>
                <th>Driver Name</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No cars found</td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.PlateNumber}>
                    <td>{car.PlateNumber}</td>
                    <td>{car.CarType}</td>
                    <td>{car.CarSize}</td>
                    <td>{car.DriverName}</td>
                    <td>{car.PhoneNumber}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(car)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(car.PlateNumber)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CarPage;