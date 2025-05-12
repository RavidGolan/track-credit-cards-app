import React, {useState} from 'react';
import ITransaction from "@Interfaces/ITransaction";
import {Vendors} from "common/enums/Vendors";
import Select from 'react-select';
import IVendorService from "@Services/interfaces/IVendorService";
import {VendorServices} from "services/VendorServices";

interface FileReaderComponentProps {
    onData: (data: ITransaction[]) => void;
}

const FileReaderComponent: React.FC<FileReaderComponentProps> = ({ onData }) => {
    const [selectedVendor, setSelectedVendor] = useState<Vendors | null>(null);
    const vendorOptions = Object.entries(Vendors).map(([key, value]) => ({
        label: value,
        value: Vendors[key as keyof typeof Vendors],  // Ensure value is of type Vendors
    }));


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedVendor) return;

        const service: IVendorService | undefined = VendorServices[selectedVendor];
        if (!service) {
            console.warn(`No service found for vendor: ${selectedVendor}`);
            return;
        }

        try {
            const data = await service.parseExcelFile(file);
            onData(data); // pass parsed data upward
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <Select
                options={vendorOptions}
                isClearable
                placeholder="בחר ספק"
                onChange={(option) => setSelectedVendor(option?.value as Vendors || null)}
            />
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange}/>
        </div>
    );
};

export default FileReaderComponent;
