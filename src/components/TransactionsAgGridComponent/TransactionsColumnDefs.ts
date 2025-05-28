import {ColDef} from "ag-grid-community";
import ITransaction from "@Interfaces/ITransaction";
import {Category} from "../../common/enums/Category";

export const defaultTransactionsColumnDefs: ColDef<ITransaction> =
    {
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        enableRowGroup: true,
    }

const customTextAgg = (params: any) => {
    const unique = new Set(params.values.filter(Boolean));
    return Array.from(unique).join(', ');
};

// Category enum options
const CATEGORY_OPTIONS = Object.values(Category);

// Column definitions
export const transactionsColumnDefs: ColDef<ITransaction>[] = [
    {
        field: 'date',
        headerName: 'Date',
    },
    {
        field: 'transactionType',
        headerName: 'Constant / Changing',
        aggFunc: customTextAgg,
    },
    {
        field: 'category',
        headerName: 'Category',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: CATEGORY_OPTIONS,
        },
        aggFunc: customTextAgg,

    },
    {
        field: 'vendor',
        headerName: 'Vendor',
    },
    {
        field: 'billedAmount',
        headerName: 'Billed Amount',
        valueFormatter: ({value}) =>
            typeof value === 'number' ? value.toLocaleString('en-US') : value,
        aggFunc: 'sum',
    },
    {
        field: 'source',
        headerName: 'Credit Card',
        aggFunc: customTextAgg,
    },
    {
        field: 'amount',
        headerName: 'Amount',
        valueFormatter: ({value}) =>
            typeof value === 'number'
                ? value.toLocaleString('en-US') // ✅ comma format
                : value,
        aggFunc: 'sum',
    },
    {
        field: 'type',
        headerName: 'Type',
    },
    {
        field: 'details',
        headerName: 'Details',
        aggFunc: customTextAgg,
    },
];
