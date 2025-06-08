import React, {useEffect} from 'react';
import ITransaction from '@Interfaces/ITransaction';
import './SummaryComponent.css';
import {Category} from "../../common/enums/Category";
import {TransactionType} from "../../common/enums/TransactionType";

interface CategorySummaryTableProps {
    transactions: ITransaction[];
    title?: string;
    onCategoryClick?: (category: Category | 'ללא קטגוריה' | undefined) => void;
    sumCalculation?: (sum: number) => void;
}

interface SummaryRow {
    category: Category | 'ללא קטגוריה';
    total: number;
}

const formatCurrency = (value: number): string =>
    value.toLocaleString('he-IL', {
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

const CategorySummaryComponent: React.FC<CategorySummaryTableProps> = ({ transactions, title, onCategoryClick, sumCalculation}) => {
    const summary = groupByCategoryAndType(transactions);
    const sum = Object.values(summary).reduce((sum, value) => sum + value.total, 0);

    useEffect(() => {
        if (sumCalculation) {
            sumCalculation(sum);
        }
    }, [sum, sumCalculation]);

    return (
        <div className="summary-container">
            {title && (<h3 className="summary-title">{title}</h3>)}
            <table className="summary-table">
                <thead>
                <tr>
                    <th>קטגוריה</th>
                    <th>סה״כ</th>
                </tr>
                </thead>
                <tbody>
                {summary
                    .filter(({ total }) => (total > 0))
                    .map(({ category, total }) => (
                    <tr key={`${category}`}>
                        <td onClick={() => onCategoryClick?.(category)}>
                            {category}
                        </td>
                        <td className="amount">{formatCurrency(total)}  ₪</td>
                    </tr>
                ))}
                <tr className={"summary-sum"}>
                    <td onClick={() => onCategoryClick?.(undefined)}>
                        סה״כ
                    </td>
                    <td>{formatCurrency(sum)}  ₪</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CategorySummaryComponent;
