import React from "react";
import {TransactionType} from "../../common/enums/TransactionType";
import CategorySummaryComponent from "../SummaryComponents/CategorySummaryComponent";
import ITransaction from "@Interfaces/ITransaction";
import {Category} from "../../common/enums/Category";
import "./SummaryComponent.css"
import IncomesComponent from "../SummaryComponents/IncomesComponent";

interface SummaryComponentProps {
    transactions: ITransaction[],
    onCategoryClick?: (category: Category | 'ללא קטגוריה' | undefined) => void;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({transactions, onCategoryClick}) => {
    return (<div className={"category-summaries-container"}>
        <CategorySummaryComponent title={"סיכום הוצאות קבועות"}
                                  transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CONSTANT)}
                                  onCategoryClick={onCategoryClick}/>
        <CategorySummaryComponent title={"סיכום הוצאות משתנות"}
                                  transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CHANGING)}
                                  onCategoryClick={onCategoryClick}/>
        <IncomesComponent></IncomesComponent>
    </div>);
}

export default SummaryComponent;
