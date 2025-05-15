import React, { useState } from 'react';
import './TransactionFileLoader.css';
import ITransaction from "@Interfaces/ITransaction";
import {CreditCards} from "../../common/enums/CreditCards";
import {StorageService} from "../../services/supabase/storageService";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {CreditCardsServices} from "../../services/CreditCardsServices";
import {CreditCardToIssuerMap} from "../../common/utils/creditCardMappings";

interface Props {
    onData: (data: ITransaction[]) => void;
}

const TransactionFileLoader: React.FC<Props> = ({ onData }) => {
    const [creditCard, setCreditCard] = useState<CreditCards | ''>('');
    const [year, setYear] = useState<number | ''>('');
    const [month, setMonth] = useState<number | ''>('');
    const [status, setStatus] = useState<string>('');

    const handleLoad = async () => {
        if (!creditCard || !year || !month) {
            setStatus('יש לבחור כרטיס, שנה וחודש');
            return;
        }

        const folder = `${year}/${month.toString().padStart(2, '0')}`;
        const filename = `${creditCard}.xlsx`;
        const path = `${folder}/${filename}`;

        try {
            setStatus('טוען את הקובץ מהאחסון...');
            const data = await StorageService.parseExcelFileFromStorage(path);
            setStatus('✅ הקובץ נטען בהצלחה');


            const service: ICreditCardIssuersService | undefined = CreditCardsServices[CreditCardToIssuerMap[creditCard]];
            if (!service) {
                console.warn(`No service found for vendor: ${creditCard}`);
                return;
            }

            let transactions = service.transformRawData(data);
            onData(transactions);
        } catch (err: any) {
            console.error(err);
            setStatus('❌ הקובץ לא נמצא או שגיאה בקריאה');
            onData([]);
        }
    };

    const monthNames = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];

    return (
        <div className="transaction-file-loader-container" dir="rtl">
            <h2 className="transaction-file-loader-title">טעינת קובץ עסקאות מהאחסון</h2>

            <div className="transaction-file-loader-selects">
                <label>
                    כרטיס אשראי:
                    <select value={creditCard} onChange={(e) => setCreditCard(e.target.value as CreditCards)}>
                        <option value="">בחר</option>
                        {Object.values(CreditCards).map((card) => (
                            <option key={card} value={card}>{card}</option>
                        ))}
                    </select>
                </label>

                <label>
                    שנה:
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        <option value="">בחר</option>
                        {[2022, 2023, 2024, 2025].map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </label>

                <label>
                    חודש:
                    <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                        <option value="">בחר</option>
                        {monthNames.map((name, index) => (
                            <option key={index + 1} value={index + 1}>{name}</option>
                        ))}
                    </select>
                </label>

                <button className="transaction-file-loader-button" onClick={handleLoad}>טען קובץ</button>
            </div>

            <p className="transaction-file-loader-status">{status}</p>
        </div>
    );
};

export default TransactionFileLoader;
