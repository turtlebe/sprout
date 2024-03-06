import { buildMetric, buildWidget, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { WidgetType } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { axiosRequest } from '@plentyag/core/src/utils/request';

import { createWidgets } from './create-widgets';

const [{ id: dashboardId }] = mockDashboards;
const metrics = [
  buildMetric({ path: 'sites/SITE1', measurementType: 'TEMPERATURE', observationName: 'AirTemperature' }),
  buildMetric({ path: 'sites/SITE1', measurementType: 'TEMPERATURE', observationName: 'WaterTemperature' }),
  buildMetric({ path: 'sites/SITE1', measurementType: 'FLOW_RATE', observationName: 'SupplyWaterFlowRate' }),
];
const username = 'username';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;

describe('createWidgets', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAxiosRequest.mockResolvedValue(() => buildWidget({}));
  });

  it.each([
    { rowStartOffset: undefined, offset: 0 },
    { rowStartOffset: 3, offset: 2 },
  ])('creates one Historical Widget per metric on each row', async ({ rowStartOffset, offset }) => {
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await createWidgets({
      dashboardId,
      metrics,
      widgetType: WidgetType.historical,
      username,
      rowStartOffset,
    });

    const commonAxiosArgs = {
      dashboardId,
      widgetType: WidgetType.historical,
      colStart: 1,
      colEnd: 2,
      createdBy: username,
    };
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[0].path)} - ${metrics[0].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[0].id }],
          rowStart: offset + 1,
          rowEnd: offset + 2,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[1].path)} - ${metrics[1].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[1].id }],
          rowStart: offset + 2,
          rowEnd: offset + 3,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[2].path)} - ${metrics[2].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[2].id }],
          rowStart: offset + 3,
          rowEnd: offset + 4,
        },
      })
    );
  });

  it.each([
    { rowStartOffset: undefined, offset: 0 },
    { rowStartOffset: 3, offset: 2 },
  ])('creates one Historical Widget per measurement type each row', async ({ rowStartOffset, offset }) => {
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await createWidgets({
      dashboardId,
      metrics,
      widgetType: WidgetType.historical,
      username,
      groupMetrics: true,
      rowStartOffset,
    });

    const commonAxiosArgs = {
      dashboardId,
      widgetType: WidgetType.historical,
      colStart: 1,
      colEnd: 2,
      createdBy: username,
    };
    expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: 'TEMPERATURE',
          items: [
            { itemType: 'METRIC', itemId: metrics[0].id },
            { itemType: 'METRIC', itemId: metrics[1].id },
          ],
          rowStart: offset + 1,
          rowEnd: offset + 2,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: 'FLOW_RATE',
          items: [{ itemType: 'METRIC', itemId: metrics[2].id }],
          rowStart: offset + 2,
          rowEnd: offset + 3,
        },
      })
    );
  });

  it.each([
    { rowStartOffset: undefined, offset: 0 },
    { rowStartOffset: 3, offset: 2 },
  ])('creates one Live Metric Widget per metric on each row', async ({ rowStartOffset, offset }) => {
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await createWidgets({
      dashboardId,
      metrics,
      widgetType: WidgetType.liveMetric,
      username,
      rowStartOffset,
    });

    const commonAxiosArgs = {
      dashboardId,
      widgetType: WidgetType.liveMetric,
      colStart: 1,
      colEnd: 2,
      createdBy: username,
    };
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[0].path)} - ${metrics[0].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[0].id }],
          rowStart: offset + 1,
          rowEnd: offset + 2,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[1].path)} - ${metrics[1].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[1].id }],
          rowStart: offset + 2,
          rowEnd: offset + 3,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[2].path)} - ${metrics[2].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[2].id }],
          rowStart: offset + 3,
          rowEnd: offset + 4,
        },
      })
    );
  });

  it('creates one Live Metric Widget per metric on each row', async () => {
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await createWidgets({ dashboardId, metrics, widgetType: WidgetType.liveMetric, username, colsCount: 2 });

    const commonAxiosArgs = {
      dashboardId,
      widgetType: WidgetType.liveMetric,
      createdBy: username,
    };
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[0].path)} - ${metrics[0].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[0].id }],
          rowStart: 1,
          rowEnd: 2,
          colStart: 1,
          colEnd: 2,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[1].path)} - ${metrics[1].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[1].id }],
          rowStart: 1,
          rowEnd: 2,
          colStart: 2,
          colEnd: 3,
        },
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        data: {
          ...commonAxiosArgs,
          name: `${getShortenedPath(metrics[2].path)} - ${metrics[2].observationName}`,
          items: [{ itemType: 'METRIC', itemId: metrics[2].id }],
          rowStart: 2,
          rowEnd: 3,
          colStart: 1,
          colEnd: 2,
        },
      })
    );
  });
});
