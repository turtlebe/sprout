import { DialogWidgetItems } from '@plentyag/app-environment/src/common/components';
import {
  buildMetric,
  buildSchedule,
  buildWidget,
  buildWidgetItem,
} from '@plentyag/app-environment/src/common/test-helpers';
import {
  WidgetLiveGroupMetric,
  WidgetLiveGroupSchedule,
} from '@plentyag/app-environment/src/dashboard-page/components/widget-live-group/components';
import { WidgetItem, WidgetType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { DashboardGridContext } from '../../hooks';

import { dataTestIdsWidgetLiveGroup as dataTestIds, WidgetLiveGroup } from '.';

jest.mock('@plentyag/app-environment/src/common/components/dialog-widget-items');
jest.mock('./components/widget-live-group-metric');
jest.mock('./components/widget-live-group-schedule');

const MockWidgetLiveGroupMetric = WidgetLiveGroupMetric as jest.Mock;
const MockWidgetLiveGroupSchedule = WidgetLiveGroupSchedule as jest.Mock;
const MockDialogWidgetItems = DialogWidgetItems as jest.Mock;
const onDeleted = jest.fn();
const widget = buildWidget({ widgetType: WidgetType.liveGroup });

function renderWidgetLiveGroup(items: WidgetItem[] = []) {
  return render(
    <DashboardGridContext.Provider
      value={{ canDrag: false, dashboard: undefined, startDateTime: undefined, endDateTime: undefined }}
    >
      <WidgetLiveGroup widget={{ ...widget, items }} onDeleted={onDeleted} />
    </DashboardGridContext.Provider>
  );
}

describe('WidgetLiveGroup', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    MockWidgetLiveGroupMetric.mockImplementation(() => <div />);
    MockWidgetLiveGroupSchedule.mockImplementation(() => <div />);
    MockDialogWidgetItems.mockImplementation(() => <div />);
  });

  it('renders a placeholder to edit widget items', () => {
    const { queryByTestId } = renderWidgetLiveGroup();

    expect(queryByTestId(dataTestIds.editWidget)).toBeInTheDocument();
    expect(MockDialogWidgetItems).toHaveBeenCalledWith(expect.objectContaining({ open: false }), {});

    queryByTestId(dataTestIds.editWidget).click();

    expect(MockDialogWidgetItems).toHaveBeenCalledWith(expect.objectContaining({ open: true }), {});
  });

  it('renders a metric', () => {
    const alertRuleId = 'mock-id';
    const metric = buildMetric({});

    const { queryByTestId } = renderWidgetLiveGroup([buildWidgetItem(metric, { alertRuleId })]);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockWidgetLiveGroupMetric).toHaveBeenCalledWith(
      expect.objectContaining({ metric, options: { alertRuleId } }),
      {}
    );
    expect(MockWidgetLiveGroupSchedule).not.toHaveBeenCalled();
  });

  it('renders a schedule', () => {
    const actionDefinitionKey = 'zone1';
    const schedule = buildSchedule({});

    const { queryByTestId } = renderWidgetLiveGroup([buildWidgetItem(schedule, { actionDefinitionKey })]);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockWidgetLiveGroupMetric).not.toHaveBeenCalled();
    expect(MockWidgetLiveGroupSchedule).toHaveBeenCalledWith(
      expect.objectContaining({ schedule, options: { actionDefinitionKey }, remainingPath: 'SetLightIntensity' }),
      {}
    );
  });

  it('renders two schedules', () => {
    const schedules = [
      buildSchedule({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/scheduleDefinitions/SetTemperature' }),
      buildSchedule({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom2/scheduleDefinitions/SetTemperature' }),
    ];

    const { queryByTestId } = renderWidgetLiveGroup([
      buildWidgetItem(schedules[0], {}),
      buildWidgetItem(schedules[1], {}),
    ]);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockWidgetLiveGroupMetric).not.toHaveBeenCalled();
    [1, 2].forEach((time, index) => {
      expect(MockWidgetLiveGroupSchedule).toHaveBeenNthCalledWith(
        time,
        expect.objectContaining({
          schedule: schedules[index],
          options: {},
          remainingPath: `GrowRoom${index + 1}/SetTemperature`,
        }),
        {}
      );
    });
  });

  it('renders 4 schedules but only 3 visible by default', () => {
    const schedules = [
      buildSchedule({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/scheduleDefinitions/SetTemperature' }),
      buildSchedule({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom2/scheduleDefinitions/SetTemperature' }),
      buildSchedule({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom3/scheduleDefinitions/SetTemperature' }),
      buildSchedule({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom4/scheduleDefinitions/SetTemperature' }),
    ];

    const { queryByTestId } = renderWidgetLiveGroup([
      buildWidgetItem(schedules[0], {}),
      buildWidgetItem(schedules[1], {}),
      buildWidgetItem(schedules[2], {}),
      buildWidgetItem(schedules[3], {}),
    ]);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expand)).toBeInTheDocument();

    expect(MockWidgetLiveGroupMetric).not.toHaveBeenCalled();
    expect(MockWidgetLiveGroupSchedule).toHaveBeenCalledTimes(3);
    [1, 2, 3].forEach((time, index) => {
      expect(MockWidgetLiveGroupSchedule).toHaveBeenNthCalledWith(
        time,
        expect.objectContaining({
          schedule: schedules[index],
          options: {},
          remainingPath: `GrowRoom${index + 1}/SetTemperature`,
        }),
        {}
      );
    });

    // Expand!
    queryByTestId(dataTestIds.expand).click();

    expect(MockWidgetLiveGroupSchedule).toHaveBeenCalledTimes(3 + 4);

    [4, 5, 6, 7].forEach((time, index) => {
      expect(MockWidgetLiveGroupSchedule).toHaveBeenNthCalledWith(
        time,
        expect.objectContaining({
          schedule: schedules[index],
          options: {},
          remainingPath: `GrowRoom${index + 1}/SetTemperature`,
        }),
        {}
      );
    });

    // Collapse!
    queryByTestId(dataTestIds.expand).click();

    expect(MockWidgetLiveGroupSchedule).toHaveBeenCalledTimes(3 + 4 + 3);

    [8, 9, 10].forEach((time, index) => {
      expect(MockWidgetLiveGroupSchedule).toHaveBeenNthCalledWith(
        time,
        expect.objectContaining({
          schedule: schedules[index],
          options: {},
          remainingPath: `GrowRoom${index + 1}/SetTemperature`,
        }),
        {}
      );
    });
  });
});
