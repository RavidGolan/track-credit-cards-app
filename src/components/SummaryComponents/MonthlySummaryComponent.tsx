import React from "react";
import "./SummaryComponent.css"

interface MonthlySummaryComponentProp {
    sumIncomes: number,
    sumConstantTransactions: number,
    sumChangingTransactions: number
}

const MonthlySummaryComponent: React.FC<MonthlySummaryComponentProp> = ({sumIncomes, sumConstantTransactions, sumChangingTransactions }) => {
    const balance =
        sumIncomes - sumConstantTransactions - sumChangingTransactions;

    const formatCurrency = (value: number) => {
        const formatted = Math.abs(value).toLocaleString('he-IL', {
            maximumFractionDigits: 0,
        }) + ' ₪';
        const operator = value < 0 ? '-' : ' ';
        return `${operator} ${formatted}`;
    };

    return (<div className="summary-container">
        <h3 className="summary-title">סיכום חודשי</h3>
        <pre className="summary-equation">
                    {formatCurrency(sumIncomes)}{'\n'}
            {formatCurrency(-sumConstantTransactions)}{'\n'}
            {formatCurrency(-sumChangingTransactions)}{'\n'}
            {'____________'}{'\n'}
                </pre>

        <pre className="summary-sum">
                    {formatCurrency(balance)}
                </pre>
    </div>);
}

export default MonthlySummaryComponent;
