import React, {useEffect, useState} from "react";
import IncomesService from "../../services/supabase/IncomesService";
import IIncome from "@Interfaces/IIncome";
import "./IncomesComponent.css"
import {IncomeType} from "../../common/enums/IncomeType";

const IncomesComponent: React.FC = () => {
    const [incomes, setIncomes] = useState<IIncome[]>([]);

    const shushu = (type: IncomeType): void => {
        console.log(type);
    }

    useEffect(() => {
        const fetchIncomes = async () => {
            const incomes: IIncome[] = await IncomesService.getIncomesByYearAndMonth(2025, 5);
            setIncomes(incomes);
            shushu(incomes[0].type);
            console.log(incomes[0].type);
            console.log(incomes[0].type === IncomeType.CHILDREN_ALLOWANCE);
            console.log(incomes[0].type === IncomeType.RENT);
            console.log(incomes[0].type === IncomeType.RAVID_SALARY);
            console.log(incomes[0].type === IncomeType.TAL_SALARY);
        }

        fetchIncomes()
    }, []) // ← empty array means run once on mount



    return (
        <section className="incomes-section">
            <h2 className="incomes-title">הכנסות חודשיות</h2>

            {incomes.length > 0 ? (
                <ul className="income-list">
                    {incomes.map((income, index) => (
                        <li key={index} className="income-item">
                            <span className="income-amount">{income.amount.toLocaleString()} ₪</span>
                            <span className="income-type">{income.type}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-income">No incomes found for this period.</p>
            )}
        </section>


    );
}

export default IncomesComponent;
