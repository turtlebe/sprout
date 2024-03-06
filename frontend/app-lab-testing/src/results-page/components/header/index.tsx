import { Snackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { SavePrintDialog } from '../../../common/components/save-and-print';
import { print } from '../../../common/components/save-and-print/print';
import { allowDifferentSampleTypeCreation } from '../../../common/utils/allow-different-sample-type-creation';
import { convertStringToDate, convertTimeToDate } from '../../../common/utils/date-utils';
import { isFieldSameInAllItems } from '../../../common/utils/is-field-same-in-all-items';
import { useGetSampleIdQueryParameter } from '../../hooks/use-get-sample-id-query-parameter';
import { FilteredColumns } from '../filtered-columns';
import { ResetGridMenu } from '../reset-grid-menu';
import { RestoreSavedGridButton } from '../restore-saved-grid-button';

import { DeleteDialog } from './delete/delete-dialog';
import { deleteFlow } from './delete/delete-flow';
import { useStyles } from './styles';

export const headerTestIds = {
  delete: 'delete-button',
  create: 'create-button',
  print: 'print-button',
  edit: 'header-edit-button',
};

interface Header {
  labTestTypes?: LT.LabTestType[];
  selectedRows: LT.SampleResult[];
  snackbarProps: Snackbar;
  tableApi: LT.TableApi | undefined;
  hasCrudPermissions: boolean;
}

const MAX_ROWS = 24;
export const MAX_PRINT_ROWS = 72;

export const Header: React.FC<Header> = ({
  labTestTypes,
  selectedRows,
  snackbarProps,
  tableApi,
  hasCrudPermissions,
}) => {
  const classes = useStyles({});
  const history = useHistory();

  const sampleIdQueryParameter = useGetSampleIdQueryParameter();

  const [savePrintStatus, setSavePrintStatus] = React.useState<SavePrintDialog>({
    open: false,
    enableClose: false,
    enablePrint: false,
  });

  const [deleteStatus, setDeleteStatus] = React.useState<DeleteDialog>({ open: false });

  function checkMax(maxAllowed: number): boolean {
    if (selectedRows && selectedRows.length > maxAllowed) {
      snackbarProps.errorSnackbar &&
        snackbarProps.errorSnackbar({ message: `The number of selected rows may not exceed ${maxAllowed}.` });
      return true;
    }
    return false;
  }

  function checkTestTypes() {
    if (selectedRows.length < 2) {
      return false;
    }
    const hasSameProvider = isFieldSameInAllItems<LT.SampleResult>(field => field.labTestProvider, selectedRows);

    if (!hasSameProvider) {
      snackbarProps.errorSnackbar && snackbarProps.errorSnackbar({ message: 'All Lab names must be the same.' });
      return true;
    }

    const labTestProvider = selectedRows[0].labTestProvider;
    if (
      !allowDifferentSampleTypeCreation(labTestProvider, labTestTypes) &&
      !isFieldSameInAllItems<LT.SampleResult>(field => field.info.sampleType, selectedRows)
    ) {
      snackbarProps.errorSnackbar &&
        snackbarProps.errorSnackbar({ message: 'All Lab names and Sample Types must be the same.' });
      return true;
    }
    return false;
  }

  function handlePrint() {
    if (checkMax(MAX_PRINT_ROWS)) {
      return;
    }

    const resultsToPrint: LT.PrintData[] = selectedRows.map<LT.PrintData>(item => {
      return {
        sampleId: item.labTestSampleId,
        sampleDate: convertStringToDate(item.info.sampleDate),
        sampleTime: convertTimeToDate(item.info.sampleTime),
        sampleType: item.info.sampleType,
        labelDetails: item.info.labelDetails,
        location: {
          path: item.info.farmDefPath,
          id: item.info.farmDefId,
        },
        lotCodes: item.info.lotCodes,
        trialIds: item.info.trialIds.join(','),
        treatmentIds: item.info.treatmentIds.join(','),
      };
    });
    print({
      data: resultsToPrint,
      setModalStatus: setSavePrintStatus,
      done: () => {
        setSavePrintStatus({ open: false });
      },
    });
  }

  function handleDelete() {
    deleteFlow(selectedRows, setDeleteStatus, () => {
      tableApi?.refreshCache();
      setDeleteStatus({ open: false });
      tableApi?.clearSelection();
    });
  }

  function handleEditOrCreate(isEdit: boolean) {
    if (checkMax(MAX_ROWS) || checkTestTypes()) {
      return;
    }

    history.push({
      pathname: '/lab-testing/create',
      state: {
        selectedRows,
        isEdit,
      },
    });
  }

  const numTests = selectedRows.length > 0 ? ` (${selectedRows.length})` : '';

  return (
    <Box display="flex" flex="0 0 auto" m={1}>
      <Typography variant="h5" className={classes.title}>
        Lab Test Results
      </Typography>
      <Box m={1} />
      <Box display="flex" alignItems="center">
        {sampleIdQueryParameter ? (
          <RestoreSavedGridButton />
        ) : (
          <>
            <ResetGridMenu tableApi={tableApi} />
            <Box mx={1}>
              <FilteredColumns tableApi={tableApi} />
            </Box>
          </>
        )}
      </Box>
      <Box flex="1 1" display="flex" justifyContent="flex-end">
        <Button
          data-testid={headerTestIds.print}
          disabled={selectedRows.length === 0}
          onClick={handlePrint}
          variant={'contained'}
        >
          {'print' + numTests}
        </Button>
        <Box m={0.5} />
        <Button
          data-testid={headerTestIds.delete}
          disabled={!hasCrudPermissions || selectedRows.length === 0}
          onClick={handleDelete}
          variant={'contained'}
        >
          {'Delete' + numTests}
        </Button>
        <Box m={0.5} />
        <Button
          data-testid={headerTestIds.edit}
          disabled={!hasCrudPermissions || selectedRows.length === 0}
          variant={'contained'}
          onClick={() => handleEditOrCreate(true)}
        >
          {'Edit' + numTests}
        </Button>
        <Box m={0.5} />
        <Button
          data-testid={headerTestIds.create}
          disabled={!hasCrudPermissions}
          variant={'contained'}
          onClick={() => handleEditOrCreate(false)}
        >
          {'Create' + numTests}
        </Button>
      </Box>
      <SavePrintDialog {...savePrintStatus} />
      <DeleteDialog {...deleteStatus} />
    </Box>
  );
};
