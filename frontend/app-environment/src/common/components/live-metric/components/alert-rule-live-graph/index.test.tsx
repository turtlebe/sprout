import { buildAlertRule } from '@plentyag/app-environment/src/common/test-helpers';
import { AlertRuleWithLiveStatus, LiveStatus } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { AlertRuleLiveGraph, dataTestIdsAlertRuleLiveGraph as dataTestIds } from '.';

const at = new Date();
const unitSymbol = 'C';
const observationValue = 20;

function renderAlertRuleLiveGraph(alertRule: AlertRuleWithLiveStatus) {
  return render(
    <AlertRuleLiveGraph
      alertRule={alertRule}
      unitSymbol={unitSymbol}
      endDateTime={at}
      observationValue={observationValue}
    />
  );
}
describe('AlertRuleLiveGraph', () => {
  it('renders a graph', () => {
    const alertRule = { ...buildAlertRule({}), status: LiveStatus.inRange };

    const { queryByTestId } = renderAlertRuleLiveGraph(alertRule);

    expect(queryByTestId(dataTestIds.graph)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.label)).not.toBeInTheDocument();
  });

  it('renders text when the alert rule is one sided', () => {
    const alertRule = { ...buildAlertRule({ rules: [{ time: 0, gte: 100 }] }), status: LiveStatus.inRange };

    const { queryByTestId } = renderAlertRuleLiveGraph(alertRule);

    expect(queryByTestId(dataTestIds.graph)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.label)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.label)).toHaveTextContent('100 C (min) >= 20 C (value)');
  });
});
