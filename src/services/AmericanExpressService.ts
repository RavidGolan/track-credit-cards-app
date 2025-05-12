import ITransaction from "@Interfaces/ITransaction";
import {TransactionType} from "../common/enums/TransactionType";
import IVendorService from "@Interfaces/IVendorService";
import {parseExcelFile} from "./ExcelUtils";

export class AmericanExpressService implements IVendorService {

    transformRawData(rawRows: any[]): ITransaction[] {
        return rawRows
            .filter(row => row["__EMPTY"] && row["__EMPTY"] !== "תאריך רכישה" && row["__EMPTY_4"] && row["__EMPTY_1"] !== "סך חיוב בש\"ח:")
            .map(row => {
                if (typeof row["__EMPTY_2"] === "number") {
                    return {
                        transactionType: TransactionType.CONSTANT,
                        date: row["__EMPTY"] || "",
                        vendor: row["__EMPTY_1"] || "",
                        amount: row["__EMPTY_2"],
                        details: row["__EMPTY_7"] || "",
                        billedAmount: row["__EMPTY_4"],
                    };
                } else {
                    return {
                        transactionType: TransactionType.CONSTANT,
                        date: row["__EMPTY"] || "",
                        vendor: row["__EMPTY_2"] || "",
                        amount: row["__EMPTY_3"],
                        billedAmount: row["__EMPTY_5"],
                    };
                }

            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }

}
