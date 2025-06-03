import {IncomeType} from "../enums/IncomeType";

export default interface IIncome {
    year: number,
    month: number,
    type: IncomeType,
    amount: number
}
