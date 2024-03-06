import { buildMetric, mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { DEFAULT_METRIC_STATE } from '../../hooks';

import { dataTestIdsGraphMetricsSettings as dataTestIds, GraphMetricsSettings } from '.';

const metrics: Metric[] = [
  buildMetric({
    path: 'sites/LAX1/areas/VerticalGrowRoom/lines/GrowRoom1/machines/Nutrient',
    alertRules: mockAlertRules,
  }),
  buildMetric({ path: 'sites/LAX1/areas/VerticalGrowRoom/lines/GrowRoom2/machines/Nutrient' }),
];

const [metricA, metricB] = metrics;

const state = {
  timeSummarization: TimeSummarization.median,
  timeGranularity: 5,
  metrics: {
    [metricA.id]: DEFAULT_METRIC_STATE,
    [metricB.id]: DEFAULT_METRIC_STATE,
  },
};

const onShowAllData = jest.fn();
const onShowAllSpecLimits = jest.fn();
const onShowAllControlLimits = jest.fn();
const onShowData = jest.fn();
const onShowSpecLimit = jest.fn();
const onShowControlLimit = jest.fn();

function renderGraphMetricsSettings(state) {
  return render(
    <GraphMetricsSettings
      state={state}
      metrics={metrics}
      onShowAllData={onShowAllData}
      onShowAllSpecLimits={onShowAllSpecLimits}
      onShowAllControlLimits={onShowAllControlLimits}
      onShowData={onShowData}
      onShowSpecLimit={onShowSpecLimit}
      onShowControlLimit={onShowControlLimit}
    />
  );
}

describe('GraphMetricsSettings', () => {
  beforeEach(() => {
    onShowAllData.mockRestore();
    onShowAllSpecLimits.mockRestore();
    onShowAllControlLimits.mockRestore();
    onShowData.mockRestore();
    onShowSpecLimit.mockRestore();
    onShowControlLimit.mockRestore();
  });

  it('renders based on the given state (default)', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(queryByTestId(dataTestIds.allDataCheckbox).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.allSpecLimitCheckbox).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.allControlLimitCheckbox).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.label(metricA))).toHaveTextContent(
      `GrowRoom1/Nutrient - ${metricA.observationName}`
    );
    expect(queryByTestId(dataTestIds.label(metricB))).toHaveTextContent(
      `GrowRoom2/Nutrient - ${metricA.observationName}`
    );
    expect(queryByTestId(dataTestIds.dataCheckbox(metricA)).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.specLimitCheckbox(metricA)).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.controlLimitCheckbox(metricA)).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.dataCheckbox(metricA))).toHaveAttribute('aria-disabled', 'false');
    expect(queryByTestId(dataTestIds.specLimitCheckbox(metricA))).toHaveAttribute('aria-disabled', 'false');
    expect(queryByTestId(dataTestIds.controlLimitCheckbox(metricA))).toHaveAttribute('aria-disabled', 'false');
    expect(queryByTestId(dataTestIds.dataCheckbox(metricB))).toHaveAttribute('aria-disabled', 'false');
    expect(queryByTestId(dataTestIds.specLimitCheckbox(metricB))).toHaveAttribute('aria-disabled', 'true');
    expect(queryByTestId(dataTestIds.controlLimitCheckbox(metricB))).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders based on the given state (default)', () => {
    const { queryByTestId } = renderGraphMetricsSettings({
      ...state,
      metrics: {
        ...state.metrics,
        [metricA.id]: { showData: false, showSpecLimit: true, showControlLimit: false },
      },
    });

    expect(queryByTestId(dataTestIds.allDataCheckbox).querySelector('input')).not.toBeChecked();
    expect(queryByTestId(dataTestIds.allSpecLimitCheckbox).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.allControlLimitCheckbox).querySelector('input')).not.toBeChecked();
    expect(queryByTestId(dataTestIds.dataCheckbox(metricA)).querySelector('input')).not.toBeChecked();
    expect(queryByTestId(dataTestIds.specLimitCheckbox(metricA)).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.controlLimitCheckbox(metricA)).querySelector('input')).not.toBeChecked();
    expect(queryByTestId(dataTestIds.dataCheckbox(metricA))).toHaveAttribute('aria-disabled', 'false');
    expect(queryByTestId(dataTestIds.specLimitCheckbox(metricA))).toHaveAttribute('aria-disabled', 'false');
    expect(queryByTestId(dataTestIds.controlLimitCheckbox(metricA))).toHaveAttribute('aria-disabled', 'false');
  });

  it('triggers `onShowAllData`', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(onShowAllData).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.allDataCheckbox).querySelector('input').click();

    expect(onShowAllData).toHaveBeenCalledWith(false);
  });

  it('triggers `onShowAllSpecLimits`', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(onShowAllSpecLimits).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.allSpecLimitCheckbox).querySelector('input').click();

    expect(onShowAllSpecLimits).toHaveBeenCalledWith(false);
  });

  it('triggers `onShowAllControlLimits`', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(onShowAllControlLimits).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.allControlLimitCheckbox).querySelector('input').click();

    expect(onShowAllControlLimits).toHaveBeenCalledWith(false);
  });

  it('triggers `onShowData`', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(onShowData).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.dataCheckbox(metricA)).querySelector('input').click();

    expect(onShowData).toHaveBeenCalledWith(metricA.id, false);
  });

  it('triggers `onShowSpecLimit`', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(onShowSpecLimit).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.specLimitCheckbox(metricA)).querySelector('input').click();

    expect(onShowSpecLimit).toHaveBeenCalledWith(metricA.id, false);
  });

  it('triggers `onShowControlLimit`', () => {
    const { queryByTestId } = renderGraphMetricsSettings(state);

    expect(onShowControlLimit).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.controlLimitCheckbox(metricA)).querySelector('input').click();

    expect(onShowControlLimit).toHaveBeenCalledWith(metricA.id, false);
  });
});
