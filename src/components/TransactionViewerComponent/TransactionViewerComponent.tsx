import React, {useEffect, useMemo, useState} from 'react';
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
    const [aggregateKey, setAggregateKey] = useState<keyof ITransaction | undefined>();

    const TRANSACTION_KEYS: (keyof ITransaction)[] = [
        'vendor',
        'category',
        'amount',
        'billedAmount',
        'date',
        'source',
        'transactionType',
        'type',
        'details',
    ];

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

    function aggregateTransactionsByKey<K extends keyof ITransaction>(
        transactions: ITransaction[],
        key: K
    ): ITransaction[] {
        const grouped: Record<string, ITransaction[]> = {};

        for (const tx of transactions) {
            const groupKey = tx[key] || 'ללא ערך'; // fallback for undefined
            const groupKeyStr = String(groupKey); // ensure string key
            if (!grouped[groupKeyStr]) grouped[groupKeyStr] = [];
            grouped[groupKeyStr].push(tx);
        }

        return Object.values(grouped).map((group) => {
            const sample = group[0];

            // Merge string fields without duplicates
            const mergedStrings = <T extends keyof ITransaction>(
                field: T
            ): string =>
                Array.from(new Set(group.map((t) => t[field] as string).filter(Boolean))).join('\n');

            // Sum numeric fields
            const summedNumbers = (field: 'amount' | 'billedAmount'): number =>
                group.reduce((sum, t) => sum + (t[field] ?? 0), 0);

            const aggregated: Partial<ITransaction> = {
                ...sample, // preserve aggregation key value exactly
                amount: summedNumbers('amount'),
                billedAmount: summedNumbers('billedAmount'),
            };

            // Iterate all string keys and merge if not the aggregation key
            (['date', 'vendor', 'category', 'source', 'type', 'details', 'transactionType'] as (keyof ITransaction)[]).forEach(k => {
                if (k !== key) {
                    aggregated[k] = mergedStrings(k) as any;
                }
            });

            return aggregated as ITransaction;
        });
    }




    const displayedTransactions = useMemo(() => {
        if (!aggregateKey) return transactions;
        return aggregateTransactionsByKey(transactions, aggregateKey);
    }, [transactions, aggregateKey]);

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
            <div>
                <select
                    value={aggregateKey || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        setAggregateKey(value === '' ? undefined : (value as keyof ITransaction));
                    }}
                >
                    <option value="">ללא אגרגציה</option>
                    {TRANSACTION_KEYS.map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
                <label>קבץ לפי</label>
            </div>
            {transactions.length > 0 &&
                <TransactionsAgGridComponent
                    transactions={displayedTransactions}
                    filteredCategory={filteredCategory}/>}
        </div>
    );
};

export default TransactionViewerComponent;
