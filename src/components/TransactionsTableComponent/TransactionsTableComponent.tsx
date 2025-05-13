import React from 'react';
import './TransactionsTableComponent.css';
import ITransaction from '@Interfaces/ITransaction';

interface Props {
    transactions: ITransaction[];
}

const TransactionsTableComponent: React.FC<Props> = ({ transactions }) => {
    return (
        <table className="transactions-table">
            <thead>
            <tr>
                <th>Source</th>
                <th>Constant / Changing</th>
                <th>Date</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Details</th>
                <th>Billed Amount</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx, index) => (
                <tr key={index}>
                    <td>{tx.source}</td>
                    <td>{tx.transactionType || "N/A"}</td>
                    <td>{tx.date}</td>
                    <td>{tx.vendor}</td>
                    <td>{tx.category}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.type}</td>
                    <td>{tx.details}</td>
                    <td>{tx.billedAmount}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TransactionsTableComponent;
