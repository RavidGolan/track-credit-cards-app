import ITransaction from "@Interfaces/ITransaction";
import IVendorService from "@Interfaces/IVendorService";
import {parseExcelFile} from "../ExcelUtils";

export class IsracardService implements IVendorService {
    transformRawData(rawRows: any[]): ITransaction[] {
        return rawRows
            .filter(row => row["__EMPTY"] && row["__EMPTY"] !== "תאריך רכישה" && row["__EMPTY_5"])
            .map(row => {
                return {
                    date: row["__EMPTY"] || "",
                    vendor: row["__EMPTY_2"] || "",
                    category: row[""] || "",
                    amount: row["__EMPTY_3"],
                    billedAmount: row["__EMPTY_5"],
                };
            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }

}
