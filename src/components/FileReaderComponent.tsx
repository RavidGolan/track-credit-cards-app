import React, { useState } from 'react';
import {parseExcelFile} from '../services/excelService';

interface ExcelRow {
    [key: string]: any;  // Adjust this to a more specific type based on your Excel data
}

const FileReaderComponent: React.FC = () => {
    const [excelData, setExcelData] = useState<ExcelRow[] | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const data = await parseExcelFile(file);
                setExcelData(data);
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            {excelData && <pre>{JSON.stringify(excelData, null, 2)}</pre>}
        </div>
    );
};

export default FileReaderComponent;
