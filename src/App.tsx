import React from 'react';
import './App.css';
import TransactionViewerComponent from "./components/TransactionViewerComponent/TransactionViewerComponent";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";

function RedirectWithQueryPreserved() {
    const { search } = useLocation();
    return <Navigate to={`/transactions${search}`} replace />;
}

function App() {
  return (
      <Routes>
          {/* Redirect from / to /transactions while preserving query params */}
          <Route path="/" element={<RedirectWithQueryPreserved />} />

          {/* If no year/month in URL, let component fill defaults and update URL */}
          <Route path="/transactions" element={<TransactionViewerComponent />} />

          {/* Route with year and month in path */}
          <Route path="/transactions/:year/:month" element={<TransactionViewerComponent />} />
      </Routes>
  );
}

export default App;
