import { DialogWidgetItems } from '@plentyag/app-environment/src/common/components';
import { useConverter } from '@plentyag/app-environment/src/common/hooks';
import {
  buildMetric,
  buildSchedule,
  buildScheduleDefinition,
  buildWidget,
  buildWidgetItem,
  mockDashboards,
} from '@plentyag/app-environment/src/common/test-helpers';
import {
  DashboardGraphMetricNonNumerical,
  DashboardGraphMetrics,
  DashboardGraphSchedules,
} from '@plentyag/app-environment/src/dashboard-page/components';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { WidgetItem } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { DashboardGridContext } from '../../hooks';

import { dataTestIdsWidgetHistorical as dataTestIds, WidgetHistorical } from '.';

jest.mock('@plentyag/app-environment/src/dashboard-page/components/dashboard-graph-metric-non-numerical');
jest.mock('@plentyag/app-environment/src/dashboard-page/components/dashboard-graph-metrics');
jest.mock('@plentyag/app-environment/src/dashboard-page/components/dashboard-graph-schedules');
jest.mock('@plentyag/app-environment/src/common/components/dialog-widget-items');
jest.mock('@plentyag/app-environment/src/common/hooks/use-converter');
jest.mock('@plentyag/core/src/hooks/use-fetch-measurement-types');

const actionDefinition = { from: 0, to: 100, measurementType: 'TEMPERATURE', graphable: true };
const dashboard = mockDashboards[0];
const widget = buildWidget({});
const onDeleted = jest.fn();
const startDateTime = new Date();
const endDateTime = new Date();
const mockUseConverter = useConverter as jest.Mock;
const MockDashboardGraphMetricNonNumerical = DashboardGraphMetricNonNumerical as jest.Mock;
const MockDashboardGraphMetrics = DashboardGraphMetrics as jest.Mock;
const MockDashboardGraphSchedules = DashboardGraphSchedules as jest.Mock;
const MockDialogWidgetItems = DialogWidgetItems as jest.Mock;

function renderWidgetHistorical(items: WidgetItem[] = []) {
  return render(
    <DashboardGridContext.Provider value={{ canDrag: false, dashboard, startDateTime, endDateTime }}>
      <WidgetHistorical widget={{ ...widget, items }} onDeleted={onDeleted} />
    </DashboardGridContext.Provider>
  );
}

