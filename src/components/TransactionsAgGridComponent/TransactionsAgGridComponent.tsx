import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    ColDef,
    ModuleRegistry, NumberFilterModule, PaginationModule,
    RowClassParams,
    RowStyle, RowStyleModule, TextFilterModule,
    ValidationModule,
} from 'ag-grid-community';
// import { SetFilterModule } from 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-theme-quartz.css'; // ✅ New theming API only
// ❌ Don't import ag-grid.css (legacy theme), it's no longer needed or allowed
import ITransaction from '@Interfaces/ITransaction';
import {TransactionType} from "../../common/enums/TransactionType";

// ✅ Register AG Grid modules once
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    RowStyleModule,
    PaginationModule,
    TextFilterModule,
    NumberFilterModule,
    // SetFilterModule
]);

interface Props {
    transactions: ITransaction[];
}

const TransactionsAgGridComponent: React.FC<Props> = ({ transactions }) => {
    const columnDefs: ColDef<ITransaction>[] = [
        { field: 'creditCard', headerName: 'Credit Card', sortable: true, filter: true },
        { field: 'transactionType', headerName: 'Constant / Changing', sortable: true, filter: 'agSetColumnFilter' },
        { field: 'date', headerName: 'Date', sortable: true, filter: true },
        { field: 'vendor', headerName: 'Vendor', sortable: true, filter: 'agSetColumnFilter' },
        { field: 'category', headerName: 'Category', sortable: true, filter: 'agSetColumnFilter' },
        { field: 'amount', headerName: 'Amount', sortable: true, filter: true },
        { field: 'type', headerName: 'Type', sortable: true, filter: 'agSetColumnFilter' },
        { field: 'details', headerName: 'Details', sortable: true, filter: true },
        { field: 'billedAmount', headerName: 'Billed Amount', sortable: true, filter: true },
    ];

    const getRowStyle = (params: RowClassParams<ITransaction, unknown>): RowStyle | undefined => {
        const data = params.data;
        if (!data) return undefined;

        if (data.transactionType === TransactionType.CONSTANT) {
            return { backgroundColor: '#e0ffe0' };
        } else if (data.transactionType === TransactionType.CHANGING) {
            return { backgroundColor: '#ffe0e0' };
        }

        return undefined;
    };

    return (
        <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
            <AgGridReact<ITransaction>
                rowData={transactions}
                columnDefs={columnDefs}
                getRowStyle={getRowStyle}
                animateRows={true}
                pagination={true}
                rowModelType="clientSide"
            />
        </div>
    );
};

export default TransactionsAgGridComponent;
