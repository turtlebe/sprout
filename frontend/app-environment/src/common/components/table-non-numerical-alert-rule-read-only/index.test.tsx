import { dataTestIdsNoConfigurationPlaceholder } from '@plentyag/app-environment/src/common/components/no-configuration-placeholder';
import { mockMetrics, mockNonNumericalAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { getIntervalStart } from '@plentyag/app-environment/src/common/utils';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { AlertRuleType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTableNonNumericalAlertRuleReadOnly as dataTestIds, TableNonNumericalAlertRuleReadOnly } from '.';

const [metric] = mockMetrics;
const [alertRule] = mockNonNumericalAlertRules;

const onConfigure = jest.fn();

mockUseFetchMeasurementTypes();

describe('TableNonNumericalAlertRuleReadOnly', () => {
  beforeEach(() => {
    onConfigure.mockRestore();
  });

  it('renders nothing for a SPEC_LIMIT AlertRule', () => {
    const { container } = render(
      <TableNonNumericalAlertRuleReadOnly
        metric={metric}
        alertRule={{ ...alertRule, alertRuleType: AlertRuleType.specLimit }}
        onConfigure={onConfigure}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a placeholder when the AlertRule is not configured', () => {
    const { container, queryByTestId } = render(
      <TableNonNumericalAlertRuleReadOnly
        metric={metric}
        alertRule={{ ...alertRule, rules: undefined }}
        onConfigure={onConfigure}
      />
    );

    expect(container).toHaveTextContent('The AlertRule is not configured yet, start editing it now.');
    expect(onConfigure).not.toHaveBeenCalled();

    queryByTestId(dataTestIdsNoConfigurationPlaceholder.cta).click();

    expect(onConfigure).toHaveBeenCalled();
  });

  it('renders a table containing the rule info', () => {
    const { queryByTestId } = render(
      <TableNonNumericalAlertRuleReadOnly metric={metric} alertRule={{ ...alertRule }} onConfigure={onConfigure} />
    );

    expect(alertRule.rules).toHaveLength(2);

    const [rule1, rule2] = alertRule.rules;

    expect(queryByTestId(dataTestIds.tableRow(rule1))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cellOperation(rule1))).toHaveTextContent('Equals to');
    expect(queryByTestId(dataTestIds.cellValue(rule1))).toHaveTextContent(rule1.eq);
    expect(queryByTestId(dataTestIds.cellTime(rule1))).toHaveTextContent(
      getIntervalStart(alertRule, new Date(), 1).add(rule1.time, 'seconds').format('hh:mm A')
    );

    expect(queryByTestId(dataTestIds.cellOperation(rule2))).toHaveTextContent('Contains');
    expect(queryByTestId(dataTestIds.cellValue(rule2))).toHaveTextContent(rule2.contains);
    expect(queryByTestId(dataTestIds.cellTime(rule2))).toHaveTextContent(
      getIntervalStart(alertRule, new Date(), 1).add(rule2.time, 'seconds').format('hh:mm A')
    );
  });
});
