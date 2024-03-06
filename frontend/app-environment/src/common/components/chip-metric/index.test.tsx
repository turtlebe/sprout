import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { mockAlertRules, mockMetrics } from '../../test-helpers';
import { getAlertRuleTypeLabel, getMeasurementTypeLabel } from '../../utils';

import { ChipMetric, dataTestIdsChipMetric as dataTestIds } from '.';

const [metric] = mockMetrics;
const [alertRule] = mockAlertRules;

describe('ChipMetric', () => {
  it('renders a Metric', () => {
    const { queryByTestId } = render(<ChipMetric metric={metric} />);

    expect(queryByTestId(dataTestIds.type)).toHaveTextContent('Metric');
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(metric.path));
    expect(queryByTestId(dataTestIds.measurementTypeAndObservationName)).toHaveTextContent(
      getMeasurementTypeLabel(metric.measurementType)
    );
    expect(queryByTestId(dataTestIds.measurementTypeAndObservationName)).toHaveTextContent(metric.observationName);
    expect(queryByTestId(dataTestIds.alertRule)).not.toBeInTheDocument();
  });

  it('renders a Metric with its AlertRule information', () => {
    const { queryByTestId } = render(<ChipMetric metric={metric} alertRule={alertRule} />);

    expect(queryByTestId(dataTestIds.alertRule)).toHaveTextContent(getAlertRuleTypeLabel(alertRule.alertRuleType));
    expect(queryByTestId(dataTestIds.alertRule)).toHaveTextContent(alertRule.description);
  });
});
