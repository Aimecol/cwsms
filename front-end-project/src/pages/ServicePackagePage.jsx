import React, { useState, useEffect } from "react";
import "./Pages.css";

function ServicePackagePage() {
  const [servicePackages, setServicePackages] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    ServiceDate: new Date().toISOString().split('T')[0],
    PlateNumber: "",
    PackageNumber: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchServicePackages();
    fetchCars();
    fetchPackages();
  }, []);

  const fetchServicePackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/service-packages");
      if (!response.ok) {
        throw new Error("Failed to fetch service packages");
      }
      const data = await response.json();
      setServicePackages(data);
      setError(null);
    } catch (err) {
      setError("Error fetching service packages: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars");
      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }
      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/packages");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackages(data);
    } catch (err) {
      console.error("Error fetching packages:", err);
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
        ? `http://localhost:5000/api/service-packages/${currentRecordId}`
        : "http://localhost:5000/api/service-packages";
      
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
        throw new Error(errorData.message || "Failed to save service package");
      }

      // Reset form and refresh service package list
      resetForm();
      fetchServicePackages();
    } catch (err) {
      setError("Error saving service package: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (servicePackage) => {
    setFormData({
      ServiceDate: servicePackage.ServiceDate.split('T')[0],
      PlateNumber: servicePackage.PlateNumber,
      PackageNumber: servicePackage.PackageNumber
    });
    setCurrentRecordId(servicePackage.RecordNumber);
    setIsEditing(true);
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this service package?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/service-packages/${recordId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete service package");
      }

      fetchServicePackages();
    } catch (err) {
      setError("Error deleting service package: " + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      ServiceDate: new Date().toISOString().split('T')[0],
      PlateNumber: "",
      PackageNumber: ""
    });
    setCurrentRecordId(null);
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Service Package Management</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-container">
        <h3 className="form-title">{isEditing ? "Edit Service Package" : "Add New Service Package"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ServiceDate">Service Date</label>
            <input
              type="date"
              className="form-control"
              id="ServiceDate"
              name="ServiceDate"
              value={formData.ServiceDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="PlateNumber">Car</label>
            <select
              className="form-control"
              id="PlateNumber"
              name="PlateNumber"
              value={formData.PlateNumber}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Car</option>
              {cars.map((car) => (
                <option key={car.PlateNumber} value={car.PlateNumber}>
                  {car.PlateNumber} - {car.DriverName} ({car.CarType})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="PackageNumber">Package</label>
            <select
              className="form-control"
              id="PackageNumber"
              name="PackageNumber"
              value={formData.PackageNumber}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Package</option>
              {packages.map((pkg) => (
                <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                  {pkg.PackageName} - ${pkg.PackagePrice}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Service Package" : "Add Service Package"}
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
      
      <div className="data-container">
        <h3 className="data-title">Service Packages List</h3>
        {loading ? (
          <p>Loading service packages...</p>
        ) : servicePackages.length === 0 ? (
          <p>No service packages found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Record #</th>
                <th>Service Date</th>
                <th>Car</th>
                <th>Driver</th>
                <th>Package</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {servicePackages.map((servicePackage) => {
                const car = cars.find(c => c.PlateNumber === servicePackage.PlateNumber) || {};
                const pkg = packages.find(p => p.PackageNumber === servicePackage.PackageNumber) || {};
                return (
                  <tr key={servicePackage.RecordNumber}>
                    <td>{servicePackage.RecordNumber}</td>
                    <td>{new Date(servicePackage.ServiceDate).toLocaleDateString()}</td>
                    <td>{servicePackage.PlateNumber}</td>
                    <td>{car.DriverName}</td>
                    <td>{pkg.PackageName}</td>
                    <td>${pkg.PackagePrice}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEdit(servicePackage)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(servicePackage.RecordNumber)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ServicePackagePage;