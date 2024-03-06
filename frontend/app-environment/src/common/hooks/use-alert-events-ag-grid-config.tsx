import { ObservationSource } from '@plentyag/app-environment/src/common/components/observation-source';
import { getAlertRuleTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { AgGridLinkRenderer, BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { buildAgTextColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getSelectionFilter, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { useFetchMeasurementTypes, UseFetchMeasurementTypesReturn } from '@plentyag/core/src/hooks';
import { AlertEventStatus, TabType } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import moment from 'moment';
import React from 'react';

const fields = {
  generatedAt: 'generatedAt',
  status: 'status',
  path: 'path',
  measurementType: 'measurementType',
  observationName: 'observationName',
  alertRuleType: 'alertRuleType',
  source: 'source',
  sourcePath: 'sourcePath',
};

const sortingQueryParamsMapping = {};

export interface UseAlertEventsAgGridConfig {
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface UseAlertEventsAgGridConfigReturn {
  config: BaseAgGridInfiniteTable['agGridConfig'];
  isValidating: UseFetchMeasurementTypesReturn['isLoading'];
}

export const useAlertEventsAgGridConfig = ({
  startDateTime,
  endDateTime,
}: UseAlertEventsAgGridConfig): UseAlertEventsAgGridConfigReturn => {
  const { measurementTypes, isLoading } = useFetchMeasurementTypes();

  return React.useMemo(
    () => ({
      isValidating: isLoading,
      config: {
        ...defaultConfig,
        frameworkComponents: { selectionFilter: SelectionFilter },
        columnDefs: [
          {
            field: fields.generatedAt,
            colId: fields.generatedAt,
            headerName: 'Time',
            minWidth: 250,
            cellRendererFramework: params => (
              <AgGridLinkRenderer
                to={
                  params.data &&
                  PATHS.metricPageTab(params.data?.alertRule?.metric?.id, TabType.alertRule, params.data?.alertRule?.id)
                }
              >
                {moment(params.value).format('LLL')}
              </AgGridLinkRenderer>
            ),
          },
          {
            field: fields.status,
            colId: fields.status,
            width: 180,
            ...getSelectionFilter(Object.values(AlertEventStatus), true),
          },
          {
            field: fields.path,
            colId: fields.path,
            minWidth: 500,
            ...buildAgTextColumnFilter('contains'),
            valueGetter: params => getShortenedPath(params?.data?.alertRule?.metric?.path),
          },
          {
            field: fields.measurementType,
            colId: fields.measurementType,
            ...getSelectionFilter(
              measurementTypes.map(measurementType => measurementType.key),
              true
            ),
            valueGetter: params => params?.data?.alertRule?.metric?.measurementType,
          },
          {
            field: fields.observationName,
            colId: fields.observationName,
            ...buildAgTextColumnFilter('contains'),
            valueGetter: params => params?.data?.alertRule?.metric?.observationName,
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
          {
            field: fields.sourcePath,
            colId: fields.sourcePath,
            headerName: 'Source Path',
            minWidth: 500,
            valueGetter: params =>
              params?.data?.observationData?.length > 0 ? getShortenedPath(params.data.observationData[0].path) : null,
          },
        ],
        getSortFilterServerParams: ({ sortModel, filterModel }) => {
          const sort = getSortingQueryParams(sortModel, colId => sortingQueryParamsMapping[colId]);
          const filters = getFilteringServerParams({
            filterModel,
            transformColId: (colId, filter) => {
              if (isTextFilterModel(filter) && colId === fields.path && filter.type === 'contains') {
                return 'pathContains';
              }
              if (isTextFilterModel(filter) && colId === fields.observationName && filter.type === 'contains') {
                return 'observationNameContains';
              }

              if (colId === fields.measurementType) {
                return 'measurementTypes';
              }

              if (colId === fields.status) {
                return 'statuses';
              }

              return colId;
            },
          });

          return {
            ...sort,
            ...filters,
            startDateTime: startDateTime ? startDateTime.toISOString() : undefined,
            endDateTime: endDateTime ? endDateTime.toISOString() : undefined,
          };
        },
      },
    }),
    [measurementTypes, isLoading, startDateTime, endDateTime]
  );
};
