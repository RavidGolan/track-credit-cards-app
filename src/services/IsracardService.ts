import ITransaction from "@Interfaces/ITransaction";
import * as XLSX from "xlsx";
import IVendorService from "@Interfaces/IVendorService";

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
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, {type: 'buffer'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});

        console.log(rawData);
        const transformedData = this.transformRawData(rawData);
        console.log(transformedData);
        return transformedData;
    }

}
