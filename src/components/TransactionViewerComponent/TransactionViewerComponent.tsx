import React, {useEffect, useState} from 'react';
import ITransaction from "@Interfaces/ITransaction";
import TransactionsAgGridComponent from "../TransactionsAgGridComponent/TransactionsAgGridComponent";
import BankTransactionsService from "../../services/BankTransactionsService";
import CategorySummaryTable from "../CategorySummaryTable/CategorySummaryTable";
import {getVendorCategory} from "../../services/supabase/vendorCategoryService";
import TransactionFileLoader from "../TransactionsFileLoader/TransactionsFileLoader";
import {TransactionType} from "../../common/enums/TransactionType";
import './TransactionViewerComponent.css';

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]); // Use an array to hold data from multiple cards

    function loadInitialTransactions(): ITransaction[] {
        return BankTransactionsService.getTransactions(); // For now, just return empty
    }

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

    // ✅ Load initial transactions on mount
    useEffect(() => {
        const init = async () => {
            const rawTransactions = loadInitialTransactions();
            const enriched = await enrichTransactionsWithCategories(rawTransactions);
            setTransactions(enriched);
        };

        init();
    }, []);

    // Update the onData handler to append new transactions
    const handleNewData = async (newTransactions: ITransaction[]) => {
        const enriched = await enrichTransactionsWithCategories(newTransactions);
        setTransactions((prev) => [...prev, ...enriched]);
    };

    return (
        <div>
            <TransactionFileLoader onData={handleNewData} />
            <div className={"category-summaries-container"}>
                <CategorySummaryTable title={"סיכום הוצאות קבועות"} transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CONSTANT)} />
                <CategorySummaryTable title={"סיכום הוצאות משתנות"} transactions={transactions.filter(transaction => transaction.transactionType === TransactionType.CHANGING)} />
            </div>
            {/* Render table only if there are transactions */}
            {transactions.length > 0 && <TransactionsAgGridComponent transactions={transactions} />}
        </div>
    );
};

export default TransactionViewerComponent;
