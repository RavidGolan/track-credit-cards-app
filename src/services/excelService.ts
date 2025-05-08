import * as XLSX from 'xlsx';
import ITransaction from "@Interfaces/ITransaction";

function excelDateToISO(serial: number): string {
    const utc_days = Math.floor(serial - 25569); // Excel date to Unix date
    const utc_date = new Date(utc_days * 86400 * 1000);
    return utc_date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function formatDDMMYYToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    const fullYear = parseInt(year) < 50 ? '20' + year : '19' + year; // heuristic
    return `${fullYear}-${month}-${day}`;
}

function transformRawData(rawRows: any[]): ITransaction[] {
    return rawRows
        .filter(row => row["בנק לאומי |"] && row["__EMPTY"])
        .map(row => {
            const rawDate = row["בנק לאומי |"];
            let date: string;

            if (typeof rawDate === "number") {
                date = excelDateToISO(rawDate); // handle Excel serial numbers
            } else if (/^\d{2}\/\d{2}\/\d{2}$/.test(rawDate)) {
                date = formatDDMMYYToISO(rawDate); // handle "dd/mm/yy"
            } else {
                date = rawDate; // fallback for unexpected formats
            }

            return {
                date,
                vendor: row["__EMPTY"] || "",
                amount: parseFloat(row["__EMPTY_1"]) || 0,
                type: row["__EMPTY_2"] || "",
                details: row["__EMPTY_3"] || "",
                billedAmount: parseFloat(row["__EMPTY_4"]) || 0,
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
    const transformedData = transformRawData(rawData);
    console.log(transformedData);
    return transformedData;
}
