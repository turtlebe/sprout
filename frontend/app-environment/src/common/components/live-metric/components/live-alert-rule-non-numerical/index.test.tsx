import { buildAlertRule } from '@plentyag/app-environment/src/common/test-helpers';
import { getNonNumericalRuleOperator } from '@plentyag/app-environment/src/common/utils';
import { LiveStatus } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsLiveAlertRuleNonNumerical as dataTestIds, LiveAlertRuleNonNumerical } from '.';

const endDateTime = new Date();
const alertRule = buildAlertRule({ rules: [{ time: 0, eq: '1' }] });

describe('LiveAlertRuleNonNumerical', () => {
  it('renders a description of the rule', () => {
    const { queryByTestId } = render(
      <LiveAlertRuleNonNumerical alertRule={alertRule} endDateTime={endDateTime} status={LiveStatus.inRange} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(getNonNumericalRuleOperator(alertRule.rules[0]));
    expect(queryByTestId(dataTestIds.root)).toHaveStyle({ color: 'rgb(76, 175, 80)' });
  });

  it('renders with a color representing the status ', () => {
    const { queryByTestId } = render(
      <LiveAlertRuleNonNumerical alertRule={alertRule} endDateTime={endDateTime} status={LiveStatus.outOfRange} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(getNonNumericalRuleOperator(alertRule.rules[0]));
    expect(queryByTestId(dataTestIds.root)).toHaveStyle({ color: 'rgb(244, 67, 54)' });
  });
});
