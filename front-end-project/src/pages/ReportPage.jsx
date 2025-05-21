import React, { useState, useEffect } from "react";
import "./Pages.css";

function ReportPage() {
  const [activeReport, setActiveReport] = useState("daily");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterParams, setFilterParams] = useState({
    date: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear().toString()
  });

  useEffect(() => {
    fetchReportData(activeReport);
  }, [activeReport]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams({
      ...filterParams,
      [name]: value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReportData(activeReport);
  };

  const fetchReportData = async (reportType) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `http://localhost:5000/api/reports/${reportType}`;
      
      // Add query parameters based on report type
      if (reportType === "daily" && filterParams.date) {
        url += `?date=${filterParams.date}`;
      } else if (reportType === "monthly" && filterParams.year) {
        url += `?year=${filterParams.year}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${reportType} report data`);
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(`Error fetching report: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderReportContent = () => {
    if (loading) {
      return <p>Loading report data...</p>;
    }
    
    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }
    
    if (reportData.length === 0) {
      return <p>No data available for this report.</p>;
    }
    
    switch (activeReport) {
      case "daily":
        return renderDailySalesReport();
      case "monthly":
        return renderMonthlyRevenueReport();
      case "package-popularity":
        return renderPackagePopularityReport();
      case "customer-frequency":
        return renderCustomerFrequencyReport();
      case "revenue-by-car-type":
        return renderRevenueByCarTypeReport();
      case "unpaid-services":
        return renderUnpaidServicesReport();
      default:
        return <p>Select a report type to view data.</p>;
    }
  };

  const renderDailySalesReport = () => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Services</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.Date).toLocaleDateString()}</td>
              <td>{item.TotalServices}</td>
              <td>${item.TotalRevenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderMonthlyRevenueReport = () => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Services</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.Month + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
              <td>{item.TotalServices}</td>
              <td>${item.TotalRevenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPackagePopularityReport = () => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Times Used</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.PackageName}</td>
              <td>{item.TimesUsed}</td>
              <td>${item.TotalRevenue ? item.TotalRevenue.toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCustomerFrequencyReport = () => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Driver Name</th>
            <th>Phone Number</th>
            <th>Visit Count</th>
            <th>Total Spent</th>
            <th>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.PlateNumber}</td>
              <td>{item.DriverName}</td>
              <td>{item.PhoneNumber}</td>
              <td>{item.VisitCount}</td>
              <td>${item.TotalSpent ? item.TotalSpent.toFixed(2) : '0.00'}</td>
              <td>{item.LastVisit ? new Date(item.LastVisit).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderRevenueByCarTypeReport = () => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Car Type</th>
            <th>Service Count</th>
            <th>Total Revenue</th>
            <th>Average Revenue</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.CarType}</td>
              <td>{item.ServiceCount}</td>
              <td>${item.TotalRevenue ? item.TotalRevenue.toFixed(2) : '0.00'}</td>
              <td>${item.AverageRevenue ? item.AverageRevenue.toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderUnpaidServicesReport = () => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Record #</th>
            <th>Service Date</th>
            <th>Plate Number</th>
            <th>Driver Name</th>
            <th>Phone Number</th>
            <th>Package</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.RecordNumber}</td>
              <td>{new Date(item.ServiceDate).toLocaleDateString()}</td>
              <td>{item.PlateNumber}</td>
              <td>{item.DriverName}</td>
              <td>{item.PhoneNumber}</td>
              <td>{item.PackageName}</td>
              <td>${item.PackagePrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Reports</h2>
      
      <div className="report-controls">
        <div className="report-tabs">
          <button 
            className={`report-tab ${activeReport === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveReport('daily')}
          >
            Daily Sales
          </button>
          <button 
            className={`report-tab ${activeReport === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveReport('monthly')}
          >
            Monthly Revenue
          </button>
          <button 
            className={`report-tab ${activeReport === 'package-popularity' ? 'active' : ''}`}
            onClick={() => setActiveReport('package-popularity')}
          >
            Package Popularity
          </button>
          <button 
            className={`report-tab ${activeReport === 'customer-frequency' ? 'active' : ''}`}
            onClick={() => setActiveReport('customer-frequency')}
          >
            Customer Frequency
          </button>
          <button 
            className={`report-tab ${activeReport === 'revenue-by-car-type' ? 'active' : ''}`}
            onClick={() => setActiveReport('revenue-by-car-type')}
          >
            Revenue by Car Type
          </button>
          <button 
            className={`report-tab ${activeReport === 'unpaid-services' ? 'active' : ''}`}
            onClick={() => setActiveReport('unpaid-services')}
          >
            Unpaid Services
          </button>
        </div>
        
        {(activeReport === 'daily' || activeReport === 'monthly') && (
          <form className="report-filters" onSubmit={handleFilterSubmit}>
            {activeReport === 'daily' && (
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={filterParams.date} 
                  onChange={handleFilterChange}
                />
              </div>
            )}
            
            {activeReport === 'monthly' && (
              <div className="form-group">
                <label htmlFor="year">Year:</label>
                <input 
                  type="number" 
                  id="year" 
                  name="year" 
                  value={filterParams.year} 
                  onChange={handleFilterChange}
                  min="2000" 
                  max="2100"
                />
              </div>
            )}
            
            <button type="submit" className="btn btn-primary">Apply Filter</button>
          </form>
        )}
      </div>
      
      <div className="report-container">
        <h3 className="report-title">
          {activeReport === 'daily' && 'Daily Sales Report'}
          {activeReport === 'monthly' && 'Monthly Revenue Report'}
          {activeReport === 'package-popularity' && 'Package Popularity Report'}
          {activeReport === 'customer-frequency' && 'Customer Frequency Report'}
          {activeReport === 'revenue-by-car-type' && 'Revenue by Car Type Report'}
          {activeReport === 'unpaid-services' && 'Unpaid Services Report'}
        </h3>
        
        {renderReportContent()}
      </div>
    </div>
  );
}

export default ReportPage;