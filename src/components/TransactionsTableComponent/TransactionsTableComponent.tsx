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
                <th>סכום חיוב</th>
                <th>פרטים</th>
                <th>סוג</th>
                <th>סכום עסקה</th>
                <th>בית עסק</th>
                <th>תאריך</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx, index) => (
                <tr key={index}>
                    <td>{tx.billedAmount}</td>
                    <td>{tx.details}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.vendor}</td>
                    <td>{tx.date}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TransactionsTableComponent;
