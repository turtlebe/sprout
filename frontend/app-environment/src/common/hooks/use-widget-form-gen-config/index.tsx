import useCoreStore from '@plentyag/core/src/core-store';
import { Widget, WidgetType } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

import { EVS_URLS, getNextWidgetPosition } from '../../utils';

export interface UseWidgetFormGenConfig {
  dashboardId?: string;
  widget?: Widget;
  widgets?: Widget[];
}

export interface UseWidgetFormGenConfigReturn extends FormGen.Config {}

export const useWidgetFormGenConfig = ({
  dashboardId,
  widget,
  widgets,
}: UseWidgetFormGenConfig): UseWidgetFormGenConfigReturn => {
  const isUpdating = Boolean(widget);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  const [coreStore] = useCoreStore();

  return {
    title: isUpdating ? 'Edit Widget' : 'Create Widget',
    createEndpoint: EVS_URLS.widgets.createUrl(),
    updateEndpoint: EVS_URLS.widgets.updateUrl(widget),
    serialize: values => ({
      dashboardId,
      ...values,
      [createdOrUpdatedBy]: coreStore.currentUser.username,
      ...(!isUpdating ? getNextWidgetPosition(widgets) : {}),
    }),
    deserialize: values => values,
    fields: [
      {
        if: () => !isUpdating,
        fields: [
          {
            type: 'Select',
            name: 'widgetType',
            label: 'Type',
            options: [
              { label: 'Historical', value: WidgetType.historical },
              { label: 'Live Metric', value: WidgetType.liveMetric },
              { label: 'Live Group', value: WidgetType.liveGroup },
            ],
            validate: yup.string().required(),
          },
        ],
      },
      {
        type: 'TextField',
        name: 'name',
        label: 'Name',
        validate: yup.string().required(),
      },
    ],
  };
};
