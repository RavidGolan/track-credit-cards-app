import {ColDef} from "ag-grid-community";
import ITransaction from "@Interfaces/ITransaction";
import {Category} from "../../common/enums/Category";

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
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
    },
    {
        field: 'transactionType',
        headerName: 'Constant / Changing',
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
    },
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
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        aggFunc: customTextAgg,
    },
    {
        field: 'vendor',
        headerName: 'Vendor',
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
    },
    {
        field: 'billedAmount',
        headerName: 'Billed Amount',
        sortable: true,
        filter: true,
        valueFormatter: ({value}) =>
            typeof value === 'number' ? value.toLocaleString('en-US') : value,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        aggFunc: 'sum',
    },
    {
        field: 'source',
        headerName: 'Credit Card',
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        aggFunc: customTextAgg,
    },
    {
        field: 'amount',
        headerName: 'Amount',
        sortable: true,
        filter: true,
        valueFormatter: ({value}) =>
            typeof value === 'number'
                ? value.toLocaleString('en-US') // ✅ comma format
                : value,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        aggFunc: 'sum',
    },
    {
        field: 'type',
        headerName: 'Type',
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        aggFunc: customTextAgg,
    },
    {
        field: 'details',
        headerName: 'Details',
        sortable: true,
        filter: true,
        cellStyle: {whiteSpace: 'pre-wrap'},
        autoHeight: true,
        aggFunc: customTextAgg,
    },
];
