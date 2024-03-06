import { useFetchAndConvertObservations } from '@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observations';
import {
  buildAlertRule,
  mockMetrics,
  mockRolledUpByTimeObservations,
} from '@plentyag/app-environment/src/common/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { dataTestIdsLiveMetric as dataTestIds, LiveMetric } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observations');

const mockUseFetchAndConvertObservations = useFetchAndConvertObservations as jest.Mock;
const [metric] = mockMetrics;
const endDateTime = moment().toDate();
const startDateTime = moment(endDateTime).subtract(2, 'hours').toDate();
const activeTabClass = 'Mui-selected';

mockUseFetchMeasurementTypes();

describe('LiveMetric', () => {
  it('returns a card with a loader', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({ data: undefined, isLoading: true });

    const { queryByTestId } = render(
      <LiveMetric metric={metric} startDateTime={startDateTime} endDateTime={endDateTime} />
    );

    expect(queryByTestId(dataTestIds.value)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.metricStatus.noData)).toBeInTheDocument();
  });

  it('returns a card with no data', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({ data: undefined, isLoading: false });

    const { queryByTestId } = render(
      <LiveMetric metric={metric} startDateTime={startDateTime} endDateTime={endDateTime} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.value)).toBeVisible();
    expect(queryByTestId(dataTestIds.value)).toHaveTextContent('No Data');
    expect(queryByTestId(dataTestIds.metricStatus.noData)).toBeInTheDocument();
  });

  it('returns a card showing the metric is in range', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({ data: mockRolledUpByTimeObservations, isLoading: false });

    const metricWithAlertRule = {
      ...metric,
      alertRules: [buildAlertRule({ rules: [{ gte: 0, lte: 20, time: 0 }] })],
    };

    const { queryByTestId } = render(
      <LiveMetric metric={metricWithAlertRule} startDateTime={startDateTime} endDateTime={endDateTime} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.value)).toHaveTextContent('10 C');
    expect(queryByTestId(dataTestIds.metricStatus.inRange)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleStatus(metricWithAlertRule.alertRules[0]).inRange)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(metricWithAlertRule.alertRules[0]))).toHaveClass(activeTabClass);
  });

  it('returns a card showing the metric is out of range', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({ data: mockRolledUpByTimeObservations, isLoading: false });

    const metricWithAlertRule = {
      ...metric,
      alertRules: [buildAlertRule({ rules: [{ gte: 15, lte: 20, time: 0 }] })],
    };

    const { queryByTestId } = render(
      <LiveMetric metric={metricWithAlertRule} startDateTime={startDateTime} endDateTime={endDateTime} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.value)).toHaveTextContent('10 C');
    expect(queryByTestId(dataTestIds.metricStatus.outOfRange)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(metricWithAlertRule.alertRules[0]))).toHaveClass(activeTabClass);
    expect(
      queryByTestId(dataTestIds.alertRuleStatus(metricWithAlertRule.alertRules[0]).outOfRange)
    ).toBeInTheDocument();
  });

  it('returns a card showing the metric is out of range when one of the alert rule is out of range', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({ data: mockRolledUpByTimeObservations, isLoading: false });

    const metricWithAlertRule = {
      ...metric,
      alertRules: [
        buildAlertRule({ rules: [{ gte: 10, lte: 20, time: 0 }] }),
        buildAlertRule({ rules: [{ gte: 15, lte: 20, time: 0 }] }),
      ],
    };

    const { queryByTestId } = render(
      <LiveMetric metric={metricWithAlertRule} startDateTime={startDateTime} endDateTime={endDateTime} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.value)).toHaveTextContent('10 C');
    expect(queryByTestId(dataTestIds.metricStatus.outOfRange)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(metricWithAlertRule.alertRules[0]))).not.toHaveClass(activeTabClass);
    expect(queryByTestId(dataTestIds.alertRuleTab(metricWithAlertRule.alertRules[1]))).toHaveClass(activeTabClass);
    expect(queryByTestId(dataTestIds.alertRuleStatus(metricWithAlertRule.alertRules[0]).inRange)).toBeInTheDocument();
    expect(
      queryByTestId(dataTestIds.alertRuleStatus(metricWithAlertRule.alertRules[1]).outOfRange)
    ).toBeInTheDocument();
  });
});
