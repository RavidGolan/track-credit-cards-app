import ITransaction from "@Interfaces/ITransaction";
import * as XLSX from "xlsx";

function transformRawData(rawRows: any[]): ITransaction[] {
    return rawRows
        .filter(row => row["__EMPTY"] && row["__EMPTY"] !== "תאריך עסקה" && row["__EMPTY_1"])
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
