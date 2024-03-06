import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { buildAlertRule, buildMetric, buildRolledUpByTimeObservation } from '../../test-helpers';

import { dataTestIdsLiveRuleValue as dataTestIds, LiveRuleValue } from '.';

const at = new Date();
const rolledUpAt = '2023-01-01T00:00:00Z';

describe('LiveRuleValue', () => {
  beforeEach(() => {
    mockUseFetchMeasurementTypes();
  });

  it('renders an icon for no data', () => {
    const metric = buildMetric({ alertRules: [buildAlertRule({})] });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={undefined} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(158, 158, 158)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).toBeInTheDocument();
  });

  it('renders a numerical value marked as in range', () => {
    const metric = buildMetric({ alertRules: [buildAlertRule({ rules: [{ time: 0, gte: 0, lte: 10 }] })] });
    const observation = buildRolledUpByTimeObservation({ median: 5, rolledUpAt });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={observation} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(76, 175, 80)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('5 C');
  });

  it('renders a numerical value marked as out of range', () => {
    const metric = buildMetric({ alertRules: [buildAlertRule({ rules: [{ time: 0, gte: 0, lte: 10 }] })] });
    const observation = buildRolledUpByTimeObservation({ median: 15, rolledUpAt });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={observation} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(244, 67, 54)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('15 C');
  });

  it('renders a numerical value marked as no data (no rule)', () => {
    const metric = buildMetric({ alertRules: [buildAlertRule({ rules: [] })] });
    const observation = buildRolledUpByTimeObservation({ median: 5, rolledUpAt });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={observation} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(158, 158, 158)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('5 C');
  });

  it('renders a non-numerical value marked as in range', () => {
    const metric = buildMetric({
      measurementType: 'CATEGORICAL_STATE',
      alertRules: [buildAlertRule({ rules: [{ time: 0, eq: '2' }] })],
    });
    const observation = buildRolledUpByTimeObservation({ value: '3', rolledUpAt });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={observation} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(76, 175, 80)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('3');
  });

  it('renders a non-numerical value marked as out of range', () => {
    const metric = buildMetric({
      measurementType: 'CATEGORICAL_STATE',
      alertRules: [buildAlertRule({ rules: [{ time: 0, eq: '2' }] })],
    });
    const observation = buildRolledUpByTimeObservation({ value: '2', rolledUpAt });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={observation} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(244, 67, 54)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('2');
  });

  it('renders a non-numerical value marked as no data (no rule)', () => {
    const metric = buildMetric({ measurementType: 'CATEGORICAL_STATE', alertRules: [buildAlertRule({ rules: [] })] });
    const observation = buildRolledUpByTimeObservation({ value: '2', rolledUpAt });

    const { queryByTestId } = render(
      <LiveRuleValue metric={metric} alertRule={metric.alertRules[0]} at={at} observation={observation} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveStyle('color: rgb(158, 158, 158)');
    expect(queryByTestId(dataTestIds.liveStatus.noData)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('2');
  });
});
