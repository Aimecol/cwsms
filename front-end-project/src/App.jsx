import React, { useState } from "react";
import "./App.css";

// Import components (we'll create these next)
import Navbar from "./components/Navbar";
import CarPage from "./pages/CarPage";
import PackagePage from "./pages/PackagePage";
import ServicePackagePage from "./pages/ServicePackagePage";
import PaymentPage from "./pages/PaymentPage";
import ReportPage from "./pages/ReportPage";

function App() {
  const [currentPage, setCurrentPage] = useState("car");

  // Function to render the current page
  const renderPage = () => {
    switch (currentPage) {
      case "car":
        return <CarPage />;
      case "package":
        return <PackagePage />;
      case "servicePackage":
        return <ServicePackagePage />;
      case "payment":
        return <PaymentPage />;
      case "report":
        return <ReportPage />;
      default:
        return <CarPage />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;