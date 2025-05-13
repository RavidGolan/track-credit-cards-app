import React from 'react';
import ITransaction from "@Interfaces/ITransaction";
import {CreditCardIssuers} from "../common/enums/CreditCardIssuers";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {CreditCardsServices} from "../services/CreditCardsServices";
import {CreditCards} from "../common/enums/CreditCards";

interface FileReaderComponentProps {
    creditCard: CreditCards,
    vendor: CreditCardIssuers,
    onData: (data: ITransaction[]) => void;
}

const FileReaderComponent: React.FC<FileReaderComponentProps> = ({ creditCard, vendor, onData }) => {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const service: ICreditCardIssuersService | undefined = CreditCardsServices[vendor];
        if (!service) {
            console.warn(`No service found for vendor: ${vendor}`);
            return;
        }

        try {
            let data = await service.parseExcelFile(file);
            data = data.map(transaction => ({
                ...transaction,
                source: creditCard,  // Add card to each transaction
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
