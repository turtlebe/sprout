import { dataTestIdsFormSnoozeAlerts } from '@plentyag/app-environment/src/common/components/form-snooze-alerts';
import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { dataTestIdsDropdownAlerts as dataTestIds, DropdownAlerts, getDropdownAlertsDataTestIds } from '.';

const snoozedUntil = '2030-01-01T00:00:00.000Z';
const disabledAlertRules = [...mockAlertRules.map(alertRule => ({ ...alertRule, isEnabled: false }))];
const snoozedAlertRules = [
  ...mockAlertRules.map(alertRule => ({ ...alertRule, snoozedUntil: moment(snoozedUntil).format() })),
];

describe('DropdownAlerts', () => {
  it('renders nothing when no AlertRules are passed as a prop', () => {
    const { container } = render(<DropdownAlerts alertRules={[]} onAlertRuleChanges={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('turns OFF Alerts', () => {
    const onAlertRuleChanges = jest.fn();
    const { queryByTestId } = render(
      <DropdownAlerts alertRules={mockAlertRules} onAlertRuleChanges={onAlertRuleChanges} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts ON');
    expect(queryByTestId(dataTestIds.on)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.off)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snooze)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.on)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.off)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snooze)).toBeInTheDocument();

    queryByTestId(dataTestIds.off).click();

    expect(onAlertRuleChanges).toHaveBeenCalledWith(disabledAlertRules);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts OFF');
  });

  it('turns ON Alerts', () => {
    const onAlertRuleChanges = jest.fn();
    const { queryByTestId } = render(
      <DropdownAlerts alertRules={disabledAlertRules} onAlertRuleChanges={onAlertRuleChanges} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts OFF');

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.on).click();

    expect(onAlertRuleChanges).toHaveBeenCalledWith(mockAlertRules);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts ON');
  });

  it('snoozes Alerts', () => {
    const onAlertRuleChanges = jest.fn();
    const { queryByTestId } = render(
      <DropdownAlerts alertRules={mockAlertRules} onAlertRuleChanges={onAlertRuleChanges} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts ON');
    expect(queryByTestId(dataTestIds.formSnooze.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.snooze).click();

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.formSnooze.root)).toBeInTheDocument();

    changeTextField(dataTestIds.formSnooze.keyboardDateTimePicker, moment(snoozedUntil).format(FORMAT));

    queryByTestId(dataTestIds.formSnooze.submit).click();

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts Snoozed');
    expect(queryByTestId(dataTestIds.formSnooze.root)).not.toBeInTheDocument();
    expect(onAlertRuleChanges).toHaveBeenCalledWith(snoozedAlertRules);
  });

  it('returns custom dataTestIds', () => {
    expect(getDropdownAlertsDataTestIds('prefix')).toEqual({
      root: 'prefix',
      on: 'prefixdropdown-alerts-on',
      off: 'prefixdropdown-alerts-off',
      snooze: 'prefixdropdown-alerts-snooze',
      formSnooze: `prefix${dataTestIdsFormSnoozeAlerts}`,
    });
  });

  it('overrides the default displayed alert rule state to blank', () => {
    const onAlertRuleChanges = jest.fn();
    const { queryByTestId } = render(
      <DropdownAlerts
        alertRules={disabledAlertRules}
        onAlertRuleChanges={onAlertRuleChanges}
        defaultAlertRuleForUI={null}
      />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('');

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.on).click();

    expect(onAlertRuleChanges).toHaveBeenCalledWith(mockAlertRules);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts ON');
  });

  it('overrides the default displayed alert rule state to on', () => {
    const onAlertRuleChanges = jest.fn();
    const { queryByTestId } = render(
      <DropdownAlerts
        alertRules={disabledAlertRules}
        onAlertRuleChanges={onAlertRuleChanges}
        defaultAlertRuleForUI={mockAlertRules[0]}
      />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts ON');

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.off).click();

    expect(onAlertRuleChanges).toHaveBeenCalledWith(disabledAlertRules);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alerts OFF');
  });
});
