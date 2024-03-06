import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { DashboardAlertRuleHeader, dataTestIdsDashboardAlertRuleHeader as dataTestIds } from '.';

const mockOnHeaderAlertRuleChanges = jest.fn();

describe('DashboardAlertRuleHeader', () => {
  it('renders header with no alerts in Dashboard', () => {
    const { queryByTestId } = render(
      <DashboardAlertRuleHeader alerts={[]} onHeaderAlertRuleChanges={mockOnHeaderAlertRuleChanges} />
    );

    expect(queryByTestId(dataTestIds.headerNoAlertRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.headerNoAlertRulesMessage)).toHaveTextContent(
      'The Metrics associated with this Dashboard have no alert rules.'
    );
  });

  it('renders header with alerts ON in dashboard (All alert rules ON)', () => {
    const { queryByTestId } = render(
      <DashboardAlertRuleHeader alerts={mockAlertRules} onHeaderAlertRuleChanges={mockOnHeaderAlertRuleChanges} />
    );

    expect(queryByTestId(dataTestIds.headerAlertRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.headerDropdown)).toHaveTextContent('Alerts ON');
  });

  it('renders header with alerts OFF in dashboard (All alert rules OFF)', () => {
    const mockDisabledAlertRules = mockAlertRules.map(alertRule => {
      return { ...alertRule, isEnabled: false };
    });

    const { queryByTestId } = render(
      <DashboardAlertRuleHeader
        alerts={mockDisabledAlertRules}
        onHeaderAlertRuleChanges={mockOnHeaderAlertRuleChanges}
      />
    );

    expect(queryByTestId(dataTestIds.headerAlertRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.headerDropdown)).toHaveTextContent('Alerts OFF');
  });

  it('renders header with alerts SNOOZED in dashboard (All alert rules SNOOZED)', () => {
    const snoozeUntilDate = moment('2030-12-01T00:00:00Z');
    const mockSnoozedAlertRules = mockAlertRules.map(alertRule => {
      return { ...alertRule, snoozedUntil: snoozeUntilDate.toISOString() };
    });

    const { queryByTestId } = render(
      <DashboardAlertRuleHeader
        alerts={mockSnoozedAlertRules}
        onHeaderAlertRuleChanges={mockOnHeaderAlertRuleChanges}
      />
    );

    expect(queryByTestId(dataTestIds.headerAlertRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.headerDropdown)).toHaveTextContent(
      `Alerts Snoozed: ${snoozeUntilDate.format(FORMAT)}`
    );
  });

  it('renders header with no pre-selected alerts state in dashboard (Alerts with different states)', () => {
    const mockDifferentAlertRuleStates = mockAlertRules.map((alertRule, index) => {
      if (index == 1) {
        return { ...alertRule, isEnabled: false };
      } else {
        return alertRule;
      }
    });

    const { queryByTestId } = render(
      <DashboardAlertRuleHeader
        alerts={mockDifferentAlertRuleStates}
        onHeaderAlertRuleChanges={mockOnHeaderAlertRuleChanges}
      />
    );

    expect(queryByTestId(dataTestIds.headerAlertRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.headerDropdown)).toHaveTextContent('');
  });
});