describe('WidgetHistorical', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseFetchMeasurementTypes();

    MockDashboardGraphMetricNonNumerical.mockImplementation(() => <div />);
    MockDashboardGraphMetrics.mockImplementation(() => <div />);
    MockDashboardGraphSchedules.mockImplementation(() => <div />);
    MockDialogWidgetItems.mockImplementation(() => <div />);
  });

  it('renders a placeholder to edit widget items', () => {
    mockUseConverter.mockReturnValue({
      schedules: undefined,
      scheduleDefinitions: undefined,
      metrics: undefined,
      isLoading: false,
    });

    const { queryByTestId } = renderWidgetHistorical();

    expect(queryByTestId(dataTestIds.editWidget)).toBeInTheDocument();
    expect(MockDialogWidgetItems).toHaveBeenCalledWith(expect.objectContaining({ open: false }), {});

    queryByTestId(dataTestIds.editWidget).click();

    expect(MockDialogWidgetItems).toHaveBeenCalledWith(expect.objectContaining({ open: true }), {});
  });

  it('renders a schedule', () => {
    const schedules = [buildSchedule({})];
    const scheduleDefinitions = [buildScheduleDefinition({ actionDefinition })];

    mockUseConverter.mockReturnValue({
      schedules,
      scheduleDefinitions,
      metrics: undefined,
      isLoading: false,
    });

    const { queryByTestId } = renderWidgetHistorical(schedules.map(buildWidgetItem));

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockDashboardGraphMetricNonNumerical).not.toHaveBeenCalled();
    expect(MockDashboardGraphMetrics).not.toHaveBeenCalled();
    expect(MockDashboardGraphSchedules).toHaveBeenCalledWith(
      expect.objectContaining({ schedules, scheduleDefinitions, startDateTime, endDateTime, title: widget.name }),
      {}
    );
  });

  it('renders multiple schedules', () => {
    const schedules = [buildSchedule({}), buildSchedule({})];
    const scheduleDefinitions = [
      buildScheduleDefinition({ actionDefinition }),
      buildScheduleDefinition({ actionDefinition }),
    ];

    mockUseConverter.mockReturnValue({
      schedules,
      scheduleDefinitions,
      metrics: undefined,
      isLoading: false,
    });

    const { queryByTestId } = renderWidgetHistorical(schedules.map(buildWidgetItem));

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockDashboardGraphMetricNonNumerical).not.toHaveBeenCalled();
    expect(MockDashboardGraphMetrics).not.toHaveBeenCalled();
    expect(MockDashboardGraphSchedules).toHaveBeenCalledWith(
      expect.objectContaining({ schedules, scheduleDefinitions, startDateTime, endDateTime, title: widget.name }),
      {}
    );
  });

  it('renders a loader while fetching schedule definitions', () => {
    const schedules = [buildSchedule({}), buildSchedule({})];

    mockUseConverter.mockReturnValue({
      schedules,
      scheduleDefinitions: undefined,
      metrics: undefined,
      isLoading: true,
    });

    const { queryByTestId } = renderWidgetHistorical(schedules.map(buildWidgetItem));

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockDashboardGraphMetricNonNumerical).not.toHaveBeenCalled();
    expect(MockDashboardGraphMetrics).not.toHaveBeenCalled();
    expect(MockDashboardGraphSchedules).not.toHaveBeenCalled();
  });

  it('renders a non-numerical metric', () => {
    const metric = buildMetric({ measurementType: 'BINARY_STATE' });

    mockUseConverter.mockReturnValue({
      schedules: undefined,
      scheduleDefinitions: undefined,
      metrics: undefined,
      isLoading: false,
    });

    const { queryByTestId } = renderWidgetHistorical([buildWidgetItem(metric)]);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockDashboardGraphMetricNonNumerical).toHaveBeenCalledWith(
      expect.objectContaining({ metric, startDateTime, endDateTime, title: widget.name }),
      {}
    );
    expect(MockDashboardGraphMetrics).not.toHaveBeenCalled();
    expect(MockDashboardGraphSchedules).not.toHaveBeenCalledWith();
  });

  it('renders one numerical metric', () => {
    const metric = buildMetric({ measurementType: 'TEMPERATURE' });

    mockUseConverter.mockReturnValue({
      schedules: undefined,
      scheduleDefinitions: undefined,
      metrics: [metric],
      isLoading: false,
    });

    const { queryByTestId } = renderWidgetHistorical([buildWidgetItem(metric)]);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockDashboardGraphMetricNonNumerical).not.toHaveBeenCalled();
    expect(MockDashboardGraphMetrics).toHaveBeenCalledWith(
      expect.objectContaining({ dashboard, metrics: [metric], startDateTime, endDateTime, title: widget.name }),
      {}
    );
    expect(MockDashboardGraphSchedules).not.toHaveBeenCalledWith();
  });

  it('renders two numerical metric', () => {
    const metrics = [buildMetric({ measurementType: 'TEMPERATURE' }), buildMetric({ measurementType: 'TEMPERATURE' })];

    mockUseConverter.mockReturnValue({
      schedules: undefined,
      scheduleDefinitions: undefined,
      metrics,
      isLoading: false,
    });

    const { queryByTestId } = renderWidgetHistorical(metrics.map(buildWidgetItem));

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();

    expect(MockDashboardGraphMetricNonNumerical).not.toHaveBeenCalled();
    expect(MockDashboardGraphMetrics).toHaveBeenCalledWith(
      expect.objectContaining({ dashboard, metrics, startDateTime, endDateTime, title: widget.name }),
      {}
    );
    expect(MockDashboardGraphSchedules).not.toHaveBeenCalledWith();
  });
});
