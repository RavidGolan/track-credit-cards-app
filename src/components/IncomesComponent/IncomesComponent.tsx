import React, {useEffect} from "react";
import IncomesService from "../../services/supabase/IncomesService";
import IIncome from "@Interfaces/IIncome";

const IncomesComponent: React.FC = () => {
    useEffect(() => {
        const fetchIncomes = async () => {
            const incomes: IIncome[] = await IncomesService.getIncomes();
            console.log(incomes);
        }

        fetchIncomes()
    }, []) // ← empty array means run once on mount


    return (
        <div></div>
    )
}

export default IncomesComponent;
