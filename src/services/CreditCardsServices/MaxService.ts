import ITransaction from "@Interfaces/ITransaction";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {parseExcelFile} from "../ExcelUtils";
import {TransactionType} from "../../common/enums/TransactionType";

export class MaxService implements ICreditCardIssuersService {

    transformRawData(rawRows: any[]): ITransaction[] {
        return rawRows
            .filter(row => row["__EMPTY"] && row["__EMPTY"] !== "תאריך עסקה" && row["__EMPTY_4"])
            .map(row => {
                return {
                    transactionType: TransactionType.CHANGING,
                    date: row["__EMPTY"] || "",
                    vendor: row["__EMPTY_1"] || "",
                    // category: row[""] || "",
                    amount: parseFloat(row["__EMPTY_6"]),
                    type: row["__EMPTY_3"] || "",
                    details: row["__EMPTY_9"] || "",
                    billedAmount: parseFloat(row["__EMPTY_4"]),
                };
            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }
}
