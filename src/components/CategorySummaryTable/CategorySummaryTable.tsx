import React from 'react';
import ITransaction from '@Interfaces/ITransaction';
import './CategorySummaryTable.css';
import {Category} from "../../common/enums/Category";
import {TransactionType} from "../../common/enums/TransactionType";

interface CategorySummaryTableProps {
    transactions: ITransaction[];
}

interface SummaryRow {
    transactionType: TransactionType | 'Unknown';
    category: Category | 'Uncategorized';
    total: number;
}

const formatCurrency = (value: number): string =>
    value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

const groupByCategoryAndType = (transactions: ITransaction[]): SummaryRow[] => {
    const totals: Record<string, number> = {};

    for (const tx of transactions) {
        const category = tx.category || 'Uncategorized';
        const type = tx.transactionType || 'Unknown';

        const key = `${category}::${type}`;
        const amount = tx.billedAmount ?? tx.amount ?? 0;
        totals[key] = (totals[key] || 0) + amount;
    }

    return Object.entries(totals).map(([key, total]) => {
        const [category, transactionType] = key.split('::');
        return {
            category: category as Category | 'Uncategorized',
            transactionType: transactionType as TransactionType | 'Unknown',
            total,
        };
    });
};

const sortSummary = (summary: SummaryRow[]) => {
    summary.sort((a, b) => {
        if (a.category === 'Uncategorized') return 1;
        if (b.category === 'Uncategorized') return -1;

        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) return catCompare;

        return a.transactionType.localeCompare(b.transactionType);
    });
}


const CategorySummaryTable: React.FC<CategorySummaryTableProps> = ({ transactions }) => {
    const summary = groupByCategoryAndType(transactions);
    sortSummary(summary);

    return (
        <div className="category-summary-container">
            <h3 className="category-summary-title">Summary by Category</h3>
            <table className="category-summary-table">
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Transaction Type</th>
                    <th>Total (₪)</th>
                </tr>
                </thead>
                <tbody>
                {summary.map(({category, transactionType, total}) => (
                    <tr key={`${category}-${transactionType}`}>
                        <td>{category}</td>
                        <td>{transactionType}</td>
                        <td className="amount">{formatCurrency(total)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
};

export default CategorySummaryTable;
