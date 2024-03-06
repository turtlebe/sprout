import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ObservationSource } from '@plentyag/app-environment/src/common/components/observation-source';
import { getAlertRuleTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { buildAgTextColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getSelectionFilter, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { getShortenedPath } from '@plentyag/core/src/utils';
import moment from 'moment';
import React from 'react';

export const fields = {
  path: 'path',
  generatedAt: 'generatedAt',
  status: 'status',
  measurementType: 'measurementType',
  observationName: 'observationName',
  alertRuleType: 'alertRuleType',
  source: 'source',
};

export const useGroupedAlertEventsAgGridConfig = (): BaseAgGridClientSideTable['agGridConfig'] => {
  const { measurementTypes } = useFetchMeasurementTypes();

  return React.useMemo(
    () => ({
      ...defaultConfig,
      frameworkComponents: { selectionFilter: SelectionFilter },
      modules: [...AllCommunityModules, RowGroupingModule],
      groupDisplayType: 'groupRows',
      groupDefaultExpanded: 1,
      groupRemoveSingleChildren: true,
      columnDefs: [
        {
          field: fields.path,
          colId: fields.path,
          minWidth: 600,
          valueGetter: params => getShortenedPath(params?.data?.observationData?.[0]?.path),
          headerName: 'Source Path',
          rowGroup: true,
          ...buildAgTextColumnFilter('contains'),
        },
        {
          field: fields.generatedAt,
          colId: fields.generatedAt,
          headerName: 'Time',
          valueGetter: params => moment(params?.data?.generatedAt).format('MM/DD/YYYY hh:mm A'),
        },
        {
          field: fields.status,
          colId: fields.status,
          valueGetter: params => params?.data?.status,
        },
        {
          field: fields.measurementType,
          colId: fields.measurementType,
          valueGetter: params => params?.data?.alertRule?.metric?.measurementType,
          ...getSelectionFilter(
            measurementTypes.map(measurementType => measurementType.key),
            true
          ),
        },
        {
          field: fields.observationName,
          colId: fields.observationName,
          valueGetter: params => params?.data?.alertRule?.metric?.observationName,
          ...buildAgTextColumnFilter('contains'),
        },
        {
          field: fields.alertRuleType,
          colId: fields.alertRuleType,
          valueGetter: params => getAlertRuleTypeLabel(params?.data?.alertRule?.alertRuleType),
        },
        {
          field: fields.source,
          colId: fields.source,
          minWidth: 600,
          cellRendererFramework: params =>
            params?.data?.observationData?.length > 0 ? (
              <ObservationSource observation={params.data.observationData[0]} fontSize="14px" />
            ) : null,
        },
      ],
    }),
    []
  );
};
