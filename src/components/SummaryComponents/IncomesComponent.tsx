import React, {useEffect, useState} from "react";
import IncomesService from "../../services/supabase/IncomesService";
import IIncome from "@Interfaces/IIncome";
import "./SummaryComponent.css";

interface IncomesComponentProps {
    sumCalculation?: (sum: number) => void;
}

const formatCurrency = (value: number): string =>
    value.toLocaleString('he-IL', {
        maximumFractionDigits: 0,
    });

const IncomesComponent: React.FC<IncomesComponentProps> = ({sumCalculation}) => {
    const [incomes, setIncomes] = useState<IIncome[]>([]);

    useEffect(() => {
        const fetchIncomes = async () => {
            const incomes: IIncome[] = await IncomesService.getIncomesByYearAndMonth(2025, 5);
            setIncomes(incomes);
        }

        fetchIncomes()
    }, []) // ← empty array means run once on mount

    const sum = incomes.reduce((sum, value) => sum + value.amount, 0);
    useEffect(() => {
        if (sumCalculation) {
            sumCalculation(sum);
        }
    }, [sum, sumCalculation]);

    return (
        <div className="summary-container" dir="rtl">
            <h3 className="summary-title">הכנסות חודשיות</h3>
            <table className="summary-table">
                <thead>
                <tr>
                    <th>קטגוריה</th>
                    <th>סה״כ</th>
                </tr>
                </thead>
                <tbody>
                {incomes.map((income, index) => (
                    <tr key={index}>
                        <td>
                            {income.type}
                        </td>
                        <td className="amount">{formatCurrency(income.amount)} ₪</td>
                    </tr>
                ))}
                <tr className={"summary-sum"}>
                    <td>
                        סה״כ
                    </td>
                    <td>{formatCurrency(sum)} ₪</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
        ;
}

export default IncomesComponent;
