import { render } from '@testing-library/react';
import React from 'react';

import { mockAlertRules } from '../../test-helpers';
import { getAlertRuleTypeLabel } from '../../utils';

import { OptionAlertRule } from '.';

const [alertRule] = mockAlertRules;

describe('OptionAlertRule', () => {
  it('renders an AlertRule', () => {
    const { container } = render(<OptionAlertRule alertRule={alertRule} />);

    expect(container).toHaveTextContent(getAlertRuleTypeLabel(alertRule.alertRuleType));
    expect(container).toHaveTextContent(alertRule.description);
  });
});
