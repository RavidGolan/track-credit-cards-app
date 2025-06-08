import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './TransactionFileLoader.css';
import ITransaction from '@Interfaces/ITransaction';
import { CreditCards } from '../../common/enums/CreditCards';
import { StorageService } from '../../services/supabase/storageService';
import ICreditCardIssuersService from '@Interfaces/ICreditCardIssuersService';
import { CreditCardsServices } from '../../services/CreditCardsServices';
import {
    CreditCardToIssuerMap,
    CreditCardToNumberMap,
} from '../../common/utils/creditCardMappings';

interface TransactionFileLoaderProps {
    year: string;
    month: string;
    setYear: (year: string) => void;
    setMonth: (month: string) => void;
    onLoad: (transactions: ITransaction[]) => void;
}

const TransactionFileLoader: React.FC<TransactionFileLoaderProps> = ({
                                                                         year,
                                                                         month,
                                                                         setYear,
                                                                         setMonth,
                                                                         onLoad,
                                                                     }) => {
    const [status, setStatus] = useState<string>('');
    const [availableYearsAndMonths, setAvailableYearsAndMonths] = useState<Record<string, string[]>>({});

    // Load available years/months on mount
    useEffect(() => {
        const loadYearsAndMonths = async () => {
            const folderMap = await StorageService.getAvailableYearsAndMonths();
            setAvailableYearsAndMonths(folderMap);

            if (!(year && month)) {
                const sortedYears = Object.keys(folderMap).sort((a, b) => Number(a) - Number(b));
                const latestYear = sortedYears.at(-1) || '';
                const sortedMonths = folderMap[latestYear]?.sort((a, b) => Number(a) - Number(b)) || [];
                const latestMonth = sortedMonths.at(-1) || '';

                if (!year) setYear(latestYear);
                if (!month) setMonth(latestMonth);
            }
        };

        loadYearsAndMonths();
    }, [setYear, setMonth, year, month]);

    // Fetch transactions when year or month changes
    const handleLoad = useCallback(async () => {
        if (!year || !month) {
            setStatus('יש לבחור שנה וחודש');
            return;
        }

        const folder = `${year}/${month}`;
        const loadTransactions = async (currentCreditCard: CreditCards): Promise<ITransaction[]> => {
            const filename = `${CreditCardToNumberMap[currentCreditCard]}_${month}_${year}.xlsx`;
            const path = `${folder}/${filename}`;

            try {
                setStatus('טוען את הקובץ מהאחסון...');
                const data = await StorageService.parseExcelFileFromStorage(path);
                setStatus('✅ הקובץ נטען בהצלחה');

                const service: ICreditCardIssuersService | undefined = CreditCardsServices[CreditCardToIssuerMap[currentCreditCard]];
                if (!service) return [];

                const transactions = service.transformRawData(data);
                return transactions.map((t) => ({ ...t, source: currentCreditCard }));
            } catch (err) {
                console.error(err);
                setStatus('❌ הקובץ לא נמצא או שגיאה בקריאה');
                return [];
            }
        };

        const allTransactions = await Promise.all(
            Object.values(CreditCards).map((card) => loadTransactions(card as CreditCards))
        );

        onLoad(allTransactions.flat());
    }, [year, month, onLoad]);

    // Automatically trigger load when both year & month are set
    useEffect(() => {
        if (year && month) {
            handleLoad();
        }
    }, [year, month, handleLoad]);

    const years = useMemo(
        () => Object.keys(availableYearsAndMonths).sort((a, b) => Number(a) - Number(b)),
        [availableYearsAndMonths]
    );
    const months = (availableYearsAndMonths[year] || []).sort((a, b) => Number(a) - Number(b));

    if (!availableYearsAndMonths || Object.keys(availableYearsAndMonths).length === 0) {
        return <div>טוען...</div>; // Or a spinner
    }

    return (
        <div className="transaction-file-loader-container" dir="rtl">
            <h2 className="transaction-file-loader-title">טעינת קובץ עסקאות מהאחסון</h2>

            <div className="transaction-file-loader-selects">
                <label>
                    שנה:
                    <select value={years.includes(year) ? year : ''} onChange={(e) => setYear(e.target.value)}>
                        <option value="">בחר</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    חודש:
                    <select value={months.includes(month) ? month : ''} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">בחר</option>
                        {months.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <p className="transaction-file-loader-status">{status}</p>
        </div>
    );
};

export default TransactionFileLoader;
