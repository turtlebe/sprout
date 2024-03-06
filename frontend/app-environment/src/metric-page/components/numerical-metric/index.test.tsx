import {
  LinkSchedule,
  TabLabelAlertRule,
  TableAlertRuleReadOnly,
  TableScheduleReadOnly,
} from '@plentyag/app-environment/src/common/components';
import { useFetchAndConvertObservations } from '@plentyag/app-environment/src/common/hooks';
import {
  mockAlertRules,
  mockMetrics,
  mockScheduleDefinitions,
  mockSchedules,
} from '@plentyag/app-environment/src/common/test-helpers';
import { UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';
import { PaginatedList } from '@plentyag/core/src/types';
import { AlertEvent, TabType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { EmptyPlaceholder, MetricGraph, TableAlertEvents, TableAlertRuleEdit } from '..';
import { UseMetricApiReturn } from '../../hooks';

import { dataTestIdsNumericalMetric, NumericalMetric } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observations');
jest.mock('@plentyag/app-environment/src/common/components/table-alert-rule-read-only');
jest.mock('@plentyag/app-environment/src/common/components/table-schedule-read-only');
jest.mock('@plentyag/app-environment/src/common/components/tab-label-alert-rule');
jest.mock('@plentyag/app-environment/src/common/components/link-schedule');
jest.mock('../metric-graph');
jest.mock('../empty-placeholder');
jest.mock('../table-alert-events');
jest.mock('../table-alert-rule-edit');

const dataTestIds = {
  ...dataTestIdsNumericalMetric,
  metricGraph: 'mock-metric-graph',
  emptyPlaceholder: 'mock-empty-placeholder',
  tableAlertEvents: 'table-alert-events',
  tableAlertRuleEdit: 'table-alert-rule-edit',
  tableAlertRuleReadOnly: 'table-alert-rule-read-only',
  tableScheduleReadOnly: 'table-schedule-read-only',
};

const MockMetricGraph = MetricGraph as jest.Mock;
const MockEmptyPlaceholder = EmptyPlaceholder as jest.Mock;
const MockTableAlertEvents = TableAlertEvents as jest.Mock;
const MockTableAlertRuleEdit = TableAlertRuleEdit as jest.Mock;
const MockTableAlertRuleReadOnly = TableAlertRuleReadOnly as jest.Mock;
const MockTableScheduleReadOnly = TableScheduleReadOnly as jest.Mock;
const MockTabLabelAlertRule = TabLabelAlertRule as jest.Mock;
const MockLinkSchedule = LinkSchedule as jest.Mock;
const mockUseFetchAndConvertObservations = useFetchAndConvertObservations as jest.Mock;

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');
const metricApi = {
  metric: { ...mockMetrics[0], alertRules: mockAlertRules },
  scheduleAndDefinition: {
    schedule: mockSchedules[0],
    scheduleDefinition: mockScheduleDefinitions[0],
  },
  alertRules: mockAlertRules,
  updateAlertRule: jest.fn(),
} as unknown as UseMetricApiReturn;
const alertEvents = { data: [], isValidating: false } as unknown as UseSwrAxiosReturn<PaginatedList<AlertEvent>>;
const activeAlertEvents = { data: [], isValidating: false } as unknown as UseSwrAxiosReturn<PaginatedList<AlertEvent>>;
const isEditing = false;
const handleTabChange = jest.fn();
const handleAlertRuleChange = jest.fn();
const onEdit = jest.fn();

describe('NumericalMetric', () => {
  beforeEach(() => {
    mockUseFetchAndConvertObservations.mockReturnValue({
      data: [],
      isLoading: false,
      refetchWithTimeGranularity: jest.fn(),
    });
    MockMetricGraph.mockImplementation(() => <div data-testid={dataTestIds.metricGraph} />);
    MockEmptyPlaceholder.mockImplementation(() => <div data-testid={dataTestIds.emptyPlaceholder} />);
    MockTableAlertEvents.mockImplementation(() => <div data-testid={dataTestIds.tableAlertEvents} />);
    MockTableAlertRuleEdit.mockImplementation(() => <div data-testid={dataTestIds.tableAlertRuleEdit} />);
    MockTableAlertRuleReadOnly.mockImplementation(() => <div data-testid={dataTestIds.tableAlertRuleReadOnly} />);
    MockTableScheduleReadOnly.mockImplementation(() => <div data-testid={dataTestIds.tableScheduleReadOnly} />);
    MockTabLabelAlertRule.mockImplementation(() => <div />);
    MockLinkSchedule.mockImplementation(() => <div />);
  });

  it('renders an empty placeholder when no tab is selected', () => {
    const { queryByTestId } = render(
      <NumericalMetric
        currentTab={undefined}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metricApi={metricApi}
        alertEvents={alertEvents}
        activeAlertEvents={activeAlertEvents}
        isEditing={isEditing}
        handleTabChange={handleTabChange}
        onAlertRuleChange={handleAlertRuleChange}
        onEdit={onEdit}
      />
    );

    expect(queryByTestId(dataTestIds.metricGraph)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyPlaceholder)).toBeInTheDocument();
  });

  it('renders an AlertRule in read-only', () => {
    const { queryByTestId } = render(
      <NumericalMetric
        currentTab={`${TabType.alertRule},${metricApi.alertRules[0].id}`}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metricApi={metricApi}
        alertEvents={alertEvents}
        activeAlertEvents={activeAlertEvents}
        isEditing={isEditing}
        handleTabChange={handleTabChange}
        onAlertRuleChange={handleAlertRuleChange}
        onEdit={onEdit}
      />
    );

    expect(queryByTestId(dataTestIds.metricGraph)).toBeInTheDocument();
    expect(metricApi.alertRules).not.toHaveLength(0);
    metricApi.alertRules.forEach(alertRule => {
      expect(queryByTestId(dataTestIds.alertRuleTab(alertRule))).toBeInTheDocument();
    });
    expect(queryByTestId(dataTestIds.alertRuleTab(metricApi.alertRules[0]))).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.alertRuleTabPanel(metricApi.alertRules[0]))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit)).not.toBeInTheDocument();
  });

  it('renders an AlertRule in edit mode', () => {
    const { queryByTestId } = render(
      <NumericalMetric
        currentTab={`${TabType.alertRule},${metricApi.alertRules[0].id}`}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metricApi={metricApi}
        alertEvents={alertEvents}
        activeAlertEvents={activeAlertEvents}
        isEditing={true}
        handleTabChange={handleTabChange}
        onAlertRuleChange={handleAlertRuleChange}
        onEdit={onEdit}
      />
    );

    expect(queryByTestId(dataTestIds.metricGraph)).toBeInTheDocument();
    expect(metricApi.alertRules).not.toHaveLength(0);
    metricApi.alertRules.forEach(alertRule => {
      expect(queryByTestId(dataTestIds.alertRuleTab(alertRule))).toBeInTheDocument();
    });
    expect(queryByTestId(dataTestIds.alertRuleTab(metricApi.alertRules[0]))).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.alertRuleTabPanel(metricApi.alertRules[0]))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit)).toBeInTheDocument();

    // other elements shouldn't be in the tab panel
    expect(queryByTestId(dataTestIds.tableScheduleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertEvents)).not.toBeInTheDocument();
  });

  it('renders a Schedule in read-only', () => {
    const { queryByTestId } = render(
      <NumericalMetric
        currentTab={`${TabType.schedule},${metricApi.scheduleAndDefinition.schedule.id}`}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metricApi={metricApi}
        alertEvents={alertEvents}
        activeAlertEvents={activeAlertEvents}
        isEditing={isEditing}
        handleTabChange={handleTabChange}
        onAlertRuleChange={handleAlertRuleChange}
        onEdit={onEdit}
      />
    );

    expect(queryByTestId(dataTestIds.metricGraph)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleTab(metricApi.scheduleAndDefinition.schedule))).toHaveAttribute(
      'aria-selected',
      'true'
    );

    expect(queryByTestId(dataTestIds.scheduleTabPanel(metricApi.scheduleAndDefinition.schedule))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableScheduleReadOnly)).toBeInTheDocument();

    // other elements shouldn't be in the tab panel
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertEvents)).not.toBeInTheDocument();
  });

  it('renders a tab for AlertEvents', () => {
    const { queryByTestId } = render(
      <NumericalMetric
        currentTab={`${TabType.alertEvents},all`}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metricApi={metricApi}
        alertEvents={alertEvents}
        activeAlertEvents={activeAlertEvents}
        isEditing={isEditing}
        handleTabChange={handleTabChange}
        onAlertRuleChange={handleAlertRuleChange}
        onEdit={onEdit}
      />
    );

    expect(queryByTestId(dataTestIds.metricGraph)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertEventsTab)).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.alertEventsTabPanel)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertEvents)).toBeInTheDocument();

    // other elements shouldn't be in the tab panel
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableScheduleReadOnly)).not.toBeInTheDocument();
  });
});
