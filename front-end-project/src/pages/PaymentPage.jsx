import React, { useState, useEffect } from "react";
import "./Pages.css";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  const [formData, setFormData] = useState({
    AmountPaid: "",
    PaymentDate: new Date().toISOString().split('T')[0],
    RecordNumber: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchServicePackages();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/payments");
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      const data = await response.json();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError("Error fetching payments: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePackages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/service-packages");
      if (!response.ok) {
        throw new Error("Failed to fetch service packages");
      }
      const data = await response.json();
      setServicePackages(data);
    } catch (err) {
      console.error("Error fetching service packages:", err);
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
        ? `http://localhost:5000/api/payments/${currentPaymentId}`
        : "http://localhost:5000/api/payments";
      
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
        throw new Error(errorData.message || "Failed to save payment");
      }

      // Reset form and refresh payment list
      resetForm();
      fetchPayments();
    } catch (err) {
      setError("Error saving payment: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (payment) => {
    setFormData({
      AmountPaid: payment.AmountPaid,
      PaymentDate: payment.PaymentDate.split('T')[0],
      RecordNumber: payment.RecordNumber
    });
    setCurrentPaymentId(payment.PaymentNumber);
    setIsEditing(true);
  };

  const handleDelete = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete payment");
      }

      fetchPayments();
    } catch (err) {
      setError("Error deleting payment: " + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      AmountPaid: "",
      PaymentDate: new Date().toISOString().split('T')[0],
      RecordNumber: ""
    });
    setCurrentPaymentId(null);
    setIsEditing(false);
  };

  // Find service package details for display
  const getServicePackageDetails = (recordNumber) => {
    const servicePackage = servicePackages.find(sp => sp.RecordNumber === recordNumber);
    return servicePackage || {};
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Payment Management</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-container">
        <h3 className="form-title">{isEditing ? "Edit Payment" : "Add New Payment"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="RecordNumber">Service Package</label>
            <select
              className="form-control"
              id="RecordNumber"
              name="RecordNumber"
              value={formData.RecordNumber}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Service Package</option>
              {servicePackages.map((sp) => (
                <option key={sp.RecordNumber} value={sp.RecordNumber}>
                  #{sp.RecordNumber} - {sp.PlateNumber} - {sp.DriverName} - {sp.PackageName} (${sp.PackagePrice})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="AmountPaid">Amount Paid</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="AmountPaid"
              name="AmountPaid"
              value={formData.AmountPaid}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="PaymentDate">Payment Date</label>
            <input
              type="date"
              className="form-control"
              id="PaymentDate"
              name="PaymentDate"
              value={formData.PaymentDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Payment" : "Add Payment"}
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
        <h3 className="data-title">Payments List</h3>
        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment #</th>
                <th>Service #</th>
                <th>Car</th>
                <th>Driver</th>
                <th>Package</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                return (
                  <tr key={payment.PaymentNumber}>
                    <td>{payment.PaymentNumber}</td>
                    <td>{payment.RecordNumber}</td>
                    <td>{payment.PlateNumber}</td>
                    <td>{payment.DriverName}</td>
                    <td>{payment.PackageName}</td>
                    <td>${payment.AmountPaid}</td>
                    <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEdit(payment)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(payment.PaymentNumber)}
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

export default PaymentPage;