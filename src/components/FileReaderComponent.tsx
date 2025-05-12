import React from 'react';
import {parseExcelFile} from '../services/americanExpressExcelService';
import ITransaction from "@Interfaces/ITransaction";

interface FileReaderComponentProps {
    onData: (data: ITransaction[]) => void;
}

const FileReaderComponent: React.FC<FileReaderComponentProps> = ({ onData }) => {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const data = await parseExcelFile(file);
                onData(data); // pass parsed data upward
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        </div>
    );
};

export default FileReaderComponent;
