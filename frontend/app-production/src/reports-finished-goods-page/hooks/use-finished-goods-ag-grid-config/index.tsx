import CommentIcon from '@material-ui/icons/Comment';
import { StatusLabel } from '@plentyag/brand-ui/src/components';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { Box, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { PackagingLotTestStatus } from '@plentyag/core/src/types';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { useMemo } from 'react';

import { ButtonEditTestStatus } from '../../components/button-edit-test-status';
import { TestStatus } from '../../components/test-status';
import { TestStatusField } from '../../types';
import { getLevelFromFinishedGoodsStatus } from '../../utils/get-level-from-finished-goods-status';
import { getTestStatusNotes } from '../../utils/get-test-status-notes';
import { FinishedGoodsObj } from '../use-process-finished-goods-data';

import { useStyles } from './styles';

enum Fields {
  STATUS = 'status',
  PACK_DATE = 'packDate',
  LOT_NAME = 'lotName',
  EXP_DATE = 'expDate',
  PRODUCT = 'product',
  PRODUCT_DISPLAY_NAME = 'productDisplayName',
  QA_STATUS = 'qaStatus',
  LT_STATUS = 'ltStatus',
  NOTES = 'notes',
}

interface UseFinishedGoodsAgGridConfig {
  finishedGoodsData: FinishedGoodsObj[];
  onUpdateStatusSuccess: (lot: any) => void;
  onUpdateStatusError: (err: any) => void;
}

const dataTestIds = {
  status: 'finished-goods-ag-grid-status',
  editQAStatus: 'finished-goods-ag-grid-edit-qa-status',
  editLTStatus: 'finished-goods-ag-grid-edit-lt-status',
};

export { dataTestIds as dataTestIdsFinishedGoodsAgGrid };

export const useFinishedGoodsAgGridConfig = ({
  finishedGoodsData,
  onUpdateStatusSuccess = () => {},
  onUpdateStatusError = () => {},
}: UseFinishedGoodsAgGridConfig): BaseAgGridClientSideTable['agGridConfig'] => {
  const classes = useStyles({});

  const handleTestStatusSuccess = response => {
    onUpdateStatusSuccess(response);
  };

  const handleTestStatusError = err => {
    onUpdateStatusError(err);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Status',
        field: Fields.STATUS,
        colId: Fields.STATUS,
        minWidth: 150,
        valueGetter: row => row.data.status,
        cellRendererFramework: row => {
          const statusLevel = getLevelFromFinishedGoodsStatus(row.data.status);
          return (
            <Box display="flex" alignItems="center" data-testid={dataTestIds.status}>
              <StatusLabel level={statusLevel} text={row.data.status} />
            </Box>
          );
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Harvested',
        field: Fields.PACK_DATE,
        colId: Fields.PACK_DATE,
        valueGetter: row => getLuxonDateTime(row.data.lot.properties.packDate).toFormat(DateTimeFormat.US_DATE_ONLY),
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Packaging Lot',
        field: Fields.LOT_NAME,
        colId: Fields.LOT_NAME,
        valueGetter: row => row.data.lot.lotName,
        ...defaultAgTextContainsColumnFilter,
      },

      {
        headerName: 'Exp Date',
        field: Fields.EXP_DATE,
        colId: Fields.EXP_DATE,
        maxWidth: 150,
        valueGetter: row => {
          const expDateLuxon = getLuxonDateTime(row.data.expDate);
          return expDateLuxon.isValid ? expDateLuxon.toFormat(DateTimeFormat.US_DATE_ONLY) : '-';
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Crop',
        field: Fields.PRODUCT,
        colId: Fields.PRODUCT,
        maxWidth: 100,
        valueGetter: row => row.data.lot.product,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Full Name',
        field: Fields.PRODUCT_DISPLAY_NAME,
        colId: Fields.PRODUCT_DISPLAY_NAME,
        valueGetter: row => row.data.crop?.displayName ?? '',
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'QA Status',
        field: Fields.QA_STATUS,
        colId: Fields.QA_STATUS,
        minWidth: 168,
        valueGetter: row => {
          return row.data.lot.properties.overriddenQaStatus !== PackagingLotTestStatus.NONE
            ? row.data.lot.properties.overriddenQaStatus
            : row.data.lot.properties.passedQaStatus;
        },
        cellRendererFramework: row => (
          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <TestStatus
              status={row.data.lot.properties.passedQaStatus}
              overriddenStatus={row.data.lot.properties.overriddenQaStatus}
            />
            <ButtonEditTestStatus
              data-testid={dataTestIds.editQAStatus}
              lot={row.data.lot}
              status={row.data.status}
              field={TestStatusField.QA}
              onSuccess={handleTestStatusSuccess}
              onError={handleTestStatusError}
            />
          </Box>
        ),
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Lab Testing',
        field: Fields.LT_STATUS,
        colId: Fields.LT_STATUS,
        minWidth: 168,
        valueGetter: row => {
          return row.data.lot.properties.overriddenLtStatus !== PackagingLotTestStatus.NONE
            ? row.data.lot.properties.overriddenLtStatus
            : row.data.lot.properties.passedLtStatus;
        },
        cellRendererFramework: row => (
          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <TestStatus
              status={row.data.lot.properties.passedLtStatus}
              overriddenStatus={row.data.lot.properties.overriddenLtStatus}
            />
            <ButtonEditTestStatus
              data-testid={dataTestIds.editLTStatus}
              lot={row.data.lot}
              status={row.data.status}
              field={TestStatusField.LAB_TESTING}
              onSuccess={handleTestStatusSuccess}
              onError={handleTestStatusError}
            />
          </Box>
        ),
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Notes',
        field: Fields.NOTES,
        colId: Fields.NOTES,
        valueGetter: row => getTestStatusNotes(row.data.lot),
        cellRendererFramework: row => {
          const notes = getTestStatusNotes(row.data.lot);

          if (notes.length < 1) {
            return <></>;
          }

          return (
            <Box display="flex" alignItems="center">
              <Tooltip title={notes}>
                <CommentIcon className={classes.comment} />
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    []
  );

  const agGridConfig = {
    ...defaultConfig,
    components: {},
    columnDefs,
    rowData: finishedGoodsData,
    getRowNodeId: rowData => rowData?.nodeId, // unique id for each row.
    immutableData: true,
  };

  return agGridConfig;
};
