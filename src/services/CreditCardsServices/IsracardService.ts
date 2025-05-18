import ITransaction from "@Interfaces/ITransaction";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {parseExcelFile} from "../ExcelUtils";
import {TransactionType} from "../../common/enums/TransactionType";

export class IsracardService implements ICreditCardIssuersService {
    transformRawData(rawRows: any[]): ITransaction[] {
        const dateKey = Object.keys(rawRows[1])[0];
        return rawRows
            .filter(row => row["__EMPTY_2"] && !isNaN(Number(row["__EMPTY_2"])))
            .map(row => {
                return {
                    transactionType: TransactionType.CHANGING,
                    date: row[dateKey] || "",
                    vendor: row["__EMPTY_1"] || "",
                    category: row[""] || "",
                    amount: parseFloat(row["__EMPTY_2"]),
                    billedAmount: parseFloat(row["__EMPTY_4"]),
                };
            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }

}
