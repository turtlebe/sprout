import { getAlertRuleTypeLabels } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { AgGridLinkRenderer, BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { buildAgTextColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getSelectionFilter, SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';
import {
  AlertRuleType,
  AlertStatusType,
  SubscriptionMethod,
  SubscriptionMethodDisplay,
  UsersMetric,
} from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { isEqual } from 'lodash';
import moment from 'moment';
import React from 'react';

import { ButtonFavoriteMetric } from '../components/button-favorite-metric';
import { getAlertRuleTypeLabel, getAlertStatusTypeLabels, getSubscriptionTypeLabels } from '../utils';

export const fields = {
  favorite: 'favorite',
  path: 'path',
  measurementType: 'measurementType',
  observationName: 'observationName',
  alertRuleTypes: 'alertRuleTypes',
  alertStatuses: 'alertStatuses',
  hasSchedule: 'hasSchedule',
  subscriptions: 'subscriptions',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const sortingQueryParamsMapping = {
  alertRuleTypes: 'alertRuleType',
  subscriptions: 'method',
  alertStatuses: 'isEnabled',
};

export interface UseMetricsAgGridConfigReturn {
  isValidating: UseSwrAxiosReturn<unknown, unknown>['isValidating'];
  config: BaseAgGridInfiniteTable['agGridConfig'];
}

export const useMetricsAgGridConfig = (usersMetrics: UsersMetric[]): UseMetricsAgGridConfigReturn => {
  const { measurementTypes, isLoading } = useFetchMeasurementTypes();

  return React.useMemo(
    () => ({
      isValidating: isLoading,
      config: {
        ...defaultConfig,
        frameworkComponents: { selectionFilter: SelectionFilter },
        columnDefs: [
          {
            field: fields.favorite,
            colId: fields.favorite,
            sortable: false,
            cellRendererFramework: params => {
              return params.data ? (
                <ButtonFavoriteMetric metric={params.data} usersMetrics={usersMetrics} disableFetching />
              ) : null;
            },
            width: 74,
            resizable: false,
          },
          {
            field: fields.path,
            colId: fields.path,
            cellRendererFramework: params => (
              <AgGridLinkRenderer to={params.data && PATHS.metricPage(params.data.id)}>
                {getShortenedPath(params.value)}
              </AgGridLinkRenderer>
            ),
            checkboxSelection: true,
            minWidth: 400,
            filter: 'agTextColumnFilter',
            ...buildAgTextColumnFilter('contains'),
            // for ClientSideModel only
            filterValueGetter: params => getShortenedPath(params.data.path),
          },
          {
            field: fields.measurementType,
            colId: fields.measurementType,
            ...getSelectionFilter(
              measurementTypes.map(measurementType => measurementType.key),
              true
            ),
            filterValueGetter: params => ({ name: params.data.measurementType, value: params.data.measurementType }),
          },
          {
            field: fields.observationName,
            colId: fields.observationName,
            ...buildAgTextColumnFilter('contains'),
          },
          {
            headerName: 'Alert Rules',
            field: fields.alertRuleTypes,
            colId: fields.alertRuleTypes,
            valueGetter: params => getAlertRuleTypeLabels(params?.data?.alertRules),
            filter: 'selectionFilter',
            filterParams: {
              multiple: true,
              disableOrderBy: true,
              selectableItems: [
                { name: 'None', value: 'NONE', exclusive: true },
                ...[
                  AlertRuleType.controlLimit,
                  AlertRuleType.nonNumerical,
                  AlertRuleType.specLimit,
                  AlertRuleType.specLimitDevices,
                ].map(type => ({ name: getAlertRuleTypeLabel(type), value: type })),
              ],
            },
          },
          {
            headerName: 'Alert Statuses',
            field: fields.alertStatuses,
            colId: fields.alertStatuses,
            valueGetter: params => {
              return params?.data?.alertRules ? getAlertStatusTypeLabels(params?.data?.alertRules) : null;
            },
            filter: 'selectionFilter',
            filterParams: {
              disableOrderBy: true,
              selectableItems: [AlertStatusType.on, AlertStatusType.off, AlertStatusType.snoozed].map(type => ({
                name: type,
                value: type,
              })),
            },
          },
          {
            headerName: 'Subscriptions',
            field: fields.subscriptions,
            colId: fields.subscriptions,
            valueGetter: params => {
              return params?.data?.alertRules ? getSubscriptionTypeLabels(params?.data?.alertRules) : null;
            },
            filter: 'selectionFilter',
            filterParams: {
              multiple: true,
              disableOrderBy: true,
              selectableItems: [
                { name: 'None', value: 'NONE', exclusive: true },
                {
                  name: `${SubscriptionMethodDisplay[SubscriptionMethod.opsGenie]}`,
                  value: SubscriptionMethod.opsGenie,
                },
                { name: `${SubscriptionMethodDisplay[SubscriptionMethod.slack]}`, value: SubscriptionMethod.slack },
              ],
            },
          },
          {
            headerName: 'Created By',
            field: fields.createdBy,
            colId: fields.createdBy,
            ...buildAgTextColumnFilter('contains'),
          },
          {
            headerName: 'Updated By',
            field: fields.updatedBy,
            colId: fields.updatedBy,
            ...buildAgTextColumnFilter('contains'),
          },
          {
            headerName: 'Created At',
            field: fields.createdAt,
            colId: fields.createdAt,
            valueFormatter: params => moment(params.value).format('LLL'),
          },
          {
            headerName: 'Updated At',
            field: fields.updatedAt,
            colId: fields.updatedAt,
            valueFormatter: params => moment(params.value).format('LLL'),
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

              if (colId === fields.subscriptions) {
                return 'subscriptionMethods';
              }

              return colId;
            },
          });

          // when only "NONE" is selected we actually need to pass an empty array to the backend to query Metrics without AlertRules & SubscriptionMethods.
          const alertRuleTypes = isEqual(filters['alertRuleTypes'], ['NONE']) ? [] : filters['alertRuleTypes'];
          const subscriptionMethods = isEqual(filters['subscriptionMethods'], ['NONE'])
            ? []
            : filters['subscriptionMethods'];

          // There's a special set of conditions to filter on alertStatuses, since the front-end uses three possible values: 'On', 'Off', 'Snoozed'.
          // While the backend uses the 'isEnabled' and 'isSnoozed' flags
          // Set isEnabled & isSnoozed filters to undefined, so neither filter is passed by default
          let isEnabled = undefined;
          let isSnoozed = undefined;
          // Check user's selection for alertStatuses
          if (filters['alertStatuses'] == AlertStatusType.on) {
            isEnabled = true;
            // Need to apply isSnoozed filter to false, otherwise we get enabled and snoozed, since snoozed alerts are marked as enabled=true on the back-end
            isSnoozed = false;
          }
          if (filters['alertStatuses'] == AlertStatusType.off) {
            isEnabled = false;
          }
          if (filters['alertStatuses'] == AlertStatusType.snoozed) {
            isSnoozed = true;
          }

          return {
            ...sort,
            ...{ ...filters, alertRuleTypes, subscriptionMethods, isEnabled, isSnoozed },
          };
        },
      },
    }),
    [measurementTypes, isLoading, usersMetrics]
  );
};
