import { supabase } from './supabaseClient';
import IIncome from "@Interfaces/IIncome";
import {IncomeType} from "../../common/enums/IncomeType";

export default class IncomesService {

    static async getIncomes(): Promise<IIncome[]> {
        const { data, error } = await supabase
            .from('incomes')
            .select('*')

        if (error) {
            return [];
        } else {
            return data.map(row => ({
                year: row.year,
                month: row.month,
                amount: row.amount,
                type: row.type as IncomeType
            }));
        }
    }
}
