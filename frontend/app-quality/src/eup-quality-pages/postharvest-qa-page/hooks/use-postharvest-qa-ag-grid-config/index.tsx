import { StatusLabel } from '@plentyag/brand-ui/src/components';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import {
  defaultAgTextContainsColumnFilter,
  defaultAgTextEqualsColumnFilter,
} from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { IngestButton } from '../../components/ingest-button';
import { PostharvestIngest } from '../../types';
import { getIngestStatus } from '../../utils/get-ingest-status';
import { getPostharvestQaId } from '../../utils/get-postharvest-qa-id';

const FEATURE_INGEST = 'postharvestIngest';

export interface UsePostharvestQaAgGridConfig {
  siteName?: string;
  farmName?: string;
  postharvestIngestRecord?: Record<string, PostharvestIngest>;
  onCreateIngest?: (data: PostharvestIngest) => void;
}

enum Fields {
  STATUS = 'status',
  LOT_NAME = 'lot',
  TOTAL_AUDITS = 'totalAudits',
  SKU = 'sku',
  FIRST_AUDIT_AT = 'firstAuditAt',
  LAST_AUDIT_AT = 'lastAuditAt',
  OBSERVATION = 'observation',
  ACTIONS = 'actions',
}

export const usePostharvestQaAgGridConfig = ({
  siteName,
  farmName,
  postharvestIngestRecord,
  onCreateIngest = () => {},
}: UsePostharvestQaAgGridConfig): BaseAgGridClientSideTable['agGridConfig'] => {
  const featureIngest = useFeatureFlag(FEATURE_INGEST);
  const isIngestEnabled = featureIngest === 'true';

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Status',
        field: Fields.STATUS,
        colId: Fields.STATUS,
        sortable: false,
        minWidth: 150,
        valueGetter: row => row.data.status,
        cellRendererFramework: ({ data }) => {
          const id = getPostharvestQaId(data);
          const record = postharvestIngestRecord[id];
          const statusLevel = getIngestStatus(record);
          return (
            <Box display="flex" alignItems="center">
              <StatusLabel level={statusLevel} text={statusLevel.toString()} />
            </Box>
          );
        },
      },
      {
        headerName: 'Packaging Lot',
        field: Fields.LOT_NAME,
        colId: Fields.LOT_NAME,
        valueGetter: row => row.data.lot,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Sku',
        field: Fields.SKU,
        colId: Fields.SKU,
        valueGetter: row => row.data.sku,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'First audit at',
        field: Fields.FIRST_AUDIT_AT,
        colId: Fields.FIRST_AUDIT_AT,
        valueGetter: row => DateTime.fromISO(row.data.firstAuditAt).toFormat(DateTimeFormat.DEFAULT),
      },
      {
        headerName: 'Last audit at',
        field: Fields.LAST_AUDIT_AT,
        colId: Fields.LAST_AUDIT_AT,
        valueGetter: row => DateTime.fromISO(row.data.lastAuditAt).toFormat(DateTimeFormat.DEFAULT),
      },
      {
        headerName: 'Total',
        field: Fields.TOTAL_AUDITS,
        colId: Fields.TOTAL_AUDITS,
        valueGetter: row => row.data.totalAudits,
        ...defaultAgTextEqualsColumnFilter,
      },
      {
        headerName: 'Observation',
        field: Fields.OBSERVATION,
        colId: Fields.OBSERVATION,
        minWidth: 50,
        sortable: false,
        valueGetter: row => row.data,
        cellRendererFramework: ({ data }) => {
          return (
            isIngestEnabled && (
              <IngestButton
                isIngested={Boolean(postharvestIngestRecord[getPostharvestQaId(data)])}
                siteName={siteName}
                farmName={farmName}
                lotName={data.lot}
                skuName={data.sku}
                onCreateIngest={onCreateIngest}
              />
            )
          );
        },
      },
    ],
    [isIngestEnabled, postharvestIngestRecord]
  );

  const agGridConfig = {
    ...defaultConfig,
    components: {},
    columnDefs,
    getRowNodeId: rowData => getPostharvestQaId(rowData), // unique id for each row.
    immutableData: true,
  };

  return agGridConfig;
};
