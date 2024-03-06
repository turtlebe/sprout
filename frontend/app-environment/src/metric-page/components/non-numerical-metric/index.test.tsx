import {
  ButtonCreateAlertRule,
  MetricGraphNonNumerical,
  TabLabelAlertRule,
  TableNonNumericalAlertRuleReadOnly,
} from '@plentyag/app-environment/src/common/components';
import { useFetchNonNumericalObservations } from '@plentyag/app-environment/src/common/hooks';
import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { UseSwrAxiosReturn } from '@plentyag/core/src/hooks/use-swr-axios';
import { PaginatedList } from '@plentyag/core/src/types';
import { AlertEvent, TabType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsNonNumericalMetric, EmptyPlaceholder, TableAlertEvents, TableNonNumericalAlertRuleEdit } from '..';
import { UseMetricApiReturn } from '../../hooks';

import { NonNumericalMetric } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-non-numerical-observations');
jest.mock('@plentyag/app-environment/src/common/components/table-non-numerical-alert-rule-read-only');
jest.mock('@plentyag/app-environment/src/common/components/tab-label-alert-rule');
jest.mock('@plentyag/app-environment/src/common/components/button-create-alert-rule');
jest.mock('@plentyag/app-environment/src/common/components/metric-graph-non-numerical');
jest.mock('../empty-placeholder');
jest.mock('../table-alert-events');
jest.mock('../table-non-numerical-alert-rule-edit');

const dataTestIds = {
  ...dataTestIdsNonNumericalMetric,
  metricGraph: 'mock-metric-graph',
  emptyPlaceholder: 'mock-empty-placeholder',
  tableAlertEvents: 'table-non-numerical-alert-events',
  tableAlertRuleEdit: 'table-non-numerical-alert-rule-edit',
  tableAlertRuleReadOnly: 'table-non-numerical-alert-rule-read-only',
};

const MockMetricGraph = MetricGraphNonNumerical as jest.Mock;
const MockEmptyPlaceholder = EmptyPlaceholder as jest.Mock;
const MockTableAlertEvents = TableAlertEvents as jest.Mock;
const MockNonNumericalTableAlertRuleEdit = TableNonNumericalAlertRuleEdit as jest.Mock;
const MockNonNumericalTableAlertRuleReadOnly = TableNonNumericalAlertRuleReadOnly as jest.Mock;
const MockTabLabelAlertRule = TabLabelAlertRule as jest.Mock;
const MockButtonCreateAlertRule = ButtonCreateAlertRule as jest.Mock;
const mockUseFetchNonNumericalObservations = useFetchNonNumericalObservations as jest.Mock;

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');
const metricApi = {
  metric: { ...mockMetrics[0], alertRules: mockAlertRules },
  alertRules: mockAlertRules,
  updateAlertRule: jest.fn(),
} as unknown as UseMetricApiReturn;
const alertEvents = { data: [], isValidating: false } as unknown as UseSwrAxiosReturn<PaginatedList<AlertEvent>>;
const activeAlertEvents = { data: [], isValidating: false } as unknown as UseSwrAxiosReturn<PaginatedList<AlertEvent>>;
const isEditing = false;
const handleTabChange = jest.fn();
const handleAlertRuleChange = jest.fn();
const onEdit = jest.fn();

describe('NonNumericalMetric', () => {
  beforeEach(() => {
    mockUseFetchNonNumericalObservations.mockReturnValue({
      data: [],
      isLoading: false,
      refetchWithTimeGranularity: jest.fn(),
    });
    MockMetricGraph.mockImplementation(() => <div data-testid={dataTestIds.metricGraph} />);
    MockEmptyPlaceholder.mockImplementation(() => <div data-testid={dataTestIds.emptyPlaceholder} />);
    MockTableAlertEvents.mockImplementation(() => <div data-testid={dataTestIds.tableAlertEvents} />);
    MockNonNumericalTableAlertRuleEdit.mockImplementation(() => <div data-testid={dataTestIds.tableAlertRuleEdit} />);
    MockNonNumericalTableAlertRuleReadOnly.mockImplementation(() => (
      <div data-testid={dataTestIds.tableAlertRuleReadOnly} />
    ));
    MockTabLabelAlertRule.mockImplementation(() => <div />);
    MockButtonCreateAlertRule.mockImplementation(() => <div />);
  });

  it('renders an AlertRule in read-only', () => {
    const { queryByTestId } = render(
      <NonNumericalMetric
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
    expect(queryByTestId(dataTestIds.tableAlertEvents)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dataTabPanel)).not.toBeInTheDocument();
  });

  it('renders an AlertRule in edit mode', () => {
    const { queryByTestId } = render(
      <NonNumericalMetric
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
    expect(queryByTestId(dataTestIds.tableAlertEvents)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dataTabPanel)).not.toBeInTheDocument();
  });

  it('renders a Tab for visualizing raw data', () => {
    const { queryByTestId } = render(
      <NonNumericalMetric
        currentTab={`${TabType.data},all`}
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
    expect(queryByTestId(dataTestIds.dataTab)).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.dataTabPanel)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertEvents)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit)).not.toBeInTheDocument();
  });

  it('renders a Tab for visualizing AlertEvents', () => {
    const { queryByTestId } = render(
      <NonNumericalMetric
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
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit)).not.toBeInTheDocument();
  });
});
