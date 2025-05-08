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
                <th>תאריך</th>
                <th>בית עסק</th>
                <th>סכום עסקה</th>
                <th>סוג</th>
                <th>פרטים</th>
                <th>סכום חיוב</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx, index) => (
                <tr key={index}>
                    <td>{tx.date}</td>
                    <td>{tx.vendor}</td>
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
