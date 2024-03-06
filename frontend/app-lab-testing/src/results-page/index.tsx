import { RowNode } from '@ag-grid-community/all-modules';
import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { LinearProgress, makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { useLabTestTypes } from '../common/hooks/use-lab-test-types';

import { Header } from './components/header';
import { Table } from './components/table';
import { getColumnDefs } from './get-column-defs';
import { useLoadRowData } from './hooks/use-load-row-data';
import { useSetColumnsVisibility } from './hooks/use-set-column-visibility';
import { cols } from './table-cols';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  progress: {
    flex: '0 0 auto',
  },
  body: {
    flex: '1 1',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
  },
}));

export const ResultsPage: React.FC = React.memo(() => {
  const classes = useStyles({});
  const snackbarProps = useSnackbar();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedRows, selectRows] = React.useState<LT.SampleResult[]>([]);
  const [tableApi, setTableApi] = React.useState<LT.TableApi>();
  const state = useCoreStore()[0];

  const hasEditPermissions =
    state.currentUser?.hasPermission(Resources.HYP_LAB_TESTING, PermissionLevels.EDIT) || false;

  const { labTestTypes, labTestTypesLoadingError, isLoadingLabTestTypes } = useLabTestTypes(error => {
    const errorMsg = `Error lab test types: ${error.message}. Check network connection, try reloading else Contact FarmOS support`;
    snackbarProps.errorSnackbar && snackbarProps.errorSnackbar({ message: errorMsg });
  });

  const { isLoadingRowData, errorLoadingRowData } = useLoadRowData({
    labTestTypes,
    tableApi,
    containerRef,
    hasEditPermissions,
    username: state.currentUser.username,
    onError: error => {
      const errorMsg = `Error loading sample data: ${error}. Check network connection, try reloading else Contact FarmOS support`;
      snackbarProps.errorSnackbar && snackbarProps.errorSnackbar({ message: errorMsg });
    },
    onSuccess: samples => {
      if (samples.length === 0 && snackbarProps.errorSnackbar) {
        snackbarProps.errorSnackbar({ message: 'No Data loaded for current query.' });
      }
    },
  });

  const columnDefs = React.useMemo(
    () => labTestTypes && getColumnDefs(labTestTypes, hasEditPermissions),
    [labTestTypes, hasEditPermissions]
  );

  useSetColumnsVisibility(tableApi, labTestTypes);

  const loadingError = labTestTypesLoadingError || errorLoadingRowData;
  const isLoading = !loadingError && (isLoadingLabTestTypes || isLoadingRowData);

  const onTableReady = React.useCallback((tableApi: LT.TableApi) => {
    setTableApi(tableApi);
  }, []);

  const onRowsSelected = React.useCallback((selectedRowNodes: RowNode[]): void => {
    const _selectedRows: LT.SampleResult[] = [];
    selectedRowNodes.forEach(rowNode => {
      const data = rowNode.data[cols.ORIG_DATA];
      if (data) {
        _selectedRows.push(data);
      }
    });
    selectRows(_selectedRows);
  }, []);

  return (
    <div className={classes.root}>
      {/* ref used by custom ag-grid renderers to display modals/snackbars */}
      <div ref={containerRef}></div>
      <LinearProgress className={classes.progress} style={{ visibility: isLoading ? 'visible' : 'hidden' }} />
      <Snackbar {...snackbarProps} />
      <Header
        labTestTypes={labTestTypes}
        selectedRows={selectedRows}
        snackbarProps={snackbarProps}
        tableApi={tableApi}
        hasCrudPermissions={hasEditPermissions}
      />
      {columnDefs && columnDefs.length > 0 && (
        <div className={classes.body}>
          <Table
            columnDefs={columnDefs}
            onRowsSelected={onRowsSelected}
            onTableReady={onTableReady}
            uniqueFieldName={cols.LAB_TEST_SAMPLE_ID}
          />
        </div>
      )}
    </div>
  );
});
