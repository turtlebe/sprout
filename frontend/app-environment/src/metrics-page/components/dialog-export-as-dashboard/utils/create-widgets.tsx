import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { Metric, Widget, WidgetType } from '@plentyag/core/src/types/environment';
import { axiosRequest, getShortenedPath } from '@plentyag/core/src/utils';
import { AxiosRequestConfig } from 'axios';
import { groupBy } from 'lodash';

interface GetAxiosDataBodyRequest {
  name: string;
  rowStart: number;
  colStart: number;
  rowEnd: number;
  colEnd: number;
  items: { itemId: string; itemType: string }[];
}

const getAxiosData = (
  dashboardId: string,
  widgetType: WidgetType,
  username: string,
  bodyRequest: GetAxiosDataBodyRequest
  // eslint-disable-next-line max-params
): AxiosRequestConfig => ({
  url: EVS_URLS.widgets.createUrl(),
  method: 'POST',
  data: {
    ...bodyRequest,
    dashboardId,
    widgetType,
    createdBy: username,
  },
});

export interface CreateWidgets {
  colsCount?: number;
  dashboardId: string;
  groupMetrics?: boolean;
  metrics: Metric[];
  rowStartOffset?: number;
  username: string;
  widgetType: WidgetType;
}

export async function createWidgets({
  colsCount,
  dashboardId,
  groupMetrics,
  metrics,
  rowStartOffset: rowStartOffsetArg,
  username,
  widgetType,
}: CreateWidgets) {
  const rowStartOffset = rowStartOffsetArg ? rowStartOffsetArg - 1 : 0;

  if (widgetType === WidgetType.historical && groupMetrics) {
    const metricsGroupedByMeasurementType = groupBy(metrics, 'measurementType');

    return Promise.all(
      Object.entries(metricsGroupedByMeasurementType).map(async ([measurementType, metrics], index) =>
        axiosRequest<Widget>(
          getAxiosData(dashboardId, widgetType, username, {
            name: measurementType,
            rowStart: rowStartOffset + index + 1,
            colStart: 1,
            rowEnd: rowStartOffset + index + 2,
            colEnd: 2,
            items: metrics.map(metric => ({ itemType: 'METRIC', itemId: metric.id })),
          })
        )
      )
    );
  }

  if (widgetType === WidgetType.liveMetric && colsCount) {
    return Promise.all(
      metrics.map(async (metric, index) =>
        axiosRequest<Widget>(
          getAxiosData(dashboardId, widgetType, username, {
            name: `${getShortenedPath(metric.path)} - ${metric.observationName}`,
            rowStart: rowStartOffset + Math.floor(index / colsCount) + 1,
            colStart: (index % colsCount) + 1,
            rowEnd: rowStartOffset + Math.floor(index / colsCount) + 2,
            colEnd: (index % colsCount) + 2,
            items: [{ itemType: 'METRIC', itemId: metric.id }],
          })
        )
      )
    );
  }

  return Promise.all(
    metrics.map(async (metric, index) =>
      axiosRequest<Widget>(
        getAxiosData(dashboardId, widgetType, username, {
          name: `${getShortenedPath(metric.path)} - ${metric.observationName}`,
          rowStart: rowStartOffset + index + 1,
          colStart: 1,
          rowEnd: rowStartOffset + index + 2,
          colEnd: 2,
          items: [{ itemType: 'METRIC', itemId: metric.id }],
        })
      )
    )
  );
}
