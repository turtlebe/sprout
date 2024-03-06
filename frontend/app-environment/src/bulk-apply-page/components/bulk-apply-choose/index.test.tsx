import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { BulkApplyChoose, dataTestIdsBulkApplyChoose as dataTestIds } from '.';

const metrics = [{ ...mockMetrics[0], alertRules: mockAlertRules }, { ...mockMetrics[1] }];

const onBulkApply = jest.fn();

mockUseFetchMeasurementTypes();

describe('BulkApplyChoose', () => {
  beforeEach(() => {
    onBulkApply.mockRestore();
  });

  it('provides a preview of the selected Metric', () => {
    const { queryByTestId } = render(
      <MemoryRouter>
        <BulkApplyChoose metrics={metrics} onBulkApply={onBulkApply} isBulkApplying={false} />
      </MemoryRouter>
    );

    metrics.forEach(metric => {
      expect(queryByTestId(dataTestIds.metricRadio(metric))).toBeInTheDocument();
      expect(getInputByName(dataTestIds.metricRadio(metrics[0]))).not.toBeChecked();
      expect(getInputByName(dataTestIds.metricRadio(metrics[0]))).not.toBeDisabled();
      metric.alertRules.forEach(alertRule => {
        expect(queryByTestId(dataTestIds.selectedMetricAlertRuleTab(alertRule))).not.toBeInTheDocument();
        expect(queryByTestId(dataTestIds.selectedMetricAlertRuleTabPanel(alertRule))).not.toBeInTheDocument();
      });
    });

    expect(queryByTestId(dataTestIds.selectedMetricMinMax)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApply)).toBeDisabled();

    getInputByName(dataTestIds.metricRadio(metrics[0])).click();

    expect(getInputByName(dataTestIds.metricRadio(metrics[0]))).toBeChecked();
    expect(queryByTestId(dataTestIds.selectedMetricMinMax)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.selectedMetricAlertRuleTab(metrics[0].alertRules[0]))).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(queryByTestId(dataTestIds.selectedMetricAlertRuleTabPanel(metrics[0].alertRules[0]))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.selectedMetricAlertRuleTab(metrics[0].alertRules[1]))).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(
      queryByTestId(dataTestIds.selectedMetricAlertRuleTabPanel(metrics[0].alertRules[1]))
    ).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.bulkApply)).not.toBeDisabled();
    expect(onBulkApply).not.toHaveBeenCalled();
  });

  it('disables all the CTAs while bulk applying', () => {
    const { queryByTestId } = render(
      <MemoryRouter>
        <BulkApplyChoose metrics={metrics} onBulkApply={onBulkApply} isBulkApplying={true} />
      </MemoryRouter>
    );

    metrics.forEach(metric => {
      expect(queryByTestId(dataTestIds.metricRadio(metric))).toBeInTheDocument();
      expect(getInputByName(dataTestIds.metricRadio(metrics[0]))).not.toBeChecked();
      expect(getInputByName(dataTestIds.metricRadio(metrics[0]))).toBeDisabled();
    });

    expect(onBulkApply).not.toHaveBeenCalled();
  });

  it('calls `onBulkApply`', () => {
    const { queryByTestId, rerender } = render(
      <MemoryRouter>
        <BulkApplyChoose metrics={metrics} onBulkApply={onBulkApply} isBulkApplying={false} />
      </MemoryRouter>
    );

    getInputByName(dataTestIds.metricRadio(metrics[1])).click();
    queryByTestId(dataTestIds.bulkApply).click();

    expect(onBulkApply).toHaveBeenCalledWith(metrics[1]);

    rerender(
      <MemoryRouter>
        <BulkApplyChoose metrics={metrics} onBulkApply={onBulkApply} isBulkApplying={true} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.bulkApply)).toBeDisabled();
  });
});
