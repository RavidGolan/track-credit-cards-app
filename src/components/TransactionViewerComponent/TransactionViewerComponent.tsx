import React, {useEffect, useState} from 'react';
import FileReaderComponent from '../FileReaderComponent/FileReaderComponent';
import ITransaction from "@Interfaces/ITransaction";
import {CreditCards} from "../../common/enums/CreditCards";
import {CreditCardIssuers} from "../../common/enums/CreditCardIssuers";
import TransactionsAgGridComponent from "../TransactionsAgGridComponent/TransactionsAgGridComponent";
import BankTransactionsService from "../../services/BankTransactionsService";
import CategorySummaryTable from "../CategorySummaryTable/CategorySummaryTable";
import {getVendorCategory} from "../../services/supabase/vendorCategoryService";
import TransactionFileLoader from "../TransactionsFileLoader/TransactionsFileLoader";

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
            <CategorySummaryTable transactions={transactions} />
            {/* Add multiple FileReaderComponent instances */}
            <FileReaderComponent creditCard={CreditCards.AMERICAN_EXPRESS} vendor={CreditCardIssuers.AMERICAN_EXPRESS} onData={handleNewData} />
            <FileReaderComponent creditCard={CreditCards.MAX} vendor={CreditCardIssuers.MAX} onData={handleNewData} />
            {/* Render table only if there are transactions */}
            {transactions.length > 0 && <TransactionsAgGridComponent transactions={transactions} />}
        </div>
    );
};

export default TransactionViewerComponent;
