import ITransaction from "@Interfaces/ITransaction";
import ICreditCardService from "@Interfaces/ICreditCardService";
import {parseExcelFile} from "../ExcelUtils";

export class MaxService implements ICreditCardService {

    transformRawData(rawRows: any[]): ITransaction[] {
        return rawRows
            .filter(row => row["__EMPTY"] && row["__EMPTY"] !== "תאריך עסקה" && row["__EMPTY_4"])
            .map(row => {
                return {
                    date: row["__EMPTY"] || "",
                    vendor: row["__EMPTY_1"] || "",
                    category: row[""] || "",
                    amount: row["__EMPTY_6"],
                    type: row["__EMPTY_3"] || "",
                    details: row["__EMPTY_9"] || "",
                    billedAmount: row["__EMPTY_4"],
                };
            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }
}
