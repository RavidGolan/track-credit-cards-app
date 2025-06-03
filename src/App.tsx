import React from 'react';
// import logo from './logo.svg';
import './App.css';
import TransactionViewerComponent from "./components/TransactionViewerComponent/TransactionViewerComponent";
import IncomesComponent from "./components/IncomesComponent/IncomesComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <IncomesComponent />
        <TransactionViewerComponent />
      </header>
    </div>
  );
}

export default App;
