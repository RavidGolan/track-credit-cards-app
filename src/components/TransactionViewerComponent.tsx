import React, {useEffect, useState} from 'react';
import FileReaderComponent from './FileReaderComponent';
import ITransaction from "@Interfaces/ITransaction";
import {CreditCards} from "../common/enums/CreditCards";
import {CardIssuers} from "../common/enums/CardIssuers";
import TransactionsAgGridComponent from "./TransactionsAgGridComponent/TransactionsAgGridComponent";
import BankTransactionsService from "../services/BankTransactionsService";

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]); // Use an array to hold data from multiple cards

    function loadInitialTransactions(): ITransaction[] {
        return BankTransactionsService.getTransactions(); // For now, just return empty
    }

    // ✅ Load initial transactions on mount
    useEffect(() => {
        const initial = loadInitialTransactions();
        setTransactions(initial);
    }, []);

    // Update the onData handler to append new transactions
    const handleNewData = (newData: ITransaction[]) => {
        setTransactions((prevTransactions) => [...prevTransactions, ...newData]);
    };

    return (
        <div>
            {/* Add multiple FileReaderComponent instances */}
            <FileReaderComponent creditCard={CreditCards.AMERICAN_EXPRESS} vendor={CardIssuers.AMERICAN_EXPRESS} onData={handleNewData} />
            <FileReaderComponent creditCard={CreditCards.MAX} vendor={CardIssuers.MAX} onData={handleNewData} />
            {/* Render table only if there are transactions */}
            {transactions.length > 0 && <TransactionsAgGridComponent transactions={transactions} />}
        </div>
    );
};

export default TransactionViewerComponent;
