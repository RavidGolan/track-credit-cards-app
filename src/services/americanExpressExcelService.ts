import ITransaction from "@Interfaces/ITransaction";
import * as XLSX from "xlsx";
import {TransactionType} from "../common/Enums/transactionType";

function transformRawData(rawRows: any[]): ITransaction[] {
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

export async function parseExcelFile(file: File): Promise<ITransaction[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    console.log(rawData);
    const transformedData =  transformRawData(rawData);
    console.log(transformedData);
    return transformedData;
}
