import React, {useState} from 'react';
import {parseExcelFile} from '../services/americanExpressExcelService';
import ITransaction from "@Interfaces/ITransaction";
import {Vendors} from "../common/Enums/Vendors";
import Select from 'react-select';

interface FileReaderComponentProps {
    onData: (data: ITransaction[]) => void;
}

const FileReaderComponent: React.FC<FileReaderComponentProps> = ({ onData }) => {
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const vendorOptions = Object.entries(Vendors).map(([key, value]) => ({
        label: value,
        value: key,
    }));

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
            <Select
                options={vendorOptions}
                isClearable
                placeholder="בחר ספק"
                onChange={(option) => setSelectedVendor(option?.value || null)}
            />
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange}/>
        </div>
    );
};

export default FileReaderComponent;
