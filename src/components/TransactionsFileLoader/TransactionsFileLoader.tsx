import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './TransactionFileLoader.css';
import ITransaction from "@Interfaces/ITransaction";
import {CreditCards} from "../../common/enums/CreditCards";
import {StorageService} from "../../services/supabase/storageService";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {CreditCardsServices} from "../../services/CreditCardsServices";
import {CreditCardToIssuerMap, CreditCardToNumberMap} from "../../common/utils/creditCardMappings";

interface Props {
    onData: (data: ITransaction[]) => void;
}

const TransactionFileLoader: React.FC<Props> = ({ onData }) => {
    const [mode, setMode] = useState<'byMonth' | 'full'>('byMonth');

    const [creditCard, setCreditCard] = useState<CreditCards | ''>('');
    const [year, setYear] = useState<string | ''>('');
    const [month, setMonth] = useState<string | ''>('');
    const [status, setStatus] = useState<string>('');
    const [availableYearsAndMonths, setAvailableYearsAndMonths] = useState<Record<string, string[]>>({})

    useEffect(() => {
        const loadYearsAndMonths = async () => {
            const folderMap = await StorageService.getAvailableYearsAndMonths();
            setAvailableYearsAndMonths(folderMap);

            const sortedYears = Object.keys(folderMap).sort((a, b) => Number(a) - Number(b));
            const latestYear = sortedYears.at(-1) || '';
            const sortedMonths = folderMap[latestYear]?.sort((a, b) => Number(a) - Number(b)) || [];
            const latestMonth = sortedMonths.at(-1) || '';

            // Set state, but don't load yet
            setYear(latestYear);
            setMonth(latestMonth);
        };
        loadYearsAndMonths();
    }, []);

    const handleLoad = useCallback(async () => {

        const loadTransactions = async (currentCreditCard: CreditCards): Promise<ITransaction[]> => {
            const folder = `${year}/${month.toString()}`;
            const filename = `${CreditCardToNumberMap[currentCreditCard]}_${month}_${year}.xlsx`;
            const path = `${folder}/${filename}`;

            try {
                setStatus('טוען את הקובץ מהאחסון...');
                const data = await StorageService.parseExcelFileFromStorage(path);
                setStatus('✅ הקובץ נטען בהצלחה');


                const service: ICreditCardIssuersService | undefined = CreditCardsServices[CreditCardToIssuerMap[currentCreditCard]];
                if (!service) {
                    console.warn(`No service found for vendor: ${currentCreditCard}`);
                    return [];
                }

                let transactions = service.transformRawData(data);
                const transactionsWithSource = transactions.map((transaction) => ({
                    ...transaction,
                    source: currentCreditCard
                }));
                console.log(transactionsWithSource);
                return(transactionsWithSource);
            } catch (err: any) {
                console.error(err);
                setStatus('❌ הקובץ לא נמצא או שגיאה בקריאה');
                return([]);
            }
        }

        if (mode === 'byMonth') {
            if (!year || !month) {
                setStatus('יש לבחור שנה וחודש');
                return;
            }

            const all = await Promise.all(
                Object.values(CreditCards).map(async card =>
                    loadTransactions(card as CreditCards)
                )
            );
            onData(all.flat());

        } else {
            if (!creditCard || !year || !month) {
                setStatus('יש לבחור כרטיס, שנה וחודש');
                return;
            }

            onData(await loadTransactions(creditCard));
        }
    }, [mode, year, month, creditCard, onData]);

    useEffect(() => {
        // Only load if both are set (and not during initial undefined state)
        if (mode === 'byMonth' && year && month) {
            handleLoad();
        } else if (mode === 'full' && year && month && creditCard) {
            handleLoad();
        }
    }, [year, month, creditCard, mode, handleLoad]);

    const years = useMemo(() => Object.keys(availableYearsAndMonths).sort((a, b) => Number(a) - Number(b)), [availableYearsAndMonths]);
    const months = (availableYearsAndMonths[year] || []).sort((a, b) => Number(a) - Number(b));


    return (
        <div className="transaction-file-loader-container" dir="rtl">
            <h2 className="transaction-file-loader-title">טעינת קובץ עסקאות מהאחסון</h2>

            <div className="mode-selector">
                <label>
                    <input
                        type="radio"
                        value="byMonth"
                        checked={mode === 'byMonth'}
                        onChange={() => setMode('byMonth')}
                    />
                    לפי שנה + חודש
                </label>

                <label>
                    <input
                        type="radio"
                        value="full"
                        checked={mode === 'full'}
                        onChange={() => setMode('full')}
                    />
                    לפי שנה + חודש + כרטיס
                </label>
            </div>


            <div className="transaction-file-loader-selects">
                {mode === 'full' && (
                    <label>
                        כרטיס אשראי:
                        <select value={creditCard} onChange={(e) => setCreditCard(e.target.value as CreditCards)}>
                            <option value="">בחר</option>
                            {Object.values(CreditCards).map((card) => (
                                <option key={card} value={card}>{card}</option>
                            ))}
                        </select>
                    </label>
                )}

                <label>
                    שנה:
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="">בחר</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </label>

                <label>
                    חודש:
                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">בחר</option>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </label>
            </div>

            <p className="transaction-file-loader-status">{status}</p>
        </div>
    );
};

export default TransactionFileLoader;
