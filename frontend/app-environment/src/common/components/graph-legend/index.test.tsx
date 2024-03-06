import { getLastPathSegmentFromStringPath, getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { buildMetric, mockAlertRules, mockMetrics, mockScheduleDefinitions, mockSchedules } from '../../test-helpers';
import { getAlertRuleTypeLabel, getColorGenerator } from '../../utils';

import { dataTestIdsGraphLegend as dataTestIds, GraphLegend } from '.';

describe('GraphLegend', () => {
  it('renders nothing', () => {
    const { queryByTestId } = render(<GraphLegend />);

    expect(queryByTestId(dataTestIds.root)).toBeEmptyDOMElement();
  });

  it('renders a legend for alertRules', () => {
    const { queryByTestId } = render(<GraphLegend alertRules={mockAlertRules} />);

    expect(mockAlertRules.length).toBeGreaterThan(0);

    mockAlertRules.forEach(alertRule => {
      expect(queryByTestId(dataTestIds.alertRule(alertRule))).toHaveTextContent(
        getAlertRuleTypeLabel(alertRule.alertRuleType)
      );
    });
  });

  it('renders a legend for observations (data)', () => {
    const { queryByTestId } = render(<GraphLegend observations={[]} />);

    expect(queryByTestId(dataTestIds.data)).toHaveTextContent('Data');
  });

  it('renders a legend for a schedule', () => {
    const scheduleDefinitionWithSingleValue = mockScheduleDefinitions.find(sd => sd.action.supportedKeys.length === 0);
    const { queryByTestId } = render(
      <GraphLegend schedule={mockSchedules[0]} scheduleDefinition={scheduleDefinitionWithSingleValue} />
    );

    expect(queryByTestId(dataTestIds.scheduleDefinition(undefined))).toHaveTextContent('Schedule');
  });

  it('renders a legend for a schedule with multiple values', () => {
    const scheduleDefinitionWithSingleValue = mockScheduleDefinitions.find(sd => sd.action.supportedKeys.length > 0);
    const { queryByTestId } = render(
      <GraphLegend schedule={mockSchedules[0]} scheduleDefinition={scheduleDefinitionWithSingleValue} />
    );

    scheduleDefinitionWithSingleValue.action.supportedKeys.forEach(key => {
      expect(queryByTestId(dataTestIds.scheduleDefinition(key))).toHaveTextContent(`Schedule ${key}`);
    });
  });

  it('renders a legend for multiple schedules', () => {
    const { queryByTestId } = render(<GraphLegend schedules={mockSchedules} />);

    expect(queryByTestId(dataTestIds.schedule(mockSchedules[0]))).toHaveTextContent(
      getShortenedPath(mockSchedules[0].path)
    );
    expect(queryByTestId(dataTestIds.schedule(mockSchedules[1]))).toHaveTextContent(
      getShortenedPath(mockSchedules[1].path)
    );
  });

  it('renders a legend for metrics', () => {
    const colorGenerator = getColorGenerator();
    const metrics = [
      buildMetric({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/ThermalSystem' }),
      buildMetric({ path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom2/machines/ThermalSystem' }),
    ];
    const metricsWithObservations = metrics.map(metric => ({
      metric,
      observations: [],
      colors: colorGenerator.next().value,
    }));

    const { queryByTestId } = render(
      <GraphLegend
        metricsWithObservations={metricsWithObservations}
        selectedMetric={metricsWithObservations[0].metric}
      />
    );

    ['GrowRoom1/ThermalSystem', 'GrowRoom2/ThermalSystem'].forEach((remainingPath, index) => {
      const metric = metrics[index];
      expect(queryByTestId(dataTestIds.buttonMetric(metric))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.metric(metric))).toHaveTextContent(
        `${remainingPath} - ${metric.observationName}`
      );
    });
  });

  it('renders a legend for clickable metrics', () => {
    const colorGenerator = getColorGenerator();
    const metricsWithObservations = mockMetrics.map(metric => ({
      metric,
      observations: [],
      colors: colorGenerator.next().value,
    }));
    const onSelectMetric = jest.fn();

    const { queryByTestId } = render(
      <GraphLegend
        metricsWithObservations={metricsWithObservations}
        selectedMetric={metricsWithObservations[0].metric}
        onSelectMetric={onSelectMetric}
      />
    );

    expect(mockMetrics.length).toBeGreaterThan(0);

    mockMetrics.forEach(metric => {
      expect(queryByTestId(dataTestIds.metric(metric))).toHaveTextContent(
        `${getLastPathSegmentFromStringPath(metric?.path)} - ${metric?.observationName}`
      );
    });

    expect(queryByTestId(dataTestIds.buttonMetric(mockMetrics[0]))).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.buttonMetric(mockMetrics[1]))).toHaveAttribute('aria-selected', 'false');
    expect(onSelectMetric).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.buttonMetric(mockMetrics[1])).click();

    expect(onSelectMetric).toHaveBeenCalledWith(mockMetrics[1]);
  });
});
