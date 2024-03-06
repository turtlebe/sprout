import { StatusLabel } from '@plentyag/brand-ui/src/components';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { useExtendedAgGridWithExpandableRows } from '@plentyag/core/src/hooks';
import { PackagingLotTestStatus } from '@plentyag/core/src/types';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { useMemo } from 'react';

import { ButtonEditTestStatus } from '../../components/button-edit-test-status';
import { SkusExpandedRow } from '../../components/skus-expanded-row';
import { TestStatus } from '../../components/test-status';
import { TestStatusField } from '../../types';
import { getLevelFromFinishedGoodsStatus } from '../../utils/get-level-from-finished-goods-status';
import { SkuObj } from '../use-process-skus-data';

enum Fields {
  STATUS = 'status',
  PACK_DATE = 'packDate',
  LOT_NAME = 'lotName',
  SKU = 'sku',
  COUNT = 'count',
  EXP_DATE = 'expDate',
  PRODUCT = 'product',
  PRODUCT_DISPLAY_NAME = 'productDisplayName',
  QA_STATUS = 'qaStatus',
  LT_STATUS = 'ltStatus',
  NOTES = 'notes',
}

interface UseFinishedGoodsAgGridConfig {
  finishedGoodsSkus: SkuObj[];
  onUpdateStatusSuccess?: (lot: any) => void;
  onUpdateStatusError?: (err: any) => void;
}

const dataTestIds = {
  status: 'finished-goods-ag-grid-status',
  editQAStatus: 'finished-goods-ag-grid-edit-qa-status',
  editLTStatus: 'finished-goods-ag-grid-edit-lt-status',
};

export { dataTestIds as dataTestIdsSkusAgGrid };

export const useSkusAgGridConfig = ({
  finishedGoodsSkus,
  onUpdateStatusSuccess = () => {},
  onUpdateStatusError = () => {},
}: UseFinishedGoodsAgGridConfig): BaseAgGridClientSideTable['agGridConfig'] => {
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
            <Box display="flex" alignItems="center">
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
        headerName: 'SKU',
        field: Fields.SKU,
        colId: Fields.SKU,
        valueGetter: row => row.data.sku.displayName,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Count',
        field: Fields.COUNT,
        colId: Fields.COUNT,
        valueGetter: row => row.data.count,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Exp Date',
        field: Fields.EXP_DATE,
        colId: Fields.EXP_DATE,
        valueGetter: row => {
          const expDateLuxon = getLuxonDateTime(row.data.expDate);
          return expDateLuxon.isValid ? expDateLuxon.toFormat(DateTimeFormat.US_DATE_ONLY) : '-';
        },
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
          return row.data.releaseDetails.overriddenQaStatus !== PackagingLotTestStatus.NONE
            ? row.data.releaseDetails.overriddenQaStatus
            : row.data.releaseDetails.passedQaStatus;
        },
        cellRendererFramework: row => (
          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <TestStatus
              status={row.data.releaseDetails.passedQaStatus}
              overriddenStatus={row.data.releaseDetails.overriddenQaStatus}
            />
            <ButtonEditTestStatus
              data-testid={dataTestIds.editQAStatus}
              lot={row.data.lot}
              sku={row.data.sku}
              status={row.data.status}
              field={TestStatusField.QA}
              onSuccess={onUpdateStatusSuccess}
              onError={onUpdateStatusError}
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
          return row.data.releaseDetails.overriddenLtStatus !== PackagingLotTestStatus.NONE
            ? row.data.releaseDetails.overriddenLtStatus
            : row.data.releaseDetails.passedLtStatus;
        },
        cellRendererFramework: row => (
          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <TestStatus
              status={row.data.releaseDetails.passedLtStatus}
              overriddenStatus={row.data.releaseDetails.overriddenLtStatus}
            />
            <ButtonEditTestStatus
              data-testid={dataTestIds.editLTStatus}
              lot={row.data.lot}
              sku={row.data.sku}
              status={row.data.status}
              field={TestStatusField.LAB_TESTING}
              onSuccess={onUpdateStatusSuccess}
              onError={onUpdateStatusError}
            />
          </Box>
        ),
        ...defaultAgTextContainsColumnFilter,
      },
    ],
    []
  );

  const agGridConfig = {
    ...defaultConfig,
    components: {},
    columnDefs,
    rowData: finishedGoodsSkus,
    getRowNodeId: rowData => rowData?.nodeId, // unique id for each row.
    immutableData: true,
  };

  const agGridConfigWithExpandableRows = useExtendedAgGridWithExpandableRows({
    agGridConfig,
    expandedRowHeight: 200,
    renderExpandableRow: row => {
      return <SkusExpandedRow data={row?.data} />;
    },
  });

  return agGridConfigWithExpandableRows;
};
