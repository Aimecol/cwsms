import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>SmartPark CWSMS</h1>
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      
      <ul className={`navbar-nav ${menuOpen ? 'active' : ''}`}>
        <li className={`nav-item ${currentPage === 'car' ? 'active' : ''}`}>
          <a href="#" onClick={() => handleNavClick('car')}>Cars</a>
        </li>
        <li className={`nav-item ${currentPage === 'package' ? 'active' : ''}`}>
          <a href="#" onClick={() => handleNavClick('package')}>Packages</a>
        </li>
        <li className={`nav-item ${currentPage === 'servicePackage' ? 'active' : ''}`}>
          <a href="#" onClick={() => handleNavClick('servicePackage')}>Service Packages</a>
        </li>
        <li className={`nav-item ${currentPage === 'payment' ? 'active' : ''}`}>
          <a href="#" onClick={() => handleNavClick('payment')}>Payments</a>
        </li>
        <li className={`nav-item ${currentPage === 'report' ? 'active' : ''}`}>
          <a href="#" onClick={() => handleNavClick('report')}>Reports</a>
        </li>
        <li className="nav-item">
          <a href="#" onClick={() => alert('Logout functionality would go here')}>Logout</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;