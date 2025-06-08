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
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';

const TransactionViewerComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filteredCategory, setFilteredCategory] = useState<Category | 'ללא קטגוריה'>();

    // region handle year & month

    const { year: paramYear, month: paramMonth } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [year, setYear] = useState(paramYear || '');
    const [month, setMonth] = useState(paramMonth || '');
    const showIncomes = searchParams.has('showIncomes');

    // Sync dropdown change to URL
    const updateURL = (newYear: string, newMonth: string) => {
        const query = showIncomes ? '?showIncomes' : '';
        navigate(`/transactions/${newYear}/${newMonth}${query}`);
    };

    const handleSetYear = (newYear: string) => {
        setYear(newYear);
        if (month) updateURL(newYear, month);
    };

    const handleSetMonth = (newMonth: string) => {
        setMonth(newMonth);
        if (year) updateURL(year, newMonth);
    };


    // endregion handle year & month

    const bankTransactionsRef = useRef<ITransaction[]>([]);

    // Load bank transactions on mount
    useEffect(() => {
        const init = async () => {
            const rawTransactions = BankTransactionsService.getTransactions();
            const enriched = await _enrichTransactions(rawTransactions);
            setTransactions(enriched);
            bankTransactionsRef.current = enriched;
        };
        init();
    }, []);

    const _enrichTransactions = async (
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
            const enriched = await _enrichTransactions(newTransactions);
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
                setYear={handleSetYear}
                setMonth={handleSetMonth}
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
