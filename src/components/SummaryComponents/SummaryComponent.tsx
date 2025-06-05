import React, {useState} from "react";
import {TransactionType} from "../../common/enums/TransactionType";
import CategorySummaryComponent from "./CategorySummaryComponent";
import ITransaction from "@Interfaces/ITransaction";
import {Category} from "../../common/enums/Category";
import "./SummaryComponent.css"
import IncomesComponent from "./IncomesComponent";

interface SummaryComponentProps {
    transactions: ITransaction[],
    onCategoryClick?: (category: Category | 'ללא קטגוריה' | undefined) => void;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({transactions, onCategoryClick}) => {
    const [sumConstantTransactions, setSumConstantTransactions] = useState<number>(0);
    const [sumChangingTransactions, setSumChangingTransactions] = useState<number>(0 );
    const [sumIncomes, setSumIncomes] = useState<number>(0);

    const balance =
        sumIncomes - sumConstantTransactions - sumChangingTransactions;

    const formatCurrency = (value: number) => {
        const formatted = Math.abs(value).toLocaleString('he-IL', {
            maximumFractionDigits: 0,
        }) + ' ₪';
        const operator = value < 0 ? '-' : ' ';
        return `${operator} ${formatted}`;
    };

    return (
        <div className={"summaries-container"}>
            <CategorySummaryComponent title={"סיכום הוצאות קבועות"}
                                      transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CONSTANT)}
                                      onCategoryClick={onCategoryClick}
                                      sumCalculation={setSumConstantTransactions}/>
            <CategorySummaryComponent title={"סיכום הוצאות משתנות"}
                                      transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CHANGING)}
                                      onCategoryClick={onCategoryClick}
                                      sumCalculation={setSumChangingTransactions}/>
            <IncomesComponent sumCalculation={setSumIncomes}/>
            <div className="summary-container">
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
            </div>
        </div>
    );
}

export default SummaryComponent;
