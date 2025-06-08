import React, { useCallback, useEffect, useRef, useState } from 'react';
import ITransaction from '@Interfaces/ITransaction';
import TransactionsAgGridComponent from '../TransactionsAgGridComponent/TransactionsAgGridComponent';
import BankTransactionsService from '../../services/BankTransactionsService';
import {getCategoryByVendor} from '../../services/supabase/vendorCategoryService';
import {getCategoryByTransactionId} from '../../services/supabase/transactionCategoryOverridesService';
import TransactionFileLoader from '../TransactionsFileLoader/TransactionsFileLoader';
import { Category } from '../../common/enums/Category';
import SummaryComponent from '../SummaryComponents/SummaryComponent';
import {getDetailsByTransactionId} from "../../services/supabase/transactionDetailsService";

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filteredCategory, setFilteredCategory] = useState<Category | 'ללא קטגוריה'>();
    const [year, setYear] = useState<string>('');
    const [month, setMonth] = useState<string>('');

    const bankTransactionsRef = useRef<ITransaction[]>([]);

    // Load bank transactions on mount
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
                category: tx.category ||
                    (await getCategoryByTransactionId(tx.date, tx.vendor, tx.amount)) || (await getCategoryByVendor(tx.vendor)) || '',
                details: (await getDetailsByTransactionId(tx.date, tx.vendor, tx.amount) || tx.details || '')
            }))
        );
    };

    const handleNewData = useCallback(
        async (newTransactions: ITransaction[]) => {
            const enriched = await enrichTransactionsWithCategories(newTransactions);
            setTransactions([...bankTransactionsRef.current, ...enriched]);
        },
        []
    );

    return (
        <div>
            <TransactionFileLoader
                onLoad={handleNewData}
                year={year}
                month={month}
                setYear={setYear}
                setMonth={setMonth}
            />

            <SummaryComponent
                transactions={transactions}
                onCategoryClick={setFilteredCategory}
                year={year}
                month={month}
            />

            {transactions.length > 0 && (
                <TransactionsAgGridComponent
                    transactions={transactions}
                    filteredCategory={filteredCategory}
                />
            )}
        </div>
    );
};

export default TransactionViewerComponent;
