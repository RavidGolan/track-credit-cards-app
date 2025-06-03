import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

// AG Grid Community
import {
  CellStyleModule,
  ClientSideRowModelModule,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowApiModule,
  RowAutoHeightModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  SelectEditorModule,
  TextFilterModule,
  ValidationModule,
} from 'ag-grid-community';

// AG Grid Enterprise
import {
  PivotModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  TreeDataModule,
    // SetFilterModule
} from 'ag-grid-enterprise';

// AG Grid styles
import 'ag-grid-community/styles/ag-theme-quartz.css';

// App-specific
import ITransaction from '@Interfaces/ITransaction';
import { Category } from '../../common/enums/Category';
import { TransactionType } from '../../common/enums/TransactionType';
import { getVendorCategory, setVendorCategory } from '../../services/supabase/vendorCategoryService';
import {defaultTransactionsColumnDefs, transactionsColumnDefs} from "./TransactionsColumnDefs";

// Register required AG Grid modules (both Community and Enterprise)
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowApiModule,
  RowAutoHeightModule,
  PaginationModule,
  NumberFilterModule,
  TextFilterModule,
  SelectEditorModule,
  // SetFilterModule,
  ValidationModule,
  RowStyleModule,
  CellStyleModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  RowGroupingPanelModule,
]);

interface TransactionsAgGridComponentProps {
  transactions: ITransaction[];
  filteredCategory?: Category | 'ללא קטגוריה';
}

const TransactionsAgGridComponent: React.FC<
  TransactionsAgGridComponentProps
> = ({ transactions, filteredCategory }) => {
  const [rowData, setRowData] = useState<ITransaction[]>([]);
  const [gridApi, setGridApi] = useState<GridApi<ITransaction>>();

  // 1. Load vendor-category mapping and patch transactions
  useEffect(() => {
    const enrich = async () => {
      const enriched = await Promise.all(
          transactions.map(async (tx) => ({
            ...tx,
            category: String(
                tx.category || (await getVendorCategory(tx.vendor)) || '',
            ),
          })),
      );
      setRowData(enriched);
      console.log('enriched');
      console.log(enriched);
    };

    enrich();
  }, [transactions]);

  // 4. Optional row coloring
  const getRowStyle = (
      params: RowClassParams<ITransaction, unknown>,
  ): RowStyle | undefined => {
    const data = params.data;
    if (!data) return undefined;

    if (data.transactionType === TransactionType.CONSTANT) {
      return {backgroundColor: '#e0ffe0'};
    } else if (data.transactionType === TransactionType.CHANGING) {
      return {backgroundColor: '#ffe0e0'};
    }

    return undefined;
  };

  // 5. Save new category mapping when user changes it
  const handleCellValueChanged = async (params: any) => {
    if (params.colDef.field === 'category') {
      const {vendor} = params.data;
      const category = params.newValue as Category;

      if (vendor && Object.values(Category).includes(category)) {
        await setVendorCategory(vendor, category);
      }
    }
  };

  const onGridReady = (event: GridReadyEvent<ITransaction>) => {
    setGridApi(event.api);
  };

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
  }, [filteredCategory, gridApi]);

  return (
      <div className="ag-theme-quartz">
        <AgGridReact<ITransaction>
            rowData={rowData}
            columnDefs={transactionsColumnDefs}
            getRowStyle={getRowStyle}
            animateRows={true}
            pagination={true}
            rowModelType="clientSide"
            onCellValueChanged={handleCellValueChanged}
            onGridReady={onGridReady}
            rowGroupPanelShow="always"
            groupDisplayType="singleColumn"
            groupDefaultExpanded={0} // All groups collapsed initially
            domLayout="autoHeight"
            suppressHorizontalScroll={false}
            defaultColDef={defaultTransactionsColumnDefs}
        />
    </div>
  );
};

export default TransactionsAgGridComponent;
