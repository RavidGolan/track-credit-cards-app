import React, { useState } from 'react';
import FileReaderComponent from './FileReaderComponent';
import TransactionsTableComponent from './TransactionsTableComponent/TransactionsTableComponent';
import ITransaction from "@Interfaces/ITransaction";

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    return (
        <div>
            <FileReaderComponent onData={setTransactions} />
            {transactions.length > 0 && <TransactionsTableComponent transactions={transactions} />}
        </div>
    );
};

export default TransactionViewerComponent;
