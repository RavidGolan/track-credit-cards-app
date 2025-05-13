import ITransaction from "@Interfaces/ITransaction";
import {TransactionType} from "../common/enums/TransactionType";

export default class BankTransactionsService {
    static getTransactions(): ITransaction[] {
        const bankTransactions: ITransaction[] = [];

        const rent: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "יאיר כהן",
            amount: 9450,
            billedAmount: 9450
        }
        bankTransactions.push(rent);

        const buildingMaintenance: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "ועד בית חייקה",
            amount: 440,
            billedAmount: 440
        }
        bankTransactions.push(buildingMaintenance);

        const mortgage: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "לאומי למשכנת-י",
            amount: 12600,
            billedAmount: 12600
        }
        bankTransactions.push(mortgage);

        const michalKindergarten: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "גן רונית בע״מ",
            amount: 4200,
            billedAmount: 4200
        }
        bankTransactions.push(michalKindergarten);

        const itayKindergarten: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "שושנה",
            amount: 4200,
            billedAmount: 4200
        }
        bankTransactions.push(itayKindergarten);

        const investmentInLand: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "10",
            vendor: "קרקע ברעננה",
            amount: 6145,
            billedAmount: 6145
        }
        bankTransactions.push(investmentInLand);

        return bankTransactions;
    }
}
