import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { when } from '@plentyag/brand-ui/src/components/form-gen';
import { WidgetType } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

export enum NewOrExistingDashboardOption {
  new = 'Export to a new Dashboard',
  existing = 'Export to an existing Dashboard',
}

export interface ExporToDashoardFormikValues {
  newOrExistingDashboard: NewOrExistingDashboardOption;
  name?: string;
  dashboardId?: string;
  widgetType: WidgetType;
  colNumber?: number;
  groupMetrics?: boolean;
}

export const useExportAsDashboardFormGenConfig = (): FormGen.Config => {
  return {
    fields: [
      {
        type: 'Select',
        name: 'newOrExistingDashboard',
        label: 'Would you like to export Metrics to a new or existing Dashboard?',
        options: [NewOrExistingDashboardOption.new, NewOrExistingDashboardOption.existing],
        validate: yup.string().required(),
      },
      {
        if: when(
          ['newOrExistingDashboard'],
          newOrExistingDashboard => newOrExistingDashboard === NewOrExistingDashboardOption.new
        ),
        fields: [
          {
            type: 'TextField',
            name: 'name',
            label: 'Name of new Dashboard',
            validate: yup.string().required(),
          },
        ],
      },
      {
        if: when(
          ['newOrExistingDashboard'],
          newOrExistingDashboard => newOrExistingDashboard === NewOrExistingDashboardOption.existing
        ),
        fields: [
          {
            type: 'AutocompleteTypeahead',
            url: EVS_URLS.dashboards.listUrl(),
            name: 'dashboardId',
            label: 'Name of existing Dashboard',
            getMakeRequestParams: inputValue => ({ queryParams: { name: inputValue } }),
            transformResponse: response =>
              response.data.map(dashboard => ({ label: dashboard.name, value: dashboard.id })),
            validate: yup.string().required(),
          },
        ],
      },
      {
        if: when(['newOrExistingDashboard'], newOrExistingDashboard => Boolean(newOrExistingDashboard)),
        fields: [
          {
            type: 'Select',
            name: 'widgetType',
            label: 'Widget Types',
            options: [
              { label: 'Historical', value: WidgetType.historical },
              { label: 'Live Metric', value: WidgetType.liveMetric },
            ],
            validate: yup.string().required(),
          },
        ],
      },
      {
        if: when(['widgetType'], widgetType => widgetType === WidgetType.liveMetric),
        fields: [
          {
            type: 'TextField',
            name: 'colsCount',
            label: 'How many Widget per row?',
            validate: yup.string().required(),
            textFieldProps: { type: 'number' },
          },
        ],
      },
      {
        if: when(['widgetType'], widgetType => widgetType === WidgetType.historical),
        fields: [
          {
            type: 'Checkbox',
            name: 'groupMetrics',
            label: 'Group Metrics by Measurement Type?',
          },
        ],
      },
    ],
  };
};
