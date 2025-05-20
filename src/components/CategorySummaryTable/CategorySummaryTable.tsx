import React from 'react';
import ITransaction from '@Interfaces/ITransaction';
import './CategorySummaryTable.css';
import {Category} from "../../common/enums/Category";
import {TransactionType} from "../../common/enums/TransactionType";

interface CategorySummaryTableProps {
    transactions: ITransaction[];
    title?: string;
    onCategoryClick?: (category: Category | 'ללא קטגוריה' | undefined) => void;
}

interface SummaryRow {
    category: Category | 'ללא קטגוריה';
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

const groupByCategory = (transactions: ITransaction[]): SummaryRow[] => {
    const totals: Record<string, number> = {};

    for (const tx of transactions) {
        const category = tx.category || 'ללא קטגוריה';
        const amount = tx.billedAmount ?? 0;
        totals[category] = (totals[category] || 0) + amount;
    }

    const summary = Object.entries(totals).map(([category, total]) => {
        return {
            category: category as Category | 'ללא קטגוריה',
            total,
        };
    });

    return [...summary].sort((a, b) => {
        if (a.category === 'ללא קטגוריה') return 1;
        if (b.category === 'ללא קטגוריה') return -1;
        return a.category.localeCompare(b.category, 'he');
    });
};

const CategorySummaryTable: React.FC<CategorySummaryTableProps> = ({ transactions, title, onCategoryClick}) => {
    const summary = groupByCategoryAndType(transactions);

    return (
        <div className="category-summary-container" dir="rtl">
            {title && (<h3 className="category-summary-title">{title}</h3>)}
            <table className="category-summary-table">
                <thead>
                <tr>
                    <th>קטגוריה</th>
                    <th>סה״כ</th>
                </tr>
                </thead>
                <tbody>
                {summary.map(({ category, total }) => (
                    <tr key={`${category}`}>
                        <td onClick={() => onCategoryClick?.(category)} className="clickable-category">
                            {category}
                        </td>
                        <td className="amount">{formatCurrency(total)}</td>
                    </tr>
                ))}
                <tr className={"category-summary-sum"}>
                    <td onClick={() => onCategoryClick?.(undefined)} className="clickable-category">
                        סה״כ
                    </td>
                    <td>{formatCurrency(Object.values(summary).reduce((sum, value) => sum + value.total, 0))}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CategorySummaryTable;
