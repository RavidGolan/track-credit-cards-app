import React, {useCallback, useEffect, useRef, useState} from 'react';
import ITransaction from "@Interfaces/ITransaction";
import TransactionsAgGridComponent from "../TransactionsAgGridComponent/TransactionsAgGridComponent";
import BankTransactionsService from "../../services/BankTransactionsService";
import CategorySummaryTable from "../CategorySummaryTable/CategorySummaryTable";
import {getVendorCategory} from "../../services/supabase/vendorCategoryService";
import TransactionFileLoader from "../TransactionsFileLoader/TransactionsFileLoader";
import {TransactionType} from "../../common/enums/TransactionType";
import './TransactionViewerComponent.css';
import {Category} from "../../common/enums/Category";

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]); // Use an array to hold data from multiple cards
    const [filteredCategory, setFilteredCategory] = useState<Category | 'ללא קטגוריה'>();

    const bankTransactionsRef = useRef<ITransaction[]>([]);
    // ✅ Load initial transactions on mount
    useEffect(() => {
        const init = async () => {
            const rawTransactions = BankTransactionsService.getTransactions();
            const enriched = await enrichTransactionsWithCategories(rawTransactions);
            setTransactions(enriched);
            bankTransactionsRef.current = enriched;
        };

        init();
    }, []);

    const enrichTransactionsWithCategories = async (
        txs: ITransaction[]
    ): Promise<ITransaction[]> => {
        return Promise.all(
            txs.map(async (tx) => ({
                ...tx,
                category: tx.category || (await getVendorCategory(tx.vendor)) || '',
            }))
        );
    };

    // Update the onData handler to append new transactions
    const handleNewData = useCallback(async (newTransactions: ITransaction[]) => {
        const enriched = await enrichTransactionsWithCategories(newTransactions);
        setTransactions([...bankTransactionsRef.current, ...enriched]);
    },[]);

    return (
        <div>
            <TransactionFileLoader onData={handleNewData}/>
            <div className={"category-summaries-container"}>
                <CategorySummaryTable title={"סיכום הוצאות קבועות"}
                                      transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CONSTANT)}
                                      onCategoryClick={setFilteredCategory}/>
                <CategorySummaryTable title={"סיכום הוצאות משתנות"}
                                      transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CHANGING)}
                                      onCategoryClick={setFilteredCategory}/>
            </div>
            {transactions.length > 0 &&
                <TransactionsAgGridComponent
                    transactions={transactions}
                    filteredCategory={filteredCategory}/>}
        </div>
    );
};

export default TransactionViewerComponent;
