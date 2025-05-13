import ITransaction from "@Interfaces/ITransaction";
import {TransactionType} from "../common/enums/TransactionType";
import {Category} from "../common/enums/Category";

export default class BankTransactionsService {
    static getTransactions(): ITransaction[] {
        const bankTransactions: ITransaction[] = [];

        /*export default interface ITransaction {
            creditCard?: string;
            transactionType?: TransactionType;
            date: string;         // ISO date string like "2025-08-04"
            vendor: string;       // Merchant or business name
            amount: number;       // Original transaction amount
            type?: string;         // Transaction type, e.g., "עסקה רגילה"
            details?: string;     // Optional details or description
            billedAmount: number; // Final charged amount
            category?: string;
        }*/

        const rent: ITransaction = {
            creditCard: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "Yair",
            amount: 9450,
            billedAmount: 9450,
            category: Category.RENT
        }
        bankTransactions.push(rent);
        return bankTransactions;
    }
}
