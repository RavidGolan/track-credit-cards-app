import ITransaction from "@Interfaces/ITransaction";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {parseExcelFile} from "../ExcelUtils";
import {TransactionType} from "../../common/enums/TransactionType";

export class MaxService implements ICreditCardIssuersService {

    transformRawData(rawRows: any[]): ITransaction[] {
        const dateKey = Object.keys(rawRows[0])[0];
        return rawRows
            .filter(row => row["__EMPTY_3"] && !isNaN(Number(row["__EMPTY_3"])))
            .map(row => {
                return {
                    transactionType: TransactionType.CHANGING,
                    date: row[dateKey] || "",
                    vendor: row["__EMPTY"] || "",
                    // category: row[""] || "",
                    amount: parseFloat(row["__EMPTY_5"]),
                    type: row["__EMPTY_2"] || "",
                    details: row["__EMPTY_8"] || "",
                    billedAmount: parseFloat(row["__EMPTY_3"]),
                };
            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }
}
