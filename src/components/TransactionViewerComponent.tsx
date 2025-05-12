import React, { useState } from 'react';
import FileReaderComponent from './FileReaderComponent';
import TransactionsTableComponent from './TransactionsTableComponent/TransactionsTableComponent';
import ITransaction from "@Interfaces/ITransaction";
import {CreditCards} from "../common/enums/CreditCards";
import {Vendors} from "../common/enums/Vendors";

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]); // Use an array to hold data from multiple cards

    // Update the onData handler to append new transactions
    const handleNewData = (newData: any[]) => {
        setTransactions((prevTransactions) => [...prevTransactions, ...newData]);
    };

    return (
        <div>
            {/* Add multiple FileReaderComponent instances */}
            <FileReaderComponent creditCard={CreditCards.AMERICAN_EXPRESS} vendor={Vendors.AMERICAN_EXPRESS} onData={handleNewData} />
            <FileReaderComponent creditCard={CreditCards.MAX} vendor={Vendors.MAX} onData={handleNewData} />
            {/* Render table only if there are transactions */}
            {transactions.length > 0 && <TransactionsTableComponent transactions={transactions} />}
        </div>
    );
};

export default TransactionViewerComponent;
