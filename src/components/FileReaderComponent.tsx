import React, {useState} from 'react';
import ITransaction from "@Interfaces/ITransaction";
import {Vendors} from "common/enums/Vendors";
import Select from 'react-select';
import IVendorService from "@Interfaces/IVendorService";
import {VendorServices} from "services/VendorServices";
import {CreditCards} from "../common/enums/CreditCards";

interface FileReaderComponentProps {
    creditCard: CreditCards,
    vendor: Vendors,
    onData: (data: ITransaction[]) => void;
}

const FileReaderComponent: React.FC<FileReaderComponentProps> = ({ creditCard, vendor, onData }) => {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const service: IVendorService | undefined = VendorServices[vendor];
        if (!service) {
            console.warn(`No service found for vendor: ${vendor}`);
            return;
        }

        try {
            let data = await service.parseExcelFile(file);
            data = data.map(transaction => ({
                ...transaction,
                creditCard,  // Add card to each transaction
            }));
            onData(data); // pass parsed data upward
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    return (
        <div>
            <div>{creditCard}</div>
            <div>{vendor}</div>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange}/>
        </div>
    );
};

export default FileReaderComponent;
