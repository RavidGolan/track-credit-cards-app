import React, {useEffect, useState} from "react";
import IncomesService from "../../services/supabase/IncomesService";
import IIncome from "@Interfaces/IIncome";
import "./SummaryTable.css"

const IncomesComponent: React.FC = () => {
    const [incomes, setIncomes] = useState<IIncome[]>([]);

    useEffect(() => {
        const fetchIncomes = async () => {
            const incomes: IIncome[] = await IncomesService.getIncomesByYearAndMonth(2025, 5);
            setIncomes(incomes);
        }

        fetchIncomes()
    }, []) // ← empty array means run once on mount



    return (
        /*<section className="incomes-section">
            <h2 className="incomes-title">הכנסות חודשיות</h2>

            {incomes.length > 0 ? (
                <ul className="income-list">
                    {incomes.map((income, index) => (
                        <li key={index} className="income-item">
                            <span className="income-amount">{income.amount.toLocaleString()} ₪</span>
                            <span className="income-type">{income.type}</span>
                        </li>
                    ))}
                    <li className="income-item">
                        <span
                            className="income-amount">{incomes.reduce((sum, value) => sum + value.amount, 0).toLocaleString()} ₪</span>
                        <span className="income-type">סה״כ</span>
                    </li>
                </ul>
            ) : (
                <p className="no-income">No incomes found for this period.</p>
            )}
        </section>*/

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
                    <td className="amount">{income.amount.toLocaleString()} ₪</td>
                </tr>
            ))}
            <tr className={"summary-sum"}>
                <td>
                    סה״כ
                </td>
                <td>{incomes.reduce((sum, value) => sum + value.amount, 0).toLocaleString()} ₪</td>
            </tr>
            </tbody>
        </table>
    </div>

    )
        ;
}

export default IncomesComponent;
