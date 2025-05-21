import React, { useState, useEffect } from "react";
import "./Pages.css";

function PackagePage() {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    PackageName: "",
    PackageDescription: "",
    PackagePrice: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/packages");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackages(data);
      setError(null);
    } catch (err) {
      setError("Error fetching packages: " + err.message);
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
        ? `http://localhost:5000/api/packages/${currentPackageId}`
        : "http://localhost:5000/api/packages";
      
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
        throw new Error(errorData.message || "Failed to save package");
      }

      // Reset form and refresh package list
      resetForm();
      fetchPackages();
    } catch (err) {
      setError("Error saving package: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      PackageName: pkg.PackageName,
      PackageDescription: pkg.PackageDescription || "",
      PackagePrice: pkg.PackagePrice
    });
    setCurrentPackageId(pkg.PackageNumber);
    setIsEditing(true);
  };

  const handleDelete = async (packageId) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/packages/${packageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete package");
      }

      fetchPackages();
    } catch (err) {
      setError("Error deleting package: " + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      PackageName: "",
      PackageDescription: "",
      PackagePrice: ""
    });
    setCurrentPackageId(null);
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Package Management</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-container">
        <h3 className="form-title">{isEditing ? "Edit Package" : "Add New Package"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="PackageName">Package Name</label>
            <input
              type="text"
              className="form-control"
              id="PackageName"
              name="PackageName"
              value={formData.PackageName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="PackageDescription">Description</label>
            <textarea
              className="form-control"
              id="PackageDescription"
              name="PackageDescription"
              value={formData.PackageDescription}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="PackagePrice">Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="PackagePrice"
              name="PackagePrice"
              value={formData.PackagePrice}
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
        <h3 className="table-title">Package List</h3>
        {loading ? (
          <p>Loading packages...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Package Number</th>
                <th>Package Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No packages found</td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.PackageNumber}>
                    <td>{pkg.PackageNumber}</td>
                    <td>{pkg.PackageName}</td>
                    <td>{pkg.PackageDescription}</td>
                    <td>${pkg.PackagePrice}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(pkg)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(pkg.PackageNumber)}
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

export default PackagePage;