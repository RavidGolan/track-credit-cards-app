import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';

const BUCKET_NAME = 'excel-files';

export const StorageService = {
    async uploadExcelFile(file: File, folder: string): Promise<string> {
        const path = `${folder}/${file.name}`;

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                upsert: true,
                contentType: file.type,
            });

        if (error) {
            console.error('Upload failed:', error.message);
            throw error;
        }

        return path;
    },

    async parseExcelFileFromStorage(path: string): Promise<any[]> {
/*        const { data, error } = await supabase.storage
            .from('excel-files')
            .list('2025/04');

        console.log(data); // will show all files in that folder
        console.log(error);

        return [];*/

        const { data: blob, error } = await supabase.storage
            .from(BUCKET_NAME)
            .download(path);

        if (error || !blob) {
            console.error('Failed to download file for parsing:', error?.message);
            throw error;
        }

        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData);
        return jsonData; // ✅ this is your AG Grid rowData
    },
};
