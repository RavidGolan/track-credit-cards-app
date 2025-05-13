import React from 'react';
import ITransaction from '@Interfaces/ITransaction';
import './CategorySummaryTable.css';
import {Category} from "../../common/enums/Category";
import {TransactionType} from "../../common/enums/TransactionType";

interface CategorySummaryTableProps {
    transactions: ITransaction[];
}

interface SummaryRow {
    category: Category | 'ללא קטגוריה';
    transactionType: TransactionType | 'לא ידוע';
    total: number;
}

const formatCurrency = (value: number): string =>
    value.toLocaleString('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

const groupByCategoryAndType = (transactions: ITransaction[]): SummaryRow[] => {
    const totals: Record<string, number> = {};

    for (const tx of transactions) {
        const category = tx.category || 'ללא קטגוריה';
        const type = tx.transactionType || 'לא ידוע';
        const key = `${category}::${type}`;
        const amount = tx.billedAmount ?? 0;
        totals[key] = (totals[key] || 0) + amount;
    }

    const summary = Object.entries(totals).map(([key, total]) => {
        const [category, transactionType] = key.split('::');
        return {
            category: category as Category | 'ללא קטגוריה',
            transactionType: transactionType as TransactionType | 'לא ידוע',
            total,
        };
    });

    return [...summary].sort((a, b) => {
        if (a.category === 'ללא קטגוריה') return 1;
        if (b.category === 'ללא קטגוריה') return -1;
        return a.category.localeCompare(b.category, 'he');
    });
};

const CategorySummaryTable: React.FC<CategorySummaryTableProps> = ({ transactions }) => {
    const summary = groupByCategoryAndType(transactions);

    return (
        <div className="category-summary-container" dir="rtl">
            <h3 className="category-summary-title">סיכום לפי קטגוריה</h3>
            <table className="category-summary-table">
                <thead>
                <tr>
                    <th>קטגוריה</th>
                    <th>סוג עסקה</th>
                    <th>סה״כ</th>
                </tr>
                </thead>
                <tbody>
                {summary.map(({ category, transactionType, total }) => (
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
