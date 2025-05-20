import React, {useEffect, useState} from 'react';
import {AgGridReact,} from 'ag-grid-react';
import {GridApi, GridReadyEvent, RowApiModule} from 'ag-grid-community';

import {
    ClientSideRowModelModule,
    ColDef,
    ModuleRegistry,
    NumberFilterModule,
    PaginationModule,
    RowClassParams,
    RowStyle,
    RowStyleModule, SelectEditorModule,
    TextFilterModule,
    ValidationModule,
} from 'ag-grid-community';

// import {SetFilterModule} from 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-theme-quartz.css';

import ITransaction from '@Interfaces/ITransaction';
import {
    getVendorCategory,
    setVendorCategory,
} from '../../services/supabase/vendorCategoryService';
import {TransactionType} from "../../common/enums/TransactionType";
import {Category} from "../../common/enums/Category";
// import {SetFilterModule} from "ag-grid-enterprise";

// Register AG Grid modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    RowStyleModule,
    PaginationModule,
    TextFilterModule,
    NumberFilterModule,
    // SetFilterModule,
    SelectEditorModule,
    RowApiModule
]);

interface TransactionsAgGridComponentProps {
    transactions: ITransaction[];
    filteredCategory?: Category | 'ללא קטגוריה';
}

const TransactionsAgGridComponent: React.FC<TransactionsAgGridComponentProps> = ({ transactions, filteredCategory }) => {
    const [rowData, setRowData] = useState<ITransaction[]>([]);
    const [gridApi, setGridApi] = useState<GridApi<ITransaction>>();

    // 1. Load vendor-category mapping and patch transactions
    useEffect(() => {
        const enrich = async () => {
            const enriched = await Promise.all(
                transactions.map(async (tx) => ({
                    ...tx,
                    category: String(tx.category || (await getVendorCategory(tx.vendor)) || ''),
                }))
            );
            setRowData(enriched);
            console.log("enriched");
            console.log(enriched);
        };

        enrich();
    }, [transactions]);

    // 2. Category enum options
    const CATEGORY_OPTIONS = Object.values(Category);

    // 3. Column definitions
    const columnDefs: ColDef<ITransaction>[] = [
        { field: 'source', headerName: 'Credit Card', sortable: true, filter: true },
        { field: 'transactionType', headerName: 'Constant / Changing', sortable: true, filter: true },
        { field: 'date', headerName: 'Date', sortable: true, filter: true },
        { field: 'vendor', headerName: 'Vendor', sortable: true, filter: true },
        {
            field: 'category',
            headerName: 'Category',
            editable: true,
            sortable: true,
            filter: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: CATEGORY_OPTIONS,
            },
        },
        {
            field: 'billedAmount',
            headerName: 'Billed Amount',
            sortable: true,
            filter: true,
            valueFormatter: ({ value }) =>
                typeof value === 'number'
                    ? value.toLocaleString('en-US')
                    : value,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            sortable: true,
            filter: true,
            valueFormatter: ({ value }) =>
                typeof value === 'number'
                    ? value.toLocaleString('en-US') // ✅ comma format
                    : value,
        },
        { field: 'type', headerName: 'Type', sortable: true, filter: true },
        { field: 'details', headerName: 'Details', sortable: true, filter: true }
    ];

    // 4. Optional row coloring
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

    // 5. Save new category mapping when user changes it
    const handleCellValueChanged = async (params: any) => {
        if (params.colDef.field === 'category') {
            const { vendor } = params.data;
            const category = params.newValue as Category;

            if (vendor && Object.values(Category).includes(category)) {
                await setVendorCategory(vendor, category);
            }
        }
    };

    const onGridReady = (event: GridReadyEvent<ITransaction>) => {
        setGridApi(event.api);
    }

    useEffect(() => {
        if (!gridApi) return;

        gridApi.getColumnFilterInstance('category')?.then((filterInstance) => {
            if (filterInstance) {
                if (filteredCategory) {
                    if (filteredCategory === 'ללא קטגוריה') {
                        filterInstance.setModel({
                            type: 'blank',
                        });
                    } else {
                        filterInstance.setModel({
                            type: 'equals',
                            filter: filteredCategory,
                        });
                    }
                } else {
                    filterInstance.setModel(null); // clear the filter
                }
                gridApi.onFilterChanged();
            }
        });
        // @ts-ignore
        console.log(gridApi.getDisplayedRowAtIndex(0)?.data.category);
    }, [filteredCategory, gridApi]);


    return (
        <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
            <AgGridReact<ITransaction>
                rowData={rowData}
                columnDefs={columnDefs}
                getRowStyle={getRowStyle}
                animateRows={true}
                pagination={true}
                rowModelType="clientSide"
                onCellValueChanged={handleCellValueChanged}
                onGridReady={onGridReady}
            />
        </div>
    );
};

export default TransactionsAgGridComponent;
