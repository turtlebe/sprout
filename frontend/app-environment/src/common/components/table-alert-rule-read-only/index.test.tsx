import { dataTestIdsNoConfigurationPlaceholder } from '@plentyag/app-environment/src/common/components/no-configuration-placeholder';
import { buildAlertRule, mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { getIntervalStartWithoutDst } from '@plentyag/app-environment/src/common/utils';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { AlertRuleType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTableAlertRuleReadOnly as dataTestIds, TableAlertRuleReadOnly } from '.';

const [metric] = mockMetrics;

const onConfigure = jest.fn();

mockUseFetchMeasurementTypes();

describe('TableAlertRuleReadOnly', () => {
  beforeEach(() => {
    onConfigure.mockRestore();
  });

  it('renders nothing for an NON_NUMERICAL AlertRule', () => {
    const [mockAlertRule] = mockAlertRules;
    const alertRule = {
      ...mockAlertRule,
      alertRuleType: AlertRuleType.nonNumerical,
    };

    const { container } = render(
      <TableAlertRuleReadOnly metric={metric} alertRule={alertRule} onConfigure={onConfigure} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a placeholder when the AlertRule is not configured', () => {
    const [mockAlertRule] = mockAlertRules;
    const alertRule = { ...mockAlertRule, rules: undefined };

    const { container, queryByTestId } = render(
      <TableAlertRuleReadOnly metric={metric} alertRule={alertRule} onConfigure={onConfigure} />
    );

    expect(container).toHaveTextContent('The AlertRule is not configured yet, start editing it now.');
    expect(onConfigure).not.toHaveBeenCalled();

    queryByTestId(dataTestIdsNoConfigurationPlaceholder.cta).click();

    expect(onConfigure).toHaveBeenCalled();
  });

  it('renders a table containing the rule info', () => {
    const [alertRule] = mockAlertRules;

    const { queryByTestId } = render(
      <TableAlertRuleReadOnly metric={metric} alertRule={alertRule} onConfigure={onConfigure} />
    );

    expect(alertRule.rules).not.toHaveLength(0);

    alertRule.rules.forEach(rule => {
      expect(queryByTestId(dataTestIds.tableRow(rule))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(rule))).toHaveTextContent(
        getIntervalStartWithoutDst(alertRule).add(rule.time, 'seconds').format('hh:mm A')
      );
      expect(queryByTestId(dataTestIds.cellMin(rule))).toHaveTextContent(`${rule.gte}`);
      expect(queryByTestId(dataTestIds.cellMax(rule))).toHaveTextContent(`${rule.lte}`);
    });
  });

  it('renders a rule with "gte" only', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, gte: 0 }] });
    const { queryByTestId } = render(
      <TableAlertRuleReadOnly metric={metric} alertRule={alertRule} onConfigure={onConfigure} />
    );

    expect(queryByTestId(dataTestIds.cellMin(alertRule.rules[0]))).toHaveTextContent('0');
    expect(queryByTestId(dataTestIds.cellMax(alertRule.rules[0]))).toHaveTextContent('--');
  });

  it('renders a rule with "lte" only', () => {
    const alertRule = buildAlertRule({ rules: [{ time: 0, lte: 0 }] });
    const { queryByTestId } = render(
      <TableAlertRuleReadOnly metric={metric} alertRule={alertRule} onConfigure={onConfigure} />
    );

    expect(queryByTestId(dataTestIds.cellMin(alertRule.rules[0]))).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.cellMax(alertRule.rules[0]))).toHaveTextContent('0');
  });
});
