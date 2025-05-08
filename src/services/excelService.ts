import * as XLSX from 'xlsx';

/**
 * Reads an Excel file and returns its contents as JSON.
 * @param file - The Excel File object (from <input type="file" />)
 * @returns A promise that resolves with an array of JSON rows.
 */
export const parseExcelFile = (
    file: File
): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsArrayBuffer(file);
    });
};
