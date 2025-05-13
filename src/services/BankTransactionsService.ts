import ITransaction from "@Interfaces/ITransaction";
import {TransactionType} from "../common/enums/TransactionType";
import {Category} from "../common/enums/Category";

export default class BankTransactionsService {
    static getTransactions(): ITransaction[] {
        const bankTransactions: ITransaction[] = [];

        const rent: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "יאיר כהן",
            amount: 9450,
            billedAmount: 9450,
            category: Category.RENT
        }
        bankTransactions.push(rent);

        const buildingMaintenance: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "ועד בית חייקה",
            amount: 440,
            billedAmount: 440,
            category: Category.BUILDING_MAINTENANCE
        }
        bankTransactions.push(buildingMaintenance);

        const mortgage: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "לאומי למשכנת-י",
            amount: 12600,
            billedAmount: 12600,
            category: Category.MORTGAGE
        }
        bankTransactions.push(mortgage);

        const michalKindergarten: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "גן רונית בע״מ",
            amount: 4200,
            billedAmount: 4200,
            category: Category.KINDERGARTEN
        }
        bankTransactions.push(michalKindergarten);

        const itayKindergarten: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "1",
            vendor: "שושנה",
            amount: 4200,
            billedAmount: 4200,
            category: Category.KINDERGARTEN
        }
        bankTransactions.push(itayKindergarten);

        const investmentInLand: ITransaction = {
            source: "Bank Leumi",
            transactionType: TransactionType.CONSTANT,
            date: "10",
            vendor: "קרקע ברעננה",
            amount: 6145,
            billedAmount: 6145,
            category: Category.INVESTMENT
        }
        bankTransactions.push(investmentInLand);

        return bankTransactions;
    }
}
