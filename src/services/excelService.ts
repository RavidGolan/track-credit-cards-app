import * as XLSX from 'xlsx';

export type Transaction = {
    date: string;
    vendor: string;
    amount: number;
    type: string;
    details?: string;
    billedAmount: number;
};

function transformRawData(rawRows: any[]): Transaction[] {
    return rawRows
        .filter(row => typeof row["בנק לאומי |"] === "string" && row["__EMPTY"]) // filter valid rows
        .map(row => ({
            date: row["בנק לאומי |"],
            vendor: row["__EMPTY"] || "",
            amount: parseFloat(row["__EMPTY_1"]) || 0,
            type: row["__EMPTY_2"] || "",
            details: row["__EMPTY_3"] || "",
            billedAmount: parseFloat(row["__EMPTY_4"]) || 0,
        }));
}

export async function parseExcelFile(file: File): Promise<Transaction[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    return transformRawData(rawData);
}
