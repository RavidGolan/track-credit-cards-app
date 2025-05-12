import ITransaction from "@Interfaces/ITransaction";
import * as XLSX from "xlsx";

export async function parseExcelFile(file: File, transformRawData: (rawRows: any[]) => ITransaction[]): Promise<ITransaction[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});

    console.log(rawData);
    const transformedData = transformRawData(rawData);
    console.log(transformedData);
    return transformedData;
}
