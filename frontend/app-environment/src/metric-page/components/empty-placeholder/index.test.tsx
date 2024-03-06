import { ButtonCreateAlertRule } from '@plentyag/app-environment/src/common/components';
import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { EmptyPlaceholder } from '.';

jest.mock('@plentyag/app-environment/src/common/components/button-create-alert-rule');

const MockButtonCreateAlertRule = ButtonCreateAlertRule as jest.Mock;

const [metric] = mockMetrics;
const onAlertRuleCreated = jest.fn();
const button = 'button';

describe('EmptyPlaceholder', () => {
  beforeEach(() => {
    MockButtonCreateAlertRule.mockImplementation(({ onSuccess }) => (
      <div data-testid={button} onClick={() => onSuccess()} />
    ));
    onAlertRuleCreated.mockRestore();
  });

  it('renders with a CTA to create alert rules', () => {
    const { container, queryByTestId } = render(
      <EmptyPlaceholder metric={metric} onAlertRuleCreated={onAlertRuleCreated} />
    );

    expect(container).toHaveTextContent('No Alert Rules.');
    expect(onAlertRuleCreated).not.toHaveBeenCalled();

    queryByTestId(button).click();

    expect(onAlertRuleCreated).toHaveBeenCalled();
  });
});
