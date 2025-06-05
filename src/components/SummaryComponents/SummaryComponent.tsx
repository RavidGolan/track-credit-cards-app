import React, {useState} from "react";
import {TransactionType} from "../../common/enums/TransactionType";
import CategorySummaryComponent from "./CategorySummaryComponent";
import ITransaction from "@Interfaces/ITransaction";
import {Category} from "../../common/enums/Category";
import "./SummaryComponent.css"
import IncomesComponent from "./IncomesComponent";
import MonthlySummaryComponent from "./MonthlySummaryComponent";
import {useSearchParams} from "react-router-dom";

interface SummaryComponentProps {
    transactions: ITransaction[],
    onCategoryClick?: (category: Category | 'ללא קטגוריה' | undefined) => void;
    year: string;
    month: string;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({transactions, onCategoryClick, year, month}) => {
    const [sumConstantTransactions, setSumConstantTransactions] = useState<number>(0);
    const [sumChangingTransactions, setSumChangingTransactions] = useState<number>(0 );
    const [sumIncomes, setSumIncomes] = useState<number>(0);

    const [searchParams] = useSearchParams();
    const showIncomes = searchParams.has('showIncomes');
    console.log("showIncomes: " + showIncomes);

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
            {showIncomes && (
                <>
                    <IncomesComponent sumCalculation={setSumIncomes} year={year} month={month}/>
                    <MonthlySummaryComponent sumIncomes={sumIncomes} sumConstantTransactions={sumConstantTransactions} sumChangingTransactions={sumChangingTransactions} />
                </>
            )}
        </div>
    );
}

export default SummaryComponent;
