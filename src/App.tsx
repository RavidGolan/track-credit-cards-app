import React from 'react';
// import logo from './logo.svg';
import './App.css';
import TransactionViewerComponent from "./components/TransactionViewerComponent/TransactionViewerComponent";
import IncomesComponent from "./components/SummaryComponents/IncomesComponent";
import {Route, Routes, useParams} from "react-router-dom";


function IncomesWrapper() {
    const { showIncomes } = useParams();
    return showIncomes ? <IncomesComponent /> : null;
}

function App() {
  return (
    <div>
        <Routes>
            <Route path="/:showIncomes" element={<IncomesWrapper />} />
            <Route path="*" element={null} /> {/* handles all other paths */}
        </Routes>

        <TransactionViewerComponent />
    </div>
  );
}

export default App;
